import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportOrdersPdf = (orders) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("SOUK Fashion House", 14, 18);

  doc.setFontSize(12);
  doc.text("Orders Report", 14, 28);

  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    36
  );

  autoTable(doc, {
    startY: 45,

    head: [[
      "Order",
      "Customer",
      "Phone",
      "Payment",
      "Status",
      "Amount",
      "Date",
    ]],

    body: orders.map((order) => [

      order._id.slice(-8).toUpperCase(),

      order.shippingAddress.fullName,

      order.shippingAddress.phone,

      order.paymentMethod,

      order.orderStatus,

      `₹${order.finalAmount}`,

      new Date(order.createdAt)
        .toLocaleDateString(),

    ]),

    styles: {
      fontSize: 10,
    },

    headStyles: {
      fillColor: [33, 37, 41],
    },

  });

  doc.save("OrdersReport.pdf");
};

export default exportOrdersPdf;