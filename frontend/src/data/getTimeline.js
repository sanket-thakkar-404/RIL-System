import {
  Send,
  Eye,
  CheckCircle,
  PackageCheck,
} from "lucide-react";


export const getTimeline = (status) => {
  const steps = [
    {
      id: 1,
      label: "Submitted",
      done: true,
      Icon: Send,
    },

    {
      id: 2,
      label: "Under Review",
      done: [
        "UNDER_REVIEW",
        "APPROVED",
        "RECEIVED",
      ].includes(status),
      Icon: Eye,
    },

    {
      id: 3,
      label: "Approved",
      done: [
        "APPROVED",
        "RECEIVED",
      ].includes(status),
      Icon: CheckCircle,
    },

    {
      id: 4,
      label: "Received",
      done: status === "RECEIVED",
      Icon: PackageCheck,
    },
  ];

  return steps;
};