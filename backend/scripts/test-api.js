/**
 * Day 8 — run all key API checks against a running server.
 * Usage: Window 1 = npm start   Window 2 = npm run test:api
 */
const BASE = process.env.API_URL || "http://localhost:5000";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  PASS  ${name}`);
    passed += 1;
  } catch (error) {
    console.log(`  FAIL  ${name}`);
    console.log(`        ${error.message}`);
    failed += 1;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, options);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

async function login(email, password) {
  const { response, data } = await request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(response.ok, `Login failed for ${email}: ${data.message || response.status}`);
  assert(data.token, "No token returned");
  return data;
}

async function run() {
  console.log(`\nAPI tests → ${BASE}\n`);

  let johnToken;
  let janeToken;
  let listingId;

  await test("GET /api/health", async () => {
    const { response, data } = await request("/api/health");
    assert(response.ok, "Not OK");
    assert(data.success === true, "success not true");
    assert(data.database === "connected", "database not connected");
  });

  await test("GET /api/accommodations", async () => {
    const { response, data } = await request("/api/accommodations");
    assert(response.ok, data.message);
    assert(data.count >= 1, "Expected at least 1 listing");
    listingId = data.data[0]._id;
  });

  await test("GET /api/accommodations?location=Cape Town", async () => {
    const { response, data } = await request("/api/accommodations?location=Cape Town");
    assert(response.ok, data.message);
    assert(data.count >= 1, "Expected Cape Town listings");
  });

  await test("GET /api/accommodations/:id", async () => {
    const { response, data } = await request(`/api/accommodations/${listingId}`);
    assert(response.ok, data.message);
    assert(data.data._id === listingId, "Wrong listing returned");
  });

  await test("POST /api/users/login (Jannie)", async () => {
    const data = await login("jannie@example.com", "password123");
    johnToken = data.token;
    assert(data.user.role === "user", "Jannie should be user role");
  });

  await test("POST /api/users/login (Lerato)", async () => {
    const data = await login("lerato@example.com", "password321");
    janeToken = data.token;
    assert(data.user.role === "host", "Lerato should be host role");
  });

  await test("GET /api/users/me (with token)", async () => {
    const { response, data } = await request("/api/users/me", {
      headers: { Authorization: `Bearer ${johnToken}` },
    });
    assert(response.ok, data.message);
    assert(data.user.userId, "Missing userId in token payload");
  });

  await test("GET /api/users/me (no token → 401)", async () => {
    const { response } = await request("/api/users/me");
    assert(response.status === 401, `Expected 401, got ${response.status}`);
  });

  await test("GET /api/reservations/user", async () => {
    const { response, data } = await request("/api/reservations/user", {
      headers: { Authorization: `Bearer ${johnToken}` },
    });
    assert(response.ok, data.message);
    assert(Array.isArray(data.data), "data should be an array");
  });

  await test("GET /api/reservations/host", async () => {
    const { response, data } = await request("/api/reservations/host", {
      headers: { Authorization: `Bearer ${janeToken}` },
    });
    assert(response.ok, data.message);
    assert(Array.isArray(data.data), "data should be an array");
  });

  await test("POST /api/reservations", async () => {
    const { response, data } = await request("/api/reservations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${johnToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accommodation: listingId,
        checkIn: "2026-08-01",
        checkOut: "2026-08-04",
        guests: 2,
      }),
    });
    assert(response.status === 201, data.message || "Expected 201");
    assert(data.data.totalPrice > 0, "totalPrice should be calculated");
  });

  await test("POST /api/accommodations (host only)", async () => {
    const { response, data } = await request("/api/accommodations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${janeToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "API Test Cottage Cape Town",
        description: "Temporary test listing from test:api script.",
        type: "Entire house",
        location: "Cape Town",
        guests: 2,
        bedrooms: 1,
        bathrooms: 1,
        price: 500,
      }),
    });
    assert(response.status === 201, data.message || "Expected 201");
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error("\nCould not run tests:", err.message);
  console.error("Is the server running?  cd backend && npm start\n");
  process.exit(1);
});
