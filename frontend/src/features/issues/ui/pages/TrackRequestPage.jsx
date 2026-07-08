import { useEffect, useState } from "react";
import { Search, CheckCircle2, Check, Package, Info } from "lucide-react";
import { toast } from "sonner";
import { useIssue } from "../../hooks/useIssue";
import PageHeader from "../../../../components/PageHeader";
import { getTimeline } from "../../../../data/getTimeline";

const inputStyle = {
  border: "1px solid var(--color-outline-variant)",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--text-body-sm)",
  color: "var(--color-on-surface)",
  backgroundColor: "var(--color-surface-container-lowest)",
  width: "100%",
  padding: "10px 12px",
  outline: "none",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "var(--text-label-sm)",
  fontWeight: "var(--text-label-sm--font-weight)",
  lineHeight: "var(--text-label-sm--line-height)",
  color: "var(--color-on-surface-variant)",
};

export default function TrackRequestPage() {
  const [query, setQuery] = useState();
  const [requestData, setRequestData] = useState(null);
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [receivedQtys, setReceivedQtys] = useState({});
  const [receivedLoading, setReceivedLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Redux integration available via useIssue if backend is ready
  const {
    fetchIssueStatus,
    selectedIssues,
    loading,
    error,
    changeIssueStatus,
  } = useIssue();

  useEffect(() => {
    setRequestData(selectedIssues);
    setShowReceiveForm(false);
    setReceivedQtys({});
  }, [selectedIssues]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error || "ID Not Found");
    }
  }, [error]);

  const handleChange = (e) => {
    const { value } = e.target;

    setQuery(value);
  };

  const handleConfirmReceive = async () => {
    const updatedRequestData = {
      ...requestData,
      items: requestData.items.map((item) => ({
        ...item,
        receivedQty: Number(receivedQtys[item.productId]) || 0,
      })),
    };

    console.log(updatedRequestData);

    for (const item of updatedRequestData.items) {
      const received = Number(item.receivedQty) || 0;
      console.log({
        product: item.productName,
        received: item.receivedQty,
        approved: item.approveQty,
        isGreater: item.receivedQty > item.approveQty,
        items: item
      });
      const approvedQty = Number(item.approveQty) || 0;
      if (received > approvedQty) {
        toast.error(
          `${item.productName}: Received Qty cannot be greater than Approved Qty (${approvedQty}).`,
        );
        return;
      }
      if (received <= 0) {
        toast.error(`${item.productName}: Received Qty cannot be Zero or negative.`);
        return;
      }
    }
    const status = "RECEIVED";

    const payload = {
      data: updatedRequestData,
      status,
    };
    setReceivedLoading(true);
    try {
      await changeIssueStatus(requestData.requestId, payload);
      toast.success("Received quantities confirmed");
      setShowReceiveForm(false);
    } catch (err) {
      toast.error(err?.message || err || "Failed to update status");
    } finally {
      setReceivedLoading(false);
    }
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery) return;
    setSearchLoading(true);
    try {
      // The promise resolves when Redux finishes updating.
      // The useEffect above will catch the updated selectedIssues.
      await fetchIssueStatus(searchQuery);
      toast.success("Search completed");
    } catch (err) {
      toast.error(err?.message || err || "Search failed");
      console.log(err);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
        padding: "48px 16px",
      }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <PageHeader
          title="Track Your Request Status"
          description="Enter your Request ID to see the current status of your inventory or equipment request."
        />

        {/* Search Bar */}
        <div
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: "var(--radius-lg)",
            padding: "8px",
            display: "flex",
            gap: 8,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.02)",
            marginBottom: 24,
          }}
        >
          <div style={{ position: "relative", flexGrow: 1 }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-outline)",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g., REQ-8291"
              style={{
                width: "100%",
                height: "100%",
                padding: "12px 16px 12px 42px",
                border: "none",
                fontSize: "var(--text-body-md)",
                color: "var(--color-on-surface)",
                backgroundColor: "transparent",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={searchLoading}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "0 24px",
              fontSize: "var(--text-body-sm)",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "opacity 0.2s",
              opacity: loading ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Searching..." : "Track Status"}
          </button>
        </div>

        {/* Results Card */}
        {requestData && requestData.requestId && requestData.items ? (
          <div
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-outline-variant)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px",
                borderBottom: "1px solid var(--color-outline-variant)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "var(--text-label-sm)",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: 4,
                  }}
                >
                  Request ID
                </p>
                <h2
                  style={{
                    fontSize: "var(--text-headline-md)",
                    fontWeight: 700,
                    color: "var(--color-on-surface)",
                    margin: 0,
                  }}
                >
                  #{requestData.requestId}
                </h2>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "var(--text-label-sm)",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: 4,
                  }}
                >
                  Status
                </p>
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor: "var(--color-primary-fixed)",
                    color: "var(--color-primary)",
                    padding: "4px 12px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-label-sm)",
                    fontWeight: 600,
                  }}
                >
                  {requestData.status}
                </span>
              </div>
            </div>

            {/* Requested Items */}
            <div style={{ padding: "24px" }}>
              <h3
                style={{
                  fontSize: "var(--text-label-md)",
                  fontWeight: 700,
                  color: "var(--color-on-surface-variant)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 16,
                }}
              >
                REQUESTED ITEMS
              </h3>
              <div
                style={{
                  border: "1px solid var(--color-outline-variant)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                {requestData.items.map((item, idx) => (
                  <div
                    key={item.productId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      borderBottom:
                        idx < requestData.items.length - 1
                          ? "1px solid var(--color-outline-variant)"
                          : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "var(--text-body-md)",
                            fontWeight: 600,
                            color: "var(--color-on-surface)",
                            margin: 0,
                          }}
                        >
                          {item.productName}
                        </p>
                        <p
                          style={{
                            fontSize: "var(--text-label-sm)",
                            color: "var(--color-on-surface-variant)",
                            margin: "4px 0 0",
                          }}
                        >
                          category: {item.category}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "var(--text-label-sm)",
                          color: "var(--color-on-surface-variant)",
                          margin: 0,
                        }}
                      >
                        Quantity
                      </p>
                      <p
                        style={{
                          fontSize: "var(--text-body-md)",
                          fontWeight: 700,
                          color: "var(--color-on-surface)",
                          margin: "2px 0 0",
                        }}
                      >
                        {item.receivedQty
                          ? item.receivedQty
                          : item.approveQty
                          ? item.approveQty
                          : item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking Timeline */}
            <div style={{ padding: "0 24px 24px" }}>
              <h3
                style={{
                  fontSize: "var(--text-label-md)",
                  fontWeight: 700,
                  color: "var(--color-on-surface-variant)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 32,
                }}
              >
                TRACKING TIMELINE
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {/* Connecting Line background */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 24,
                    right: 24,
                    height: 2,
                    backgroundColor: "var(--color-outline-variant)",
                    zIndex: 0,
                  }}
                />

                <style>{`
                    @keyframes timeline-grow {
                      0% { width: 0%; }
                      100% { width: 100%; }
                    }
                    @keyframes timeline-pop {
                      0% { transform: scale(0.6); opacity: 0; }
                      50% { transform: scale(1.1); opacity: 1; }
                      100% { transform: scale(1); opacity: 1; }
                    }
                    .timeline-step-circle {
                      opacity: 0;
                      animation: timeline-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }
                    .timeline-step-line {
                      width: 0%;
                      animation: timeline-grow 0.4s ease-out forwards;
                    }
                  `}</style>

                {getTimeline(requestData.status).map((step, index, array) => {
                  const isLast = index === array.length - 1;
                  // Render active connecting line
                  return (
                    <div
                      key={step.id}
                      style={{
                        position: "relative",
                        zIndex: 1,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      {/* Active line connecting to previous */}
                      {index > 0 && step.done && (
                        <div
                          className="timeline-step-line"
                          style={{
                            position: "absolute",
                            top: 16,
                            right: "50%",
                            height: 2,
                            backgroundColor: "var(--color-primary)",
                            zIndex: -1,
                            animationDelay: `${(index - 1) * 0.3}s`,
                          }}
                        />
                      )}

                      {/* Circle Icon */}
                      <div
                        className="timeline-step-circle"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: step.done
                            ? "var(--color-primary)"
                            : "var(--color-surface-container-lowest)",
                          border: step.done
                            ? "none"
                            : "2px solid var(--color-primary-fixed-dim)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: step.done
                            ? "var(--color-on-primary)"
                            : "var(--color-primary-fixed-dim)",
                          marginBottom: 12,
                          boxShadow: step.done
                            ? "0 0 0 4px var(--color-surface-container-lowest)"
                            : "none",
                          animationDelay: `${index * 0.3}s`,
                        }}
                      >
                        {step.done ? (
                          <Check size={16} strokeWidth={3} />
                        ) : isLast ? (
                          <Package size={16} />
                        ) : (
                          <div
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "var(--color-primary-fixed-dim)",
                            }}
                          />
                        )}
                      </div>

                      {/* Labels */}
                      <p
                        style={{
                          fontSize: "var(--text-label-sm)",
                          fontWeight: 700,
                          color: step.done
                            ? "var(--color-primary)"
                            : "var(--color-on-surface)",
                          marginBottom: 4,
                        }}
                      >
                        {step.label}
                      </p>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "var(--color-on-surface-variant)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.date}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Receive Items Section */}
            {requestData.status?.toLowerCase() === "approved" && (
              <div
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  borderTop: "1px solid var(--color-outline-variant)",
                  padding: "24px",
                }}
              >
                {!showReceiveForm ? (
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "var(--text-body-sm)",
                        color: "var(--color-on-surface-variant)",
                        marginBottom: 16,
                      }}
                    >
                      Your request has been approved. Please mark the items as
                      received once they arrive.
                    </p>
                    <button
                      onClick={() => setShowReceiveForm(true)}
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-on-primary)",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        padding: "12px 24px",
                        fontSize: "var(--text-body-sm)",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Package size={18} />
                      Mark as Received
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <Package size={20} color="var(--color-primary)" />
                      <h3
                        style={{
                          fontSize: "var(--text-title-lg)",
                          fontWeight: 700,
                          color: "var(--color-on-surface)",
                          margin: 0,
                        }}
                      >
                        Receive Items
                      </h3>
                    </div>

                    <p
                      style={{
                        fontSize: "var(--text-body-sm)",
                        color: "var(--color-on-surface-variant)",
                        marginBottom: 20,
                      }}
                    >
                      Please enter the received quantity for each item below.
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        marginBottom: 24,
                      }}
                    >
                      {requestData.items.map((item) => (
                        <div
                          key={item.productId}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px",
                            backgroundColor:
                              "var(--color-surface-container-lowest)",
                            border: "1px solid var(--color-outline-variant)",
                            borderRadius: "var(--radius-md)",
                            gap: 16,
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ flex: "1 1 200px" }}>
                            <p
                              style={{
                                fontSize: "var(--text-body-md)",
                                fontWeight: 600,
                                color: "var(--color-on-surface)",
                                margin: 0,
                              }}
                            >
                              {item.productName}
                            </p>
                            <p
                              style={{
                                fontSize: "var(--text-label-sm)",
                                color: "var(--color-on-surface-variant)",
                                margin: "4px 0 0",
                              }}
                            >
                              Category: {item.category}
                            </p>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 24,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ textAlign: "center" }}>
                              <p
                                style={{
                                  fontSize: "var(--text-label-sm)",
                                  color: "var(--color-on-surface-variant)",
                                  margin: "0 0 4px",
                                }}
                              >
                                Issue Qty
                              </p>
                              <p
                                style={{
                                  fontSize: "var(--text-body-md)",
                                  fontWeight: 700,
                                  margin: 0,
                                }}
                              >
                                {item.qty}
                              </p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p
                                style={{
                                  fontSize: "var(--text-label-sm)",
                                  color: "var(--color-on-surface-variant)",
                                  margin: "0 0 4px",
                                }}
                              >
                                Approved Qty
                              </p>
                              <p
                                style={{
                                  fontSize: "var(--text-body-md)",
                                  fontWeight: 700,
                                  margin: 0,
                                }}
                              >
                                {item.approveQty}
                              </p>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p
                                style={{
                                  fontSize: "var(--text-label-sm)",
                                  color: "var(--color-on-surface-variant)",
                                  margin: "0 0 4px",
                                }}
                              >
                                Received Qty
                              </p>
                              <input
                                type="number"
                                min="0"
                                max={item.approvedQty}
                                value={
                                  receivedQtys[item.productId] !== undefined
                                    ? receivedQtys[item.productId]
                                    : ""
                                }
                                onChange={(e) =>
                                  setReceivedQtys({
                                    ...receivedQtys,
                                    [item.productId]: e.target.value,
                                  })
                                }
                                style={{
                                  ...inputStyle,
                                  width: "80px",
                                  padding: "6px 8px",
                                  textAlign: "center",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={receivedLoading}
                      onClick={handleConfirmReceive}
                      style={{
                        width: "100%",
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-on-primary)",
                        border: "none",
                        borderRadius: "var(--radius-md)",
                        padding: "12px",
                        fontSize: "var(--text-body-sm)",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontFamily: "inherit",
                      }}
                    >
                      <Check size={16} />
                      {receivedLoading && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-3">
                            <span className="loading loading-spinner loading-lg text-primary"></span>

                            <p className="text-sm font-medium text-slate-600">
                              Loading received requests...
                            </p>
                          </div>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Receipt Section */}
            {requestData.status === "Issued" && (
              <div
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  borderTop: "1px solid var(--color-outline-variant)",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <CheckCircle2 size={20} color="var(--color-primary)" />
                  <h3
                    style={{
                      fontSize: "var(--text-title-lg)",
                      fontWeight: 700,
                      color: "var(--color-on-surface)",
                      margin: 0,
                    }}
                  >
                    Confirm Receipt
                  </h3>
                </div>

                <p
                  style={{
                    fontSize: "var(--text-body-sm)",
                    color: "var(--color-on-surface-variant)",
                    marginBottom: 20,
                  }}
                >
                  Have you received your items? Please confirm the delivery
                  details below to close this request.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <label style={labelStyle}>Date Received</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="date"
                        style={{ ...inputStyle, paddingRight: 36 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Condition of Items</label>
                    <select style={{ ...inputStyle, appearance: "none" }}>
                      <option value="perfect">Perfect</option>
                      <option value="damaged">Damaged / Missing Parts</option>
                      <option value="wrong">Wrong Item Received</option>
                    </select>
                  </div>
                </div>

                <button
                  style={{
                    width: "100%",
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-on-primary)",
                    border: "none",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    fontSize: "var(--text-body-sm)",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontFamily: "inherit",
                  }}
                >
                  <Check size={16} />
                  Confirm &amp; Close Request
                </button>
              </div>
            )}
          </div>
        ) : error || requestData ? (
          <div
            style={{
              textAlign: "center",
              marginTop: 40,
              padding: 24,
              backgroundColor: "var(--color-surface-container-lowest)",
              border: "1px solid var(--color-error)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h3 style={{ color: "var(--color-error)", marginBottom: 8 }}>
              ID Not Found
            </h3>
            <p style={{ color: "var(--color-on-surface-variant)" }}>
              {error?.message ||
                error ||
                "Request not found or invalid response from server."}
            </p>
          </div>
        ) : null}

        {/* Footer Note */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            marginTop: 24,
            padding: "0 16px",
          }}
        >
          <Info
            size={16}
            style={{
              color: "var(--color-outline)",
              marginTop: 2,
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontSize: "var(--text-label-sm)",
              color: "var(--color-on-surface-variant)",
              margin: 0,
            }}
          >
            Need help with this request? Contact the IT helpdesk at{" "}
            <span style={{ fontWeight: 600, color: "var(--color-primary)" }}>
              support@systematic-integrity.com
            </span>{" "}
            and quote your Request ID.
          </p>
        </div>
      </div>
    </div>
  );
}
