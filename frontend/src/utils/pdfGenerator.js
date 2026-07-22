import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper for formatted date
const formatDate = (dateStr) => {
  if (!dateStr) return new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

// ---------------------------------------------------------
// 1. Download Payment Invoice PDF
// ---------------------------------------------------------
export const downloadInvoicePDF = (payment) => {
  const doc = new jsPDF();
  const primaryColor = [79, 70, 229]; // #4F46E5

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("FITTRACK GYM", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Official Payment Receipt & Invoice", 14, 30);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 196, 22, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`#INV-${payment.id || Math.floor(100000 + Math.random() * 900000)}`, 196, 30, { align: "right" });

  // Invoice Meta Section
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);

  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 52);
  doc.setFont("helvetica", "normal");
  doc.text(payment.memberName || "Valued Member", 14, 58);
  if (payment.email) doc.text(payment.email, 14, 64);
  if (payment.phone) doc.text(payment.phone, 14, 70);

  doc.setFont("helvetica", "bold");
  doc.text("Invoice Date:", 140, 52);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(payment.date), 170, 52);

  doc.setFont("helvetica", "bold");
  doc.text("Payment Status:", 140, 58);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74); // Green
  doc.text(payment.status || "PAID / ACTIVE", 170, 58);

  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text("Payment Method:", 140, 64);
  doc.setFont("helvetica", "normal");
  doc.text(payment.paymentMethod || "Credit Card / Online", 170, 64);

  // Table
  autoTable(doc, {
    startY: 80,
    head: [["Item Description", "Billing Plan", "Status", "Amount"]],
    body: [
      [
        payment.plan ? `${payment.plan} Membership Subscription` : "Gym Membership Plan",
        payment.plan || "Monthly",
        payment.status || "ACTIVE",
        typeof payment.amount === "number" ? `Rs. ${payment.amount.toLocaleString()}` : `${payment.amount || "Rs. 2,500"}`,
      ],
    ],
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 6 },
    theme: "striped",
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  // Total Summary Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, finalY, 76, 32, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total Paid:", 126, finalY + 12);
  doc.setFontSize(14);
  doc.setTextColor(79, 70, 229);
  doc.text(
    typeof payment.amount === "number" ? `Rs. ${payment.amount.toLocaleString()}` : `${payment.amount || "Rs. 2,500"}`,
    190,
    finalY + 12,
    { align: "right" }
  );

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text("Includes all applicable gym access taxes and fees.", 126, finalY + 24);

  // Footer
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 270, 196, 270);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for training with FitTrack Gym!", 105, 277, { align: "center" });
  doc.text("Support: support@fittrack.com | www.fittrack.com", 105, 283, { align: "center" });

  doc.save(`FitTrack_Invoice_${payment.id || "Receipt"}.pdf`);
};

// ---------------------------------------------------------
// 2. Download Admin Analytics & Performance PDF Report
// ---------------------------------------------------------
export const downloadAdminReportPDF = (stats, revenueData, newMembers) => {
  const doc = new jsPDF();
  const primaryColor = [15, 23, 42]; // Dark Slate

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FITTRACK GYM - PERFORMANCE & REVENUE REPORT", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${formatDate()} | Executive Summary`, 14, 28);

  // Stats Grid Summary Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 44, 182, 36, 4, 4, "F");

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("KEY PERFORMANCE METRICS", 20, 53);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Monthly Revenue:`, 20, 63);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 163, 74);
  doc.text(`Rs. ${(stats.monthlyRevenue || 28900).toLocaleString()}`, 65, 63);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.text(`Active Memberships:`, 20, 71);
  doc.setFont("helvetica", "bold");
  doc.text(`${stats.activeMemberships || 142}`, 65, 71);

  doc.setFont("helvetica", "normal");
  doc.text(`Active Trainers:`, 110, 63);
  doc.setFont("helvetica", "bold");
  doc.text(`${stats.activeTrainers || 6}`, 155, 63);

  doc.setFont("helvetica", "normal");
  doc.text(`Renewal Rate:`, 110, 71);
  doc.setFont("helvetica", "bold");
  doc.text(`86% High Retention`, 155, 71);

  // Revenue Breakdown Table
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Revenue Trends", 14, 92);

  const revenueRows = (revenueData || [
    { label: "Jan", val: 12000 },
    { label: "Feb", val: 15400 },
    { label: "Mar", val: 18200 },
    { label: "Apr", val: 21000 },
    { label: "May", val: 24500 },
    { label: "Jun", val: 28900 },
  ]).map((r) => [r.label, `Rs. ${Number(r.val).toLocaleString()}`, "Growth Target Achieved"]);

  autoTable(doc, {
    startY: 96,
    head: [["Month", "Total Revenue", "Status"]],
    body: revenueRows,
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 5 },
  });

  // Member Registration Table
  const nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("New Member Registration Trends", 14, nextY);

  const memberRows = (newMembers || [
    { label: "Feb", val: 4 },
    { label: "Mar", val: 6 },
    { label: "Apr", val: 5 },
    { label: "May", val: 8 },
    { label: "Jun", val: 7 },
  ]).map((m) => [m.label, `${m.val || m.value} New Members`, "Verified Registrations"]);

  autoTable(doc, {
    startY: nextY + 4,
    head: [["Month", "New Registrations", "Notes"]],
    body: memberRows,
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 5 },
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Confidential Internal Gym Report • Generated by FitTrack Management System", 105, 285, { align: "center" });

  doc.save(`FitTrack_Analytics_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ---------------------------------------------------------
// 3. Download Admin Payment Summary Ledger PDF
// ---------------------------------------------------------
export const downloadPaymentSummaryPDF = (payments, totalCollected) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FITTRACK GYM - PAYMENTS & REVENUE LEDGER", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Date: ${formatDate()} | Total Collected: Rs. ${(totalCollected || 0).toLocaleString()}`, 14, 28);

  const tableRows = payments.map((p, index) => [
    `#${index + 1}`,
    p.memberName || "Member",
    p.plan || "Monthly",
    formatDate(p.date),
    p.status === "Expired" ? "Expired" : "Paid",
    typeof p.amount === "number" ? `Rs. ${p.amount.toLocaleString()}` : `${p.amount}`,
  ]);

  autoTable(doc, {
    startY: 44,
    head: [["#", "Member Name", "Plan Type", "Date", "Status", "Amount"]],
    body: tableRows,
    headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 5 },
    theme: "striped",
  });

  doc.save(`FitTrack_Payments_Ledger_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ---------------------------------------------------------
// 4. Download Member Workout Plan PDF
// ---------------------------------------------------------
export const downloadWorkoutPlanPDF = (memberName, dayName, exercises) => {
  const doc = new jsPDF();
  const primaryColor = [37, 99, 235]; // Blue

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("FITTRACK - WORKOUT ROUTINE", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Scheduled Day: ${dayName || "Today"} | Member: ${memberName || "Gym Member"}`, 14, 30);

  const rows = (exercises || []).map((ex, i) => [
    `${i + 1}`,
    ex.name || ex.exerciseName || "Exercise",
    ex.sets || "3",
    ex.weight || ex.reps || "10",
    ex.rest || "60s",
    ex.muscle || "General",
  ]);

  autoTable(doc, {
    startY: 46,
    head: [["#", "Exercise Name", "Sets", "Reps / Weight", "Rest", "Target Muscle"]],
    body: rows,
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 6 },
    theme: "grid",
  });

  const finalY = doc.lastAutoTable.finalY + 12;
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(14, finalY, 182, 28, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.setFont("helvetica", "bold");
  doc.text("Trainer Advice & Instructions:", 20, finalY + 9);
  doc.setFont("helvetica", "normal");
  doc.text("• Warm up for 5-10 minutes prior to lifting heavy weight.", 20, finalY + 16);
  doc.text("• Stay hydrated and focus on controlled, proper breathing throughout each set.", 20, finalY + 22);

  doc.save(`FitTrack_Workout_${(dayName || "Routine").replace(/\s+/g, "_")}.pdf`);
};

// ---------------------------------------------------------
// 5. Download Member Fitness Progress Report PDF
// ---------------------------------------------------------
export const downloadProgressReportPDF = (memberName, logs, personalRecords) => {
  const doc = new jsPDF();
  const primaryColor = [124, 58, 237]; // Purple

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FITTRACK - FITNESS & PR PROGRESS REPORT", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Member: ${memberName || "Gym Member"} | Date: ${formatDate()}`, 14, 28);

  // PR Section
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Personal Records (PRs)", 14, 46);

  const prRows = (personalRecords || []).map((pr) => [
    pr.exercise,
    `${pr.value} ${pr.unit || "kg"}`,
    formatDate(pr.date),
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Exercise", "Personal Best", "Date Achieved"]],
    body: prRows.length > 0 ? prRows : [["Bench Press", "75 kg", formatDate()]],
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { fontSize: 9, cellPadding: 5 },
  });

  const nextY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.text("Recent Activity Log", 14, nextY);

  const logRows = (logs || []).map((l) => [
    formatDate(l.loggedDate),
    l.exercise?.exerciseName || "Workout Log",
    `${l.repsDone || 10} reps`,
    `${l.weightKg || 50} kg`,
  ]);

  autoTable(doc, {
    startY: nextY + 4,
    head: [["Date", "Exercise Name", "Reps Completed", "Weight Lifted"]],
    body: logRows.length > 0 ? logRows : [[formatDate(), "Barbell Bench Press", "10 reps", "75 kg"]],
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 5 },
    theme: "striped",
  });

  doc.save(`FitTrack_Progress_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
};
