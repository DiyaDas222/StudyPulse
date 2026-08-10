import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportProgressPDF = async ({
  elementId,
  fileName = "StudyPulse-Progress-Report.pdf",
}) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Progress report content not found");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imageData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const imageHeight =
    (canvas.height * contentWidth) / canvas.width;

  let remainingHeight = imageHeight;
  let position = margin;

  // Header
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("StudyPulse", margin, 8);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Learning Progress Report", margin, 14);

  // First page
  pdf.addImage(
    imageData,
    "PNG",
    margin,
    position + 8,
    contentWidth,
    imageHeight
  );

  remainingHeight -= pageHeight - margin - 8;

  // Additional pages
  while (remainingHeight > 0) {
    position = remainingHeight - imageHeight + margin;

    pdf.addPage();

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      position,
      contentWidth,
      imageHeight
    );

    remainingHeight -= pageHeight - margin;
  }

  pdf.save(fileName);
};