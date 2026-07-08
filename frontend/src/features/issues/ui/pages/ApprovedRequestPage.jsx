import { useState, useEffect } from "react";
import { useIssue } from "../../hooks/useIssue";
import Table from "../../../../components/Tables/Table";
import { approvedCols } from "../../../../data/table";

const ApprovedRequestPage = () => {
  const { fetchIssues, issues } = useIssue();
  const [appPage, setAppPage] = useState(1);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const approvedRequests = (issues || []).filter(
    (req) => req.status === "APPROVED",
  );

  const recentApprovals = approvedRequests.map((req) => ({
    date: new Date(
      req.approvedAt || req.updatedAt || req.createdAt,
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    item: req.items.map((i) => i.productName).join(", "),
    reqId: req.requestId,
    qty:
      req.items.reduce(
        (sum, item) => sum + Number(item.approveQty || item.qty || 0),
        0,
      ) + " Units",
    user: req.department ? `${req.fullname} (${req.department})` : req.fullname,
    approver: "Admin", // Or `req.approvedBy` if available in the future
  }));

  const APPROVALS_PER_PAGE = 8;
  const appTotalPages =
    Math.ceil(recentApprovals.length / APPROVALS_PER_PAGE) || 1;
  const appStart = (appPage - 1) * APPROVALS_PER_PAGE;
  const appItems = recentApprovals.slice(
    appStart,
    appStart + APPROVALS_PER_PAGE,
  );

  return (
    <Table
      columns={approvedCols}
      invItems={appItems}
      invTotalPages={appTotalPages}
      items={appItems}
      invStart={appStart}
      invPage={appPage}
      setInvPage={setAppPage}
      ITEMS_PER_PAGE={APPROVALS_PER_PAGE}
      title="Recent Approvals (History)"
    />
  );
};

export default ApprovedRequestPage;
