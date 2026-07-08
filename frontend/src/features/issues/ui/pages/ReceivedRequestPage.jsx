import { useEffect, useState } from "react";
import { useIssue } from "../../hooks/useIssue";
import { receivedCols } from "../../../../data/table.js";
import Table from "../../../../components/Tables/Table.jsx";

const ReceivedRequestPage = () => {
  const { fetchIssues, issues } = useIssue();
  const [appPage, setAppPage] = useState(1);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const receivedRequests = (issues || []).filter(
    (req) => req.status === "RECEIVED",
  );

  const recentReceived = receivedRequests.map((req) => ({
    date: new Date(req.receivedAt || req.updatedAt).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ),
    item: req.items.map((i) => i.productName).join(", "),
    reqId: req.requestId,
    qty:
      req.items.reduce((sum, item) => sum + Number(item.receivedQty || 0), 0) +
      " Units",
    user: req.department ? `${req.fullname} (${req.department})` : req.fullname,
    receiver: req.fullname, // Or `req.approvedBy` if available in the future
  }));

  const RECEIVED_PER_PAGE = 8;
  const appTotalPages =
    Math.ceil(recentReceived.length / RECEIVED_PER_PAGE) || 1;
  const appStart = (appPage - 1) * RECEIVED_PER_PAGE;
  const appItems = recentReceived.slice(appStart, appStart + RECEIVED_PER_PAGE);

  return (
    <Table
      columns={receivedCols}
      invItems={appItems}
      invTotalPages={appTotalPages}
      items={appItems}
      invStart={appStart}
      invPage={appPage}
      setInvPage={setAppPage}
      ITEMS_PER_PAGE={RECEIVED_PER_PAGE}
      title="Recent Received (History)"
    />
  );
};

export default ReceivedRequestPage;
