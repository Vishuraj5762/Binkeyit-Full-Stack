import React from "react";

export default function MyOrderDate() {
  // Current Date
  const today = new Date();

  // Next 7 Days Date
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  // Date ko readable format me convert karna
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="p-4">
      <p>📅 Current Date: {formatDate(today)}</p>
      <p>🚚 Delivery Date (Next 7 Days): {formatDate(next7Days)}</p>
    </div>
  );
}





