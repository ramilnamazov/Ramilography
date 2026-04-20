// ─────────────────────────────────────────────────────────────
//  Ramilography CRM — Google Apps Script
//  Extensions → Apps Script → paste → Run createCRM
// ─────────────────────────────────────────────────────────────

function createCRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  setupBookingsSheet(ss);
  setupDashboardSheet(ss);
  ss.setActiveSheet(ss.getSheetByName("Bookings"));
  SpreadsheetApp.getUi().alert(
    "✅ Ramilography CRM is ready!\n\n" +
    "• Bookings sheet — all client records\n" +
    "• Dashboard sheet — live summary stats"
  );
}

// ─────────────────────────────────────────────────────────────
//  WEBHOOK RECEIVER — Cal.com → Google Sheets
//  Deploy as Web App (Execute as: Me, Access: Anyone)
// ─────────────────────────────────────────────────────────────

function doGet(e) {
  return ContentService.createTextOutput("Ramilography CRM webhook is active.");
}

function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const trigger = data.triggerEvent;
    const payload = data.payload;

    if (!payload) return ContentService.createTextOutput("no payload");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings");
    if (!sheet) return ContentService.createTextOutput("Bookings sheet not found");

    const attendee  = payload.attendees?.[0] || {};
    const responses = payload.responses   || {};

    const phone    = responses.phone?.value    || "";
    const notes    = responses.notes?.value    || "";
    const location = responses.location?.value?.optionValue
                  || responses.location?.value
                  || "";

    const startTime = payload.startTime ? new Date(payload.startTime) : new Date();
    const nextRow   = Math.max(sheet.getLastRow() + 1, 3);

    if (trigger === "BOOKING_CREATED") {
      sheet.getRange(nextRow, 1, 1, 15).setValues([[
        new Date(),                        // Date Booked (today)
        attendee.name  || "",              // Client Name
        attendee.email || "",              // Client Email
        phone,                             // Client Phone
        payload.eventType?.title || "",    // Session Type
        startTime,                         // Session Date
        startTime,                         // Session Time
        location,                          // Location
        notes,                             // Client Notes
        "New",                             // Status
        "No",                              // Contract
        "No",                              // Deposit Paid
        "No",                              // Full Paid
        0,                                 // Amount ($)
        "",                                // Internal Notes
      ]]);

      // Apply date/time formats to new row
      sheet.getRange(nextRow, 1).setNumberFormat("MM/dd/yyyy");
      sheet.getRange(nextRow, 6).setNumberFormat("MM/dd/yyyy");
      sheet.getRange(nextRow, 7).setNumberFormat("hh:mm AM/PM");
      sheet.getRange(nextRow, 14).setNumberFormat("$#,##0.00");

      return ContentService.createTextOutput("ok: booking added row " + nextRow);
    }

    if (trigger === "BOOKING_CANCELLED") {
      updateBookingStatus(sheet, attendee.email, startTime, "Cancelled");
      return ContentService.createTextOutput("ok: marked cancelled");
    }

    if (trigger === "BOOKING_RESCHEDULED") {
      updateBookingStatus(sheet, attendee.email, startTime, "Confirmed");
      return ContentService.createTextOutput("ok: marked rescheduled");
    }

    return ContentService.createTextOutput("ignored: " + trigger);

  } catch (err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}

// Finds a booking row by email and updates its status
function updateBookingStatus(sheet, email, newDate, status) {
  const data    = sheet.getDataRange().getValues();
  for (let i = 2; i < data.length; i++) {
    if (data[i][2] === email) {
      sheet.getRange(i + 1, 10).setValue(status);
      if (newDate) sheet.getRange(i + 1, 6).setValue(newDate);
      break;
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  BOOKINGS SHEET
// ─────────────────────────────────────────────────────────────
function setupBookingsSheet(ss) {
  let sheet = ss.getSheetByName("Bookings");
  if (!sheet) sheet = ss.insertSheet("Bookings");
  sheet.clear();
  sheet.clearFormats();

  const columns = [
    { header: "Date Booked",    width: 120 },
    { header: "Client Name",    width: 160 },
    { header: "Client Email",   width: 220 },
    { header: "Client Phone",   width: 140 },
    { header: "Session Type",   width: 140 },
    { header: "Session Date",   width: 130 },
    { header: "Session Time",   width: 110 },
    { header: "Location",       width: 180 },
    { header: "Client Notes",   width: 260 },
    { header: "Status",         width: 130 },
    { header: "Contract",       width: 110 },
    { header: "Deposit Paid",   width: 110 },
    { header: "Full Paid",      width: 110 },
    { header: "Amount ($)",     width: 110 },
    { header: "Internal Notes", width: 240 },
  ];

  const numCols = columns.length;

  // Title row
  sheet.setRowHeight(1, 48);
  sheet.getRange(1, 1, 1, numCols).merge()
    .setValue("RAMILOGRAPHY — CLIENT BOOKINGS")
    .setBackground("#070d0b")
    .setFontColor("#a88753")
    .setFontFamily("Georgia")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // Header row
  sheet.setRowHeight(2, 36);
  const headerRange = sheet.getRange(2, 1, 1, numCols);
  headerRange.setValues([columns.map(c => c.header)])
    .setBackground("#1c2a27")
    .setFontColor("#f5f3ef")
    .setFontFamily("Arial")
    .setFontSize(9)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  headerRange.setBorder(true, true, true, true, true, true, "#0a120f", SpreadsheetApp.BorderStyle.SOLID);

  columns.forEach((col, i) => sheet.setColumnWidth(i + 1, col.width));

  // Data rows
  const dataRange = sheet.getRange(3, 1, 200, numCols);
  dataRange.setFontColor("#f5f3ef").setFontFamily("Arial").setFontSize(10).setVerticalAlignment("middle");

  for (let r = 3; r <= 202; r++) {
    sheet.getRange(r, 1, 1, numCols).setBackground(r % 2 === 0 ? "#0f1a17" : "#0c1410");
  }

  // Dropdowns
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["New", "Confirmed", "In Progress", "Completed", "Cancelled", "No Show"], true)
    .setAllowInvalid(false).build();
  sheet.getRange(3, 10, 200, 1).setDataValidation(statusRule);

  const yesNoRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Yes", "No", "Pending"], true)
    .setAllowInvalid(false).build();
  sheet.getRange(3, 11, 200, 1).setDataValidation(yesNoRule);
  sheet.getRange(3, 12, 200, 1).setDataValidation(yesNoRule);
  sheet.getRange(3, 13, 200, 1).setDataValidation(yesNoRule);

  const sessionRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Portraits", "Couples", "Family", "Events", "Sports", "Consultation"], true)
    .setAllowInvalid(false).build();
  sheet.getRange(3, 5, 200, 1).setDataValidation(sessionRule);

  // Conditional formatting — Status
  const statusCol    = sheet.getRange(3, 10, 200, 1);
  const statusColors = [
    { value: "New",         bg: "#1a2e4a", font: "#5b9bd5" },
    { value: "Confirmed",   bg: "#1a3a2a", font: "#6abf8a" },
    { value: "In Progress", bg: "#2e2a12", font: "#d4b44a" },
    { value: "Completed",   bg: "#1a2e1a", font: "#a8d5a2" },
    { value: "Cancelled",   bg: "#2e1a1a", font: "#d57070" },
    { value: "No Show",     bg: "#2a1a2e", font: "#b07ad5" },
  ];
  sheet.setConditionalFormatRules(statusColors.map(s =>
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(s.value)
      .setBackground(s.bg)
      .setFontColor(s.font)
      .setRanges([statusCol])
      .build()
  ));

  // Formats
  sheet.getRange(3, 14, 200, 1).setNumberFormat("$#,##0.00");
  sheet.getRange(3,  1, 200, 1).setNumberFormat("MM/dd/yyyy");
  sheet.getRange(3,  6, 200, 1).setNumberFormat("MM/dd/yyyy");
  sheet.getRange(3,  7, 200, 1).setNumberFormat("hh:mm AM/PM");

  sheet.setFrozenRows(2);
  sheet.setRowHeightsForced(3, 200, 32);
}

// ─────────────────────────────────────────────────────────────
//  DASHBOARD SHEET
// ─────────────────────────────────────────────────────────────
function setupDashboardSheet(ss) {
  let sheet = ss.getSheetByName("Dashboard");
  if (!sheet) sheet = ss.insertSheet("Dashboard", 0);
  sheet.clear();
  sheet.clearFormats();

  sheet.setColumnWidth(1, 40);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 40);
  sheet.setColumnWidth(5, 200);
  sheet.setColumnWidth(6, 160);

  const dark = "#070d0b", card = "#0f1a17", gold = "#a88753";
  const text = "#f5f3ef", muted = "#c7c0af", border = "#1c2a27";

  sheet.getRange(1, 1, 60, 8).setBackground(dark);

  sheet.setRowHeight(2, 52);
  sheet.getRange(2, 2, 1, 5).merge()
    .setValue("RAMILOGRAPHY — DASHBOARD")
    .setBackground(dark).setFontColor(gold).setFontFamily("Georgia")
    .setFontSize(16).setFontWeight("bold")
    .setHorizontalAlignment("center").setVerticalAlignment("middle");

  sheet.setRowHeight(3, 8);

  const stats = [
    { label: "Total Bookings", formula: '=COUNTA(Bookings!B3:B)',                row: 4,  col: 2 },
    { label: "New",            formula: '=COUNTIF(Bookings!J3:J,"New")',          row: 4,  col: 5 },
    { label: "Confirmed",      formula: '=COUNTIF(Bookings!J3:J,"Confirmed")',    row: 8,  col: 2 },
    { label: "Completed",      formula: '=COUNTIF(Bookings!J3:J,"Completed")',    row: 8,  col: 5 },
    { label: "Cancelled",      formula: '=COUNTIF(Bookings!J3:J,"Cancelled")',    row: 12, col: 2 },
    { label: "Revenue ($)",    formula: '=SUM(Bookings!N3:N)',                    row: 12, col: 5 },
    { label: "Contracts Sent", formula: '=COUNTIF(Bookings!K3:K,"Yes")',          row: 16, col: 2 },
    { label: "Deposits Paid",  formula: '=COUNTIF(Bookings!L3:L,"Yes")',          row: 16, col: 5 },
  ];

  stats.forEach(s => {
    sheet.setRowHeight(s.row, 36);
    sheet.setRowHeight(s.row + 1, 44);
    sheet.setRowHeight(s.row + 2, 10);
    sheet.getRange(s.row, s.col, 1, 2).merge()
      .setValue(s.label).setBackground(card).setFontColor(muted)
      .setFontFamily("Arial").setFontSize(8).setFontWeight("bold")
      .setHorizontalAlignment("center").setVerticalAlignment("bottom")
      .setBorder(true, true, false, true, false, false, border, SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(s.row + 1, s.col, 1, 2).merge()
      .setFormula(s.formula).setBackground(card).setFontColor(text)
      .setFontFamily("Georgia").setFontSize(26).setFontWeight("bold")
      .setHorizontalAlignment("center").setVerticalAlignment("middle")
      .setBorder(false, true, true, true, false, false, border, SpreadsheetApp.BorderStyle.SOLID);
  });

  sheet.getRange(13, 5, 2, 2).setFontColor(gold);

  const tableStartRow = 21;
  sheet.setRowHeight(tableStartRow, 14);
  sheet.setRowHeight(tableStartRow + 1, 36);
  sheet.getRange(tableStartRow, 2, 1, 5).merge()
    .setValue("SESSIONS BY TYPE").setBackground(dark).setFontColor(gold)
    .setFontFamily("Arial").setFontSize(8).setFontWeight("bold")
    .setHorizontalAlignment("left").setVerticalAlignment("middle");

  const sessionTypes  = ["Portraits", "Couples", "Family", "Events", "Sports"];
  const tableHeaders  = ["Session Type", "Bookings", "Completed", "Revenue ($)"];
  const headerRow     = tableStartRow + 2;
  sheet.setRowHeight(headerRow, 30);
  tableHeaders.forEach((h, i) => {
    sheet.getRange(headerRow, i + 2)
      .setValue(h).setBackground(border).setFontColor(text)
      .setFontFamily("Arial").setFontSize(8).setFontWeight("bold")
      .setHorizontalAlignment("center").setVerticalAlignment("middle");
  });

  sessionTypes.forEach((type, i) => {
    const r  = headerRow + 1 + i;
    const bg = i % 2 === 0 ? card : "#0a1510";
    sheet.setRowHeight(r, 30);
    sheet.getRange(r, 2).setValue(type).setBackground(bg).setFontColor(text).setFontFamily("Arial").setFontSize(10).setHorizontalAlignment("left").setVerticalAlignment("middle");
    sheet.getRange(r, 3).setFormula(`=COUNTIF(Bookings!E3:E,"${type}")`).setBackground(bg).setFontColor(text).setFontFamily("Arial").setFontSize(10).setHorizontalAlignment("center").setVerticalAlignment("middle");
    sheet.getRange(r, 4).setFormula(`=COUNTIFS(Bookings!E3:E,"${type}",Bookings!J3:J,"Completed")`).setBackground(bg).setFontColor(text).setFontFamily("Arial").setFontSize(10).setHorizontalAlignment("center").setVerticalAlignment("middle");
    sheet.getRange(r, 5).setFormula(`=SUMIF(Bookings!E3:E,"${type}",Bookings!N3:N)`).setBackground(bg).setFontColor(gold).setFontFamily("Arial").setFontSize(10).setNumberFormat("$#,##0.00").setHorizontalAlignment("center").setVerticalAlignment("middle");
  });

  const lastRow = headerRow + sessionTypes.length + 3;
  sheet.getRange(lastRow, 2, 1, 5).merge()
    .setFormula('="Last refreshed: "&TEXT(NOW(),"MMM dd, yyyy hh:mm AM/PM")')
    .setBackground(dark).setFontColor(muted).setFontFamily("Arial")
    .setFontSize(8).setHorizontalAlignment("right");

  sheet.setFrozenRows(0);
  sheet.setFrozenColumns(0);
}

// ─────────────────────────────────────────────────────────────
//  Add a booking manually via dialog
// ─────────────────────────────────────────────────────────────
function addBookingManually() {
  const ui      = SpreadsheetApp.getUi();
  const name    = ui.prompt("Client Name").getResponseText();
  const email   = ui.prompt("Client Email").getResponseText();
  const phone   = ui.prompt("Client Phone").getResponseText();
  const session = ui.prompt("Session Type (Portraits / Couples / Family / Events / Sports)").getResponseText();
  const date    = ui.prompt("Session Date (MM/DD/YYYY)").getResponseText();
  const notes   = ui.prompt("Client Notes").getResponseText();

  const sheet   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings");
  const nextRow = Math.max(sheet.getLastRow(), 2) + 1;

  sheet.getRange(nextRow, 1, 1, 15).setValues([[
    new Date(), name, email, phone, session,
    new Date(date), "", "", notes,
    "New", "No", "No", "No", 0, "",
  ]]);

  sheet.getRange(nextRow, 1).setNumberFormat("MM/dd/yyyy");
  sheet.getRange(nextRow, 6).setNumberFormat("MM/dd/yyyy");
  sheet.getRange(nextRow, 14).setNumberFormat("$#,##0.00");

  ui.alert("✅ Booking added for " + name);
}

// ─────────────────────────────────────────────────────────────
//  Custom menu
// ─────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📷 Ramilography CRM")
    .addItem("Setup / Reset CRM", "createCRM")
    .addSeparator()
    .addItem("Add Booking Manually", "addBookingManually")
    .addToUi();
}
