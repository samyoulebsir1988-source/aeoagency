/**
 * Meridian — audit request webhook
 *
 * Bound to a Google Sheet. Each POST appends one row.
 * Setup steps live in the repository README.
 *
 * Deploy as a web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Use the /exec URL, not /dev, as AUDIT_WEBHOOK_URL.
 *
 * Expected JSON body:
 *   { "name", "email", "website", "message", "submittedAt" }
 *
 * Response: { "ok": true }
 */

var HEADERS = ["Received at", "Name", "Email", "Website", "Message", "Submitted at"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var data = parsePayload_(e);
    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      safe_(data.name),
      safe_(data.email),
      safe_(data.website),
      safe_(data.message),
      safe_(data.submittedAt),
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: "audit-requests" });
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    var parsed = JSON.parse(e.postData.contents);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Request body was not an object.");
    }
    return parsed;
  }
  throw new Error("Empty request body.");
}

function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function safe_(value) {
  var text = value == null ? "" : String(value);
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
