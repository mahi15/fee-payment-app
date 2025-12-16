import jsPDF from "jspdf";
import logo from "./mainLogo.png";

/**
 * Reusable, professional invoice generator
 */
export function generateInvoice({
  reference,
  studentName,
  vnumber,
  program,
  feeType,
  total,
  status = "PAID",
  paymentMethod = "Online Payment",
  date = new Date(),
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  /* ================= HEADER ================= */

  // Logo (LEFT)
  const logoWidth = 75;
  const logoHeight = 30;
  doc.addImage(logo, "PNG", 20, 18, logoWidth, logoHeight);

  // Receipt title (RIGHT)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Payment Receipt", pageWidth - 30, 40, { align: "right" });

  // Divider
  doc.setDrawColor(21, 158, 69);
  doc.setLineWidth(0.8);
  doc.line(20, 48, pageWidth - 20, 48);

  /* ================= STUDENT + META ================= */

  // Left: Student
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To", 20, 62);

  doc.setFont("helvetica", "normal");
  doc.text(`Student Name: ${studentName}`, 20, 70);
  doc.text(`Student V#: ${vnumber}`, 20, 77);
  doc.text(`Program: ${program}`, 20, 84);

  // Right: Invoice meta
  doc.text(`Invoice #: ${reference}`, pageWidth - 20, 70, { align: "right" });
  doc.text(`Date: ${date.toLocaleDateString()}`, pageWidth - 20, 77, {
    align: "right",
  });
  doc.text(`Status: ${status}`, pageWidth - 20, 84, { align: "right" });

  /* ================= TABLE ================= */

  const tableTop = 102;

  // Table header
  doc.setFillColor(21, 158, 69);
  doc.rect(20, tableTop, pageWidth - 40, 10, "F");

  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 24, tableTop + 7);
  doc.text("Amount (CAD)", pageWidth - 24, tableTop + 7, { align: "right" });

  // Table row
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");

  doc.rect(20, tableTop + 10, pageWidth - 40, 12);
  doc.text(feeType, 24, tableTop + 18);
  doc.text(`$${total}`, pageWidth - 24, tableTop + 18, { align: "right" });

  /* ================= TOTAL ================= */

  const totalTop = tableTop + 36;

  doc.setFont("helvetica", "bold");
  doc.text("Total Paid", pageWidth - 70, totalTop);
  doc.text(`CAD $${total}`, pageWidth - 24, totalTop, { align: "right" });

  /* ================= PAYMENT INFO ================= */

  doc.setFont("helvetica", "normal");
  doc.text(`Payment Method: ${paymentMethod}`, 20, totalTop + 14);
  doc.text(`Transaction Status: ${status}`, 20, totalTop + 21);

  /* ================= FOOTER ================= */

  doc.setDrawColor(200);
  doc.line(20, 265, pageWidth - 20, 265);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    "This is a system-generated receipt. No signature is required.",
    pageWidth / 2,
    272,
    { align: "center" }
  );

  doc.text(
    "Academy of Learning Career College • https://aoltoronto.com/",
    pageWidth / 2,
    278,
    { align: "center" }
  );

  doc.save(`Invoice_${reference}.pdf`);
}
