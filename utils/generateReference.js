// backend/utils/generateReference.js
// Human-friendly, sortable reference numbers for receipts/transactions.
// e.g. RCT-20260707-4821  /  TRX-20260707-9034

function pad(num, size) {
  return String(num).padStart(size, '0');
}

export function generateReferenceNumber(prefix = 'TRX') {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1, 2)}${pad(now.getDate(), 2)}`;
  const randomPart = pad(Math.floor(Math.random() * 10000), 4);
  return `${prefix}-${datePart}-${randomPart}`;
}

export default generateReferenceNumber;
