import config from "../config/dotenv.config.js"
import transporter from "../config/mail.config.js"
import { INVENTORY } from "../constants/sheet.constant.js"
import issueModel from "../model/issue.model.js"
import { approvalMailTemplate, receivedMailTemplate, rejectedMailTemplate } from "../templates/Mail.template.js"
import { ApiError } from "../utils/apiError.js"
import { appendSheetData, getSheetData, updateSheetData } from "./googleSheet.service.js"

export const createIssueLogic = async (data) => {
  // DB se sabse bada (latest) requestId nikaalo, taaki restart pe reset na ho
  const lastIssue = await issueModel
    .findOne({ requestId: /^REQ-\d+$/ })
    .sort({ createdAt: -1 })
    .select("requestId")


  const lastNumber = lastIssue
    ? parseInt(lastIssue.requestId.split("-")[1], 10)
    : 0

  const requestId = `REQ-${String(lastNumber + 1).padStart(3, "0")}`

  const issue = await issueModel.create({
    fullname: data.fullname,
    department: data.department,
    email: data.email,
    requestId,
    items: data.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      qty: item.qty,
      stock: item.stock,
    })),
    description: data.description,
  })

  return issue
}


export const getIssueLogic = async () => {

  const issues = await issueModel.find()

  return issues
}

export const getIssueStatusLogic = async ({ id }) => {
  const issue = await issueModel.findOne({ requestId: id })
  if (!issue) {
    throw new ApiError(404, "Issue not found")
  }
  return issue
}

export const updateStatusLogic = async (id, data, status, admin) => {

  const allowedStatus = [
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "RECEIVED"
  ]

  if (!allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status"
    )
  }


  const issue = await issueModel.findOne({
    requestId: id
  })

  if (!issue) {
    throw new ApiError(
      404,
      "Issue not found"
    )
  }

  if (issue.status === "RECEIVED") {
    throw new ApiError(
      409,
      "Received issue cannot be updated"
    )
  }

  issue.status = status

  if (status === "APPROVED") {
    issue.approvedAt = new Date()
    issue.approvedBy = admin._id

    // save approveQty in database
    issue.items = issue.items.map((dbItem) => {
      const approvedItem = data.items.find(
        (item) =>
          item.productId.toString() === dbItem.productId.toString()
      );
      if (approvedItem) {
        dbItem.approveQty = approvedItem.approveQty;
      }
      return dbItem;
    });

    const values = data.items.map((item) => [
      new Date().toLocaleString(),
      id,
      item.qty,
      item.approveQty,
      item.productId,
      item.productName,
      item.category,
      data.fullname,
      data.department,
      admin.username,
      data.email,
    ]);

    await appendSheetData(INVENTORY.Range.Approved, INVENTORY.ID, values)

    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: data.email,
      subject: `Request Approved - ${data.requestId}`,
      html: approvalMailTemplate({
        fullname: data.fullname,
        requestId: data.requestId,
        department: data.department,
        approvedBy: admin.email,
        items: data.items,
      })
    })
  }

  if (status === "RECEIVED") {
    issue.receivedAt = new Date()

    // save approveQty in database
    let stock;
    issue.items = issue.items.map((dbItem) => {
      const approvedItem = data.items.find(
        (item) =>
          item.productId.toString() === dbItem.productId.toString()
      );
      if (approvedItem) {
        dbItem.receivedQty = approvedItem.receivedQty;
        stock = dbItem.stock = dbItem.stock - approvedItem.receivedQty;
      }
      return dbItem;
    });
    const storeMangerEmail = "purchase@rotocastgroup.com"


    const inventory = await getSheetData(INVENTORY.Range.STOCK, INVENTORY.ID);
    const updatePromises = data.items.map((item) => {
      const rowIndex = inventory.findIndex(
        (row) => row[0] === item.productId
      );
      if (rowIndex === -1) {
        throw new ApiError(
          404,
          `${item.productName} not found`
        );
      }

      const currentStock = Number(
        inventory[rowIndex][3]
      );

      const newStock = currentStock - Number(item.receivedQty); 

      // google sheet row
      const sheetRow = rowIndex + 2;
      const range = `Stock!D${sheetRow}`;
      return updateSheetData(
        range,
        INVENTORY.ID,
        [[newStock]]
      );

    });

    const values = data.items.map((item) => [
      new Date().toLocaleString(),
      id,
      item.qty,
      item.approveQty,
      item.receivedQty,
      item.productId,
      item.productName,
      item.category,
      data.fullname,
      data.department,
      admin.username,
      storeMangerEmail,
      stock,
    ]);

    await Promise.all([
      ...updatePromises,
      appendSheetData(INVENTORY.Range.Received, INVENTORY.ID, values)
    ])


    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: storeMangerEmail,
      subject: `Inventory Items Received - ${data.requestId}`,
      html: receivedMailTemplate({
        fullname: admin.username,
        requestId: data.requestId,
        department: data.department,
        approvedBy: admin.email,
        items: data.items,
      })
    })

  }

  if (status === "REJECTED") {
    const values = data.items.map((item) => [
      new Date().toLocaleString(),
      id,
      item.qty,
      item.productId,
      item.productName,
      item.category,
      data.fullname,
      data.department,
      admin.username,
      data.email,
    ]);

    await appendSheetData(INVENTORY.Range.Rejected, INVENTORY.ID, values)
  }

  await issue.save()

  return issue
}