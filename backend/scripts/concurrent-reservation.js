const assert = require("assert");

const requestCount = Number(process.env.REQUEST_COUNT || 10);
const apiUrl = process.env.API_URL || "http://localhost:5000/api/v1/event/book_ticket";
const ticketId = process.env.TICKET_ID;
const accessToken = process.env.ACCESS_TOKEN;

if (!ticketId || !accessToken) {
  throw new Error("Set TICKET_ID and ACCESS_TOKEN before running this script");
}

const reserve = () =>
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ ticketId }),
  }).then(async (response) => ({
    status: response.status,
    body: await response.json(),
  }));

Promise.all(Array.from({ length: requestCount }, reserve))
  .then((responses) => {
    const successful = responses.filter(({ status }) => status === 201);
    const conflicts = responses.filter(({ status }) => status === 409);

    assert.strictEqual(successful.length, 1, `expected 1 success, got ${successful.length}`);
    assert.strictEqual(conflicts.length, requestCount - 1, `expected ${requestCount - 1} conflicts, got ${conflicts.length}`);
    console.log(`PASS: ${successful.length} reservation succeeded; ${conflicts.length} received 409`);
  })
  .catch((error) => {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  });