import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export const exportProgressPDF = async ({
  elementId,
  fileName = "StudyPulse-Progress-Report.pdf",
}) => {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Progress report content not found");
  }

  // Give charts/layout a moment to finish rendering
  await new Promise((resolve) => setTimeout(resolve, 300));

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#f1f5f9",
    logging: false,
    imageTimeout: 15000,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
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
  const headerHeight = 15;

  const contentWidth = pageWidth - margin * 2;

  const imageHeight =
    (canvas.height * contentWidth) / canvas.width;

  let heightLeft = imageHeight;

  let position = margin + headerHeight;

  // ==============================
  // First page header
  // ==============================

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("StudyPulse", margin, 8);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Learning Progress Report", margin, 13);

  // ==============================
  // First page
  // ==============================

  pdf.addImage(
    imageData,
    "PNG",
    margin,
    position,
    contentWidth,
    imageHeight
  );

  heightLeft -=
    pageHeight - position - margin;

  // ==============================
  // Additional pages
  // ==============================

  while (heightLeft > 0) {
    pdf.addPage();

    position =
      margin - imageHeight + heightLeft;

    pdf.addImage(
      imageData,
      "PNG",
      margin,
      position,
      contentWidth,
      imageHeight
    );

    heightLeft -=
      pageHeight - margin * 2;
  }

  // ==============================
  // Save
  // ==============================

  pdf.save(fileName);
};

export default exportProgressPDF;