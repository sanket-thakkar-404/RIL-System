export const approvalMailTemplate = ({
  fullname,
  requestId,
  department,
  approvedBy,
  items,
}) => {

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>${item.productId}</td>
          <td>${item.productName}</td>
          <td>${item.category}</td>
          <td align="center">${item.qty}</td>
          <td align="center">
            <b>${item.approveQty}</b>
          </td>
        </tr>
      `
    )
    .join("");
  return `
<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family: Arial, sans-serif;
}

.container {
  max-width:650px;
  margin:auto;
  background:white;
  border-radius:10px;
  overflow:hidden;
}

.header {
 background:#006c49;
 color:white;
 padding:20px;
 text-align:center;
}

.content {
 padding:25px;
}

.badge {
 background:#d1fae5;
 color:#006c49;
 padding:8px 15px;
 border-radius:20px;
 display:inline-block;
 font-weight:bold;
}
table {
 width:100%;
 border-collapse:collapse;
 margin-top:20px;
}
th {
 background:#e4efff;
 padding:10px;
 text-align:left;
}

td {
 border-bottom:1px solid #ddd;
 padding:10px;
}

.footer {
 background:#f8fafc;
 padding:15px;
 text-align:center;
 color:#64748b;
 font-size:12px;
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h2>
      Inventory Request Approved
    </h2>
  </div>

  <div class="content">
    <span class="badge">
      APPROVED
    </span>
    <p>
      Hello 
      <b>${fullname}</b>,
    </p>
    <p>
      Your inventory request has been approved successfully.
    </p>
    <p>
      <b>Request ID:</b> ${requestId}
      <br/>
      <b>Department:</b> ${department}
      <br/>
      <b>Approved By:</b> ${approvedBy}
    </p>
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Item</th>
          <th>Category</th>
          <th>Request Qty</th>
          <th>Approved Qty</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
    <p style="margin-top:25px">
      Please collect your approved inventory items.
    </p>
  </div>

  <div class="footer">
    Inventory Management System<br/>
    This is an automated email.
  </div>
</div>

</body>
</html>
`;
};

export const receivedMailTemplate = ({
  fullname,
  requestId,
  department,
  receivedBy,
  items,
}) => {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>${item.productId}</td>
          <td>${item.productName}</td>
          <td>${item.category}</td>
          <td align="center">${item.qty}</td>
          <td align="center">
            <b>${item.approveQty}</b>
          </td>
          <td align="center">
            <b>${item.receivedQty}</b>
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family: Arial, sans-serif;
}

.container {
  max-width:650px;
  margin:auto;
  background:white;
  border-radius:10px;
  overflow:hidden;
}

.header {
 background:#2563eb;
 color:white;
 padding:20px;
 text-align:center;
}

.content {
 padding:25px;
}

.badge {
 background:#dbeafe;
 color:#1d4ed8;
 padding:8px 15px;
 border-radius:20px;
 display:inline-block;
 font-weight:bold;
}

table {
 width:100%;
 border-collapse:collapse;
 margin-top:20px;
}

th {
 background:#e4efff;
 padding:10px;
 text-align:left;
}

td {
 border-bottom:1px solid #ddd;
 padding:10px;
}

.footer {
 background:#f8fafc;
 padding:15px;
 text-align:center;
 color:#64748b;
 font-size:12px;
}
</style>
</head>

<body>

<div class="container">

  <div class="header">
    <h2>
      Inventory Items Received
    </h2>
  </div>

  <div class="content">

    <span class="badge">
      RECEIVED
    </span>

    <p>
      Hello 
      <b>${fullname}</b>,
    </p>

    <p>
      Your approved inventory items have been received successfully.
    </p>

    <p>
      <b>Request ID:</b> ${requestId}
      <br/>
      <b>Department:</b> ${department}
      <br/>
      <b>Received By:</b> ${receivedBy}
    </p>


    <table>

      <thead>

        <tr>
          <th>Product ID</th>
          <th>Item</th>
          <th>Category</th>
          <th>Requested Qty</th>
          <th>Approved Qty</th>
          <th>Received Qty</th>
        </tr>

      </thead>


      <tbody>

        ${itemRows}

      </tbody>


    </table>


    <p style="margin-top:25px">

      The received quantity has been updated in the inventory system.

    </p>


  </div>


  <div class="footer">

    Inventory Management System<br/>

    This is an automated email.

  </div>


</div>


</body>
</html>
`;
};

export const rejectedMailTemplate = ({
  fullname,
  requestId,
  department,
  rejectedBy,
  reason,
  items,
}) => {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td>${item.productId}</td>
          <td>${item.productName}</td>
          <td>${item.category}</td>
          <td align="center">${item.qty}</td>
        </tr>
      `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin:0;
  padding:0;
  background:#f4f6f8;
  font-family: Arial, sans-serif;
}

.container {
  max-width:650px;
  margin:auto;
  background:white;
  border-radius:10px;
  overflow:hidden;
}

.header {
 background:#dc2626;
 color:white;
 padding:20px;
 text-align:center;
}

.content {
 padding:25px;
}

.badge {
 background:#fee2e2;
 color:#b91c1c;
 padding:8px 15px;
 border-radius:20px;
 display:inline-block;
 font-weight:bold;
}

.reason-box {
 background:#fef2f2;
 border-left:4px solid #dc2626;
 padding:12px;
 margin-top:15px;
 color:#7f1d1d;
}

table {
 width:100%;
 border-collapse:collapse;
 margin-top:20px;
}

th {
 background:#fee2e2;
 padding:10px;
 text-align:left;
}

td {
 border-bottom:1px solid #ddd;
 padding:10px;
}

.footer {
 background:#f8fafc;
 padding:15px;
 text-align:center;
 color:#64748b;
 font-size:12px;
}
</style>
</head>

<body>

<div class="container">


  <div class="header">

    <h2>
      Inventory Request Rejected
    </h2>

  </div>


  <div class="content">


    <span class="badge">
      REJECTED
    </span>


    <p>
      Hello 
      <b>${fullname}</b>,
    </p>


    <p>
      Your inventory request has been reviewed and rejected.
    </p>


    <p>
      <b>Request ID:</b> ${requestId}
      <br/>
      <b>Department:</b> ${department}
      <br/>
      <b>Rejected By:</b> ${rejectedBy}
    </p>


    ${reason
      ? `
        <div class="reason-box">
          <b>Reason:</b>
          <br/>
          ${reason}
        </div>
        `
      : ""
    }


    <table>


      <thead>

        <tr>
          <th>Product ID</th>
          <th>Item</th>
          <th>Category</th>
          <th>Requested Qty</th>
        </tr>

      </thead>


      <tbody>

        ${itemRows}

      </tbody>


    </table>


    <p style="margin-top:25px">

      Please contact your department admin for more information.

    </p>


  </div>


  <div class="footer">

    Inventory Management System<br/>

    This is an automated email.

  </div>


</div>


</body>
</html>
`;
};