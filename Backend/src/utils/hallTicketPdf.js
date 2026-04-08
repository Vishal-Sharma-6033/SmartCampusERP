import PDFDocument from "pdfkit";

export const generateHallTicketPDF = (data, res) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=hallticket.pdf"
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("HALL TICKET", { align: "center" });
  doc.moveDown();

  // Student Info
  doc.fontSize(12).text(`Name: ${data.student.name}`);
  doc.text(`Email: ${data.student.email}`);
  doc.moveDown();

  // Exam Table
  data.exams.forEach((exam, i) => {
    doc.text(`Exam ${i + 1}`);
    doc.text(`Subject: ${exam.subject}`);
    doc.text(`Date: ${exam.date}`);
    doc.text(`Room: ${exam.roomNumber}`);
    doc.text(`Seat: ${exam.seatNumber}`);
    doc.text(`Block: ${exam.block}`);
    doc.moveDown();
  });

  doc.end();
};