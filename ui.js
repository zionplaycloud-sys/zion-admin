const DEFAULT_BACKEND_URL = "https://zion-payment-server-o7p6.onrender.com";
const BACKEND_URL = (window.__ZION_CONFIG?.BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/+$/, "");
let currentAdminUsername = "";

async function safeFetch(url, options = {}) {
  try {
        // auto add headers
    options.headers = {
      ...(options.headers || {}),
      "x-admin-secret":
        localStorage.getItem("adminToken") || ""
    };

    const res = await fetch(url, options);
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return { success: false, error: err?.error || "SERVER_ERROR" };
    }
    return await res.json();
  } catch (err) {
    return null;
  }
}

function showMsg(message) {
  const box = document.getElementById("msg-box") || document.getElementById("stats-box");
  if (box) box.innerText = message;
}

async function adminLogin() {
  const email = document.getElementById("admin-user").value;
  const password = document.getElementById("admin-pass").value;
  const data = await safeFetch(`${BACKEND_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!data) return showMsg("Server offline");
  if (!data.success || !data.isAdmin) return showMsg("Invalid admin login");

  currentAdminUsername = email;
  localStorage.setItem(
  "adminToken",
  data.adminToken
);
  localStorage.setItem(
  "admin_username",
  email
);
  document.getElementById("login-panel").style.display = "none";
  document.getElementById("admin-panel").style.display = "block";
  openDashboard(document.querySelector(".menu li"));
  showMsg("");
}

async function loadStats(range) {
  const data = await safeFetch(`${BACKEND_URL}/admin-stats?range=${range}&username=${encodeURIComponent(currentAdminUsername)}`);
  const box = document.getElementById("stats-box");
  if (!data) {
    box.innerText = "Server offline";
    return;
  }
  if (!data.success) {
    box.innerText = "Failed to load stats";
    return;
  }
  box.innerText =
    `Revenue: Rs ${data.totalRevenue}\n` +
    `Orders: ${data.totalOrders}\n` +
    `Hours Sold: ${data.totalHours}\n` +
    `Points: ${data.totalPoints}`;
}

async function adminAddTime() {
  const email = document.getElementById("admin-email").value;
  const hrs = parseFloat(document.getElementById("admin-hrs").value) || 0;
  const pts = parseInt(document.getElementById("admin-pts").value, 10) || 0;
  if (!email) return showMsg("Enter user email");

  const data = await safeFetch(`${BACKEND_URL}/admin-add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentAdminUsername, email, hrs, pts })
  });

  showMsg(data?.success ? `Added ${hrs} hrs and ${pts} pts to ${email}` : "Failed. Check email existence.");
}

async function toggleMaintenance(enabled) {
  const data = await safeFetch(`${BACKEND_URL}/toggle-maintenance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentAdminUsername, enabled })
  });

  showMsg(data?.success ? `Maintenance Mode: ${data.maintenanceMode ? "ENABLED" : "DISABLED"}` : "Failed to update maintenance mode");
}

async function generateVouchers() {
  const data = await safeFetch(`${BACKEND_URL}/generate-vouchers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentAdminUsername })
  });

  showMsg(data?.success ? `Generated ${data.count} voucher codes` : (data?.error || "Voucher generation failed"));
}

// ================= USERS =================

function openUsers(el) {
  // highlight active menu
  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  el.classList.add("active");

  // hide all cards inside admin panel
document.getElementById("dashboard-page").style.display = "none";
document.getElementById("dashboard-controls").style.display = "none";
document.getElementById("users-page").style.display = "none";
document.getElementById("subscriptions-page").style.display = "none";
document.getElementById("games-page").style.display = "none";
document.getElementById("transactions-page").style.display = "none";
document.getElementById("servers-page").style.display = "none";
document.getElementById("reports-page").style.display = "none";
document.getElementById("support-page").style.display = "none";
document.getElementById("vouchers-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
document.getElementById("notifications-page").style.display = "none";


  // show users page
  document.getElementById("users-page").style.display = "block";

  // load users
  loadUsers();
}

async function loadUsers() {

  const box =
    document.getElementById("userList");

  box.innerHTML = "Loading...";

  try {

    const data = await safeFetch(
      `${BACKEND_URL}/admin-users?username=${encodeURIComponent(currentAdminUsername)}`
    );

    if (!data || !data.success) {

      box.innerHTML =
        "Failed to load users";

      return;
    }

    let html = "";

    data.users.forEach(u => {

      html += `
        <div style="
          padding:10px;
          margin-bottom:8px;
          background:#111;
          border-radius:8px;
          cursor:pointer;
        "
        onclick='showUser(${JSON.stringify(u)})'>

          ${u.username}

        </div>
      `;
    });

    box.innerHTML = html;

  } catch (err) {

    console.log(err);

    box.innerHTML =
      "Error loading users";

  }
}

function showUser(u) {
  document.getElementById("userDetails").innerHTML = `
    <h3>${u.username}</h3>
    <p>Hours: ${u.hours}</p>
    <p>Points: ${u.pts}</p>
    <p>Email: ${u.customer_email || "-"}</p>
    <p>Phone: ${u.customer_phone || "-"}</p>
  `;
}
// ================= SUBSCRIPTIONS =================

function openSubscriptions(el) {
  // highlight active menu
  document.querySelectorAll(".menu li").forEach(li => li.classList.remove("active"));
  el.classList.add("active");

  // hide all cards
document.getElementById("dashboard-page").style.display = "none";
document.getElementById("dashboard-controls").style.display = "none";
document.getElementById("users-page").style.display = "none";
document.getElementById("subscriptions-page").style.display = "none";
document.getElementById("games-page").style.display = "none";
document.getElementById("transactions-page").style.display = "none";
document.getElementById("servers-page").style.display = "none";
document.getElementById("reports-page").style.display = "none";
document.getElementById("support-page").style.display = "none";
document.getElementById("vouchers-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
document.getElementById("notifications-page").style.display = "none";

  // show subscriptions page
  document.getElementById("subscriptions-page").style.display = "block";

  loadPlans();
}

async function loadPlans() {
  const box = document.getElementById("plansList");
  box.innerHTML = "Loading...";

  const data = await safeFetch(`${BACKEND_URL}/get-prices`);

  if (!data || !data.success) {
    box.innerHTML = "Failed to load plans";
    return;
  }

  let html = "";

  data.prices.forEach(p => {
    html += `
      <div style="
        padding:10px;
        margin:10px 0;
        background:#111;
        border-radius:10px;
      ">
        <b>${p.name}</b><br>
        ₹${p.price} | ${p.hours} hrs<br>
        Type: ${p.type}<br>
        Valid: ${p.valid_days || 0} days<br>

        <button onclick="deletePlan(${p.id})">Delete</button>
      </div>
    `;
  });

  box.innerHTML = html;
}

async function addPlan() {
  const plan = {
    name: document.getElementById("pname").value,
    price: Number(document.getElementById("pprice").value),
    hours: Number(document.getElementById("phours").value),
    type: document.getElementById("ptype").value,
    valid_days: Number(document.getElementById("pvalid").value) || 0
  };

  const data = await safeFetch(`${BACKEND_URL}/add-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  username: currentAdminUsername,
  ...plan
})
  });

  if (data?.success) {
    loadPlans();
  } else {
    alert("Failed to add plan");
  }
}

async function deletePlan(id) {
  if (!confirm("Delete this plan?")) return;

  const data = await safeFetch(`${BACKEND_URL}/delete-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
  username: currentAdminUsername,
  id
})
  });

  if (data?.success) {
    loadPlans();
  } else {
    alert("Delete failed");
  }
}

// ================= DASHBOARD =================

function openDashboard(el){

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "block";

  document.getElementById("dashboard-controls").style.display = "block";

  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";

  document.getElementById("games-page").style.display = "none";
  document.getElementById("notifications-page").style.display = "none";
  document.getElementById("transactions-page").style.display = "none";

  document.getElementById("servers-page").style.display = "none";

  document.getElementById("reports-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
  document.getElementById("support-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";

  document.getElementById("analytics-page").style.display = "none";
  document.getElementById("notifications-page").style.display = "none";
}


// ================= GAMES =================

function openGames(el) {

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "none";

  document.getElementById("dashboard-controls").style.display = "none";

  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";

  document.getElementById("transactions-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
  document.getElementById("servers-page").style.display = "none";

  document.getElementById("reports-page").style.display = "none";

  document.getElementById("support-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";

  document.getElementById("analytics-page").style.display = "none";

    document.getElementById("notifications-page").style.display = "none";

  document.getElementById("games-page").style.display = "block";


  loadGamesAdmin();
}

async function loadGamesAdmin() {

  const grid = document.getElementById("gamesGrid");

  grid.innerHTML = "Loading...";

  const data = await safeFetch(`${BACKEND_URL}/get-games`);

  if (!data || !data.success) {
    grid.innerHTML = "Failed to load games";
    return;
  }

  let html = "";

  data.games.forEach(g => {

    html += `
      <div style="
        background:rgba(0,0,0,0.5);
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 0 10px rgba(123,47,247,0.5);
      ">

        <img src="${g.img}"
        style="
          width:100%;
          height:120px;
          object-fit:cover;
        ">

        <div style="padding:10px;">

          <b>${g.name}</b>

          <br><br>

          <button
            class="danger"
            onclick="deleteGame('${g.id}')">

            Delete

          </button>

        </div>

      </div>
    `;
  });

  grid.innerHTML = html;
}

async function addGame() {

  const name = document.getElementById("game-name").value;

  const img = document.getElementById("game-img").value;

  const exe_path = document.getElementById("game-path").value;

  const data = await safeFetch(`${BACKEND_URL}/add-game`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      username: currentAdminUsername,
      name,
      img,
      exe_path
    })
  });

  if (data?.success) {

    document.getElementById("game-name").value = "";
    document.getElementById("game-img").value = "";
    document.getElementById("game-path").value = "";

    loadGamesAdmin();

  } else {

    alert("Failed");

  }
}

async function deleteGame(id) {

  if (!confirm("Delete game?")) return;

  const data = await safeFetch(`${BACKEND_URL}/delete-game`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      username: currentAdminUsername,
      id
    })
  });

  if (data?.success) {
    loadGamesAdmin();
  }
}

// ================= REPORTS =================

function openReports(el) {

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "none";

  document.getElementById("dashboard-controls").style.display = "none";

  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";

  document.getElementById("games-page").style.display = "none";

    document.getElementById("notifications-page").style.display = "none";

  document.getElementById("transactions-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
  document.getElementById("servers-page").style.display = "none";

  document.getElementById("support-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";


  document.getElementById("reports-page").style.display = "block";

  loadReports();
}
function openVouchers(el) {

  document.querySelectorAll(".menu li")
  .forEach(li => li.classList.remove("active"));

el.classList.add("active");

 document.getElementById(
  "dashboard-controls"
).style.display = "none";

  document.getElementById(
    "users-page"
  ).style.display = "none";

  document.getElementById(
    "subscriptions-page"
  ).style.display = "none";

  document.getElementById(
    "games-page"
  ).style.display = "none";

  document.getElementById(
    "transactions-page"
  ).style.display = "none";

  document.getElementById(
    "servers-page"
  ).style.display = "none";

  document.getElementById(
    "reports-page"
  ).style.display = "none";

  document.getElementById(
    "support-page"
  ).style.display = "none";

  document.getElementById("notifications-page").style.display = "none";

  document.getElementById("analytics-page").style.display = "none";

  document.getElementById("settings-page").style.display = "none";


  document.getElementById(
    "vouchers-page"
  ).style.display = "block";

  loadVouchers();

}

async function loadVouchers() {

  const box =
    document.getElementById(
      "voucherList"
    );

  box.innerHTML = "Loading...";

  const data = await safeFetch(
    `${BACKEND_URL}/admin-vouchers`
  );

  if (!data || !data.success) {

    box.innerHTML =
      "Failed to load vouchers";

    return;
  }

  let html = "";

  data.vouchers.forEach(v => {

    html += `
      <div style="
        background:#111;
        padding:15px;
        border-radius:12px;
        margin-bottom:10px;
      ">

        <h3>${v.code}</h3>

        <p>
          Hours:
          ${v.hours}
        </p>

        <p>
          Used:
          ${v.used ? "YES" : "NO"}
        </p>

        <p>
          Redeemed By:
          ${v.redeemed_by || "-"}
        </p>

        <button
          class="danger"
          onclick="deleteVoucher('${v.code}')">

          Delete

        </button>

      </div>
    `;
  });

  box.innerHTML = html;
}

async function createVoucher() {

  const hours =
    document.getElementById(
      "voucherHours"
    ).value;

  if (!hours) {

    return alert(
      "Enter hours"
    );

  }

  // AUTO GENERATE CODE
  const random =
    Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

  const code =
    "ZP-" + random;

  const data = await safeFetch(
    `${BACKEND_URL}/create-voucher`,
    {
      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        code,
        hours
      })
    }
  );

  if (data?.success) {

    alert(
      "Voucher Created:\n\n" +
      code
    );

    loadVouchers();

  } else {

    alert("Failed");

  }

}



async function deleteVoucher(code) {

  if (!confirm(
    "Delete voucher?"
  )) return;

  const data = await safeFetch(
    `${BACKEND_URL}/delete-voucher`,
    {
      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        code
      })
    }
  );

  if (data?.success) {

    loadVouchers();

  } else {

    alert("Failed");

  }

}

// ================= SUPPORT =================

function openSupport(el) {

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "none";

  document.getElementById("dashboard-controls").style.display = "none";

  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";
  document.getElementById("notifications-page").style.display = "none";
  document.getElementById("games-page").style.display = "none";

  document.getElementById("transactions-page").style.display = "none";

  document.getElementById("servers-page").style.display = "none";

  document.getElementById("reports-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";


  document.getElementById("support-page").style.display = "block";

  loadSupportStatus();
}
// ================= ANALYTICS =================

function openAnalytics(el) {

  document.querySelectorAll(".menu li")
    .forEach(li =>
      li.classList.remove("active")
    );

  el.classList.add("active");

  [
    "dashboard-page",
    "users-page",
    "subscriptions-page",
    "games-page",
    "transactions-page",
    "reports-page",
    "support-page",
    "vouchers-page",
    "servers-page"
  ].forEach(id => {

    const page =
      document.getElementById(id);

    if (page) {
      page.style.display = "none";
    }

  });

  document.getElementById(
    "dashboard-controls"
  ).style.display = "none";

  document.getElementById(
    "notifications-page"
  ).style.display = "none";
document.getElementById("settings-page").style.display = "none";
  document.getElementById(
    "analytics-page"
  ).style.display = "block";

  loadAnalytics();

}

async function loadAnalytics() {

  const data = await safeFetch(
    `${BACKEND_URL}/admin-analytics`
  );

  if (!data || !data.success) {

    alert("Failed to load analytics");

    return;
  }

  // TOP STATS
  document.getElementById(
    "anaRevenue"
  ).innerText =
    "₹" + data.totalRevenue;

  document.getElementById(
    "anaUsers"
  ).innerText =
    data.totalUsers;

  document.getElementById(
    "anaHours"
  ).innerText =
    data.totalHours;

  document.getElementById(
    "anaVoucher"
  ).innerText =
    data.vouchersUsed;

  // SYSTEM STATUS
  document.getElementById(
    "anaOnlinePCs"
  ).innerText =
    data.onlinePCs;

  document.getElementById(
    "anaBusyPCs"
  ).innerText =
    data.busyPCs;

  document.getElementById(
    "anaReports"
  ).innerText =
    data.openReports;

  document.getElementById(
    "anaSupport"
  ).innerText =
    data.supportOnline;

  // TOP USERS
  let html = "";

  data.topUsers.forEach(u => {

    html += `
      <div style="
        background:#111;
        padding:14px;
        border-radius:12px;
        margin-bottom:12px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
        ">

          <b>${u.username}</b>

          <span>
            ${u.hours}h
          </span>

        </div>

      </div>
    `;

  });

  document.getElementById(
    "topUsers"
  ).innerHTML = html;

}
// ================= SERVERS =================

function openServers(el) {

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "none";

  document.getElementById("dashboard-controls").style.display = "none";
    document.getElementById("notifications-page").style.display = "none";

  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";

  document.getElementById("games-page").style.display = "none";

  document.getElementById("transactions-page").style.display = "none";

  document.getElementById("reports-page").style.display = "none";

  document.getElementById("support-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";
document.getElementById("notifications-page").style.display = "none";

  document.getElementById("servers-page").style.display = "block";

  loadServers();
}


function openTransactions(el) {

  document.querySelectorAll(".menu li")
    .forEach(li => li.classList.remove("active"));

  el.classList.add("active");

  document.getElementById("dashboard-page").style.display = "none";

  document.getElementById("dashboard-controls").style.display = "none";
  document.getElementById("notifications-page").style.display = "none";
  document.getElementById("users-page").style.display = "none";

  document.getElementById("subscriptions-page").style.display = "none";

  document.getElementById("games-page").style.display = "none";

  document.getElementById("servers-page").style.display = "none";

  document.getElementById("reports-page").style.display = "none";

  document.getElementById("support-page").style.display = "none";
document.getElementById("analytics-page").style.display = "none";

  document.getElementById("vouchers-page").style.display = "none";
document.getElementById("settings-page").style.display = "none";

  document.getElementById("transactions-page").style.display = "block";

  loadTransactions("today");
}

async function loadTransactions(range) {

  const table = document.getElementById("transactionsTable");

  table.innerHTML = `
    <tr>
      <td colspan="8"
      style="padding:20px;text-align:center;">
        Loading...
      </td>
    </tr>
  `;

  const data = await safeFetch(
    `${BACKEND_URL}/admin-transactions?username=${encodeURIComponent(currentAdminUsername)}`
  );

  if (!data || !data.success) {

    table.innerHTML = `
      <tr>
        <td colspan="8"
        style="padding:20px;text-align:center;">
          Failed to load
        </td>
      </tr>
    `;

    return;
  }

  let html = "";

  let credited = 0;
  let debited = 0;

  // PAYMENTS
  data.payments.forEach(p => {

    credited += Number(p.amount || 0);

    html += `
      <tr>

        <td style="padding:12px;">
          ${p.username || "-"}
        </td>

        <td>
          Payment
        </td>

        <td>
          ₹${p.amount || 0}
        </td>

        <td>
          ${p.hours || 0}h
        </td>

        <td>
          ${p.points || 0}
        </td>

        <td>
          ${new Date(p.created_at)
            .toLocaleDateString()}
        </td>

        <td style="color:#00ff88;">
          ₹${p.amount || 0}
        </td>

        <td style="color:#ff4444;">
          ₹0
        </td>

      </tr>
    `;
  });

  // EXPENSES
  data.expenses.forEach(e => {

    debited += Number(e.amount || 0);

    html += `
      <tr>

        <td style="padding:12px;">
          Admin
        </td>

        <td>
          Expense
        </td>

        <td>
          ₹${e.amount || 0}
        </td>

        <td>
          -
        </td>

        <td>
          -
        </td>

        <td>
          ${new Date(e.created_at)
            .toLocaleDateString()}
        </td>

        <td style="color:#00ff88;">
          ₹0
        </td>

        <td style="color:#ff4444;">
          ₹${e.amount || 0}
        </td>

      </tr>
    `;
  });

  if (!html) {

    html = `
      <tr>
        <td colspan="8"
        style="padding:20px;text-align:center;">
          No transactions
        </td>
      </tr>
    `;
  }

  table.innerHTML = html;

  document.getElementById("totalCredited")
    .innerText = `₹${credited}`;

  document.getElementById("totalDebited")
    .innerText = `₹${debited}`;

  document.getElementById("totalProfit")
    .innerText = `₹${credited - debited}`;
}

async function openExpensePopup() {

  const title = prompt("Expense Title");

  if (!title) return;

  const amount = prompt("Expense Amount");

  if (!amount) return;

  const data = await safeFetch(
    `${BACKEND_URL}/add-expense`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
     body: JSON.stringify({
  username: currentAdminUsername,
  title,
  amount
})
    }
  );
if (data?.success) {

  alert("Expense Added");

  loadTransactions("today");

} else {

    alert(
  data?.error || "Failed to add expense"
);

  }
}

async function loadServers() {

  const grid = document.getElementById("serversGrid");

  grid.innerHTML = "Loading...";

  const data = await safeFetch(
    `${BACKEND_URL}/admin-pcs?username=${encodeURIComponent(currentAdminUsername)}`
  );

  if (!data || !data.success) {

    grid.innerHTML = "Failed to load servers";

    return;
  }

  let html = "";

  data.pcs.forEach(pc => {

    const statusColor =
      pc.status === "online"
      ? "#00ff88"
      : pc.status === "busy"
      ? "#ffaa00"
      : "#ff4444";

    html += `
      <div style="
        background:rgba(0,0,0,0.5);
        border-radius:16px;
        padding:20px;
        border:1px solid ${statusColor};
        box-shadow:0 0 20px ${statusColor}33;
      ">

        <h3>
          ${pc.name || "PC"}
        </h3>

        <p style="color:${statusColor};">
          ${pc.status || "offline"}
        </p>

        <br>

        <p>
          GPU:
          ${pc.gpu || "RTX"}
        </p>

        <p>
          RAM:
          ${pc.ram || "32GB"}
        </p>

        <p>
          User:
          ${pc.current_user || "-"}
        </p>

        <p>
          Game:
          ${pc.current_game || "-"}
        </p>

        <br>

        <button class="info">
          Restart
        </button>

        <button class="danger">
          Shutdown
        </button>

      </div>
    `;
  });

  grid.innerHTML = html;
}

async function loadReports() {

  const box =
    document.getElementById("reportsList");

  box.innerHTML = "Loading...";

  const data = await safeFetch(
    `${BACKEND_URL}/admin-reports?username=${encodeURIComponent(currentAdminUsername)}`
  );

  if (!data || !data.success) {

    box.innerHTML =
      "Failed to load reports";

    return;
  }

  let html = "";

  data.reports.forEach(r => {

   const color =
  r.status === "closed"
  ? "#00ff88"
  : r.status === "investigating"
  ? "#ffaa00"
  : "#ff4444";

    html += `
      <div style="
        background:rgba(0,0,0,0.4);
        border-left:4px solid ${color};
        padding:20px;
        border-radius:12px;
        margin-bottom:15px;
      ">

        <h3>
          ${r.title || "No Title"}
        </h3>

        <br>

        <p>
          <b>User:</b>
          ${r.username || "-"}
        </p>

        <p>
          <b>Category:</b>
          ${r.category || "Other"}
        </p>

        <p>
          <b>Status:</b>
          <span style="color:${color}">
            ${r.status || "open"}
          </span>
        </p>

        <br>

        <p>
          ${r.description || "-"}
        </p>

        <br>

        <button
          class="info"
          onclick="updateReportStatus(${r.id}, 'investigating')">

          Investigating

        </button>

      <button
  class="primary"
  onclick="updateReportStatus(${r.id}, 'closed')">

  Close

</button>

      </div>
    `;
  });

  if (!html) {
    html = "No reports";
  }

  box.innerHTML = html;
}
async function updateReportStatus(
  id,
  status
) {

  const data = await safeFetch(
    `${BACKEND_URL}/update-report-status`,
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        username: currentAdminUsername,
        id,
        status
      })
    }
  );

  if (data?.success) {

    loadReports();

  } else {

    alert("Failed");

  }
}

async function loadSupportStatus() {

  const box =
    document.getElementById("supportStatusBox");

  box.innerHTML = "Loading...";

  const data = await safeFetch(
    `${BACKEND_URL}/support-status`
  );

  if (!data || !data.success) {

    box.innerHTML =
      "Failed to load support status";

    return;
  }

  let html = "";

  data.admins.forEach(admin => {

    const color =
      admin.status === "online"
      ? "#00ff88"
      : admin.status === "busy"
      ? "#ffaa00"
      : "#ff4444";

    html += `
      <div style="
        background:rgba(0,0,0,0.4);
        border-left:4px solid ${color};
        padding:20px;
        border-radius:12px;
        margin-bottom:15px;
      ">

        <h3>
          ${admin.username}
        </h3>

        <p style="color:${color};">
          ${admin.status}
        </p>

        <p>
          Last Seen:
          ${new Date(admin.last_seen)
            .toLocaleString()}
        </p>

      </div>
    `;
  });

  if (!html) {
    html = "No admins found";
  }

  box.innerHTML = html;
}

async function updateAdminStatus(status) {

  const data = await safeFetch(
    `${BACKEND_URL}/update-admin-status`,
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        username: currentAdminUsername,
        status
      })
    }
  );

  if (data?.success) {

    loadSupportStatus();

  } else {

    alert("Failed");

  }
}

function downloadTransactionsPDF() {

  window.print();

}

// ================= SETTINGS =================

function openSettings(el) {

  document.querySelectorAll(".menu li")
    .forEach(li =>
      li.classList.remove("active")
    );

  el.classList.add("active");

  [
    "dashboard-page",
    "users-page",
    "subscriptions-page",
    "games-page",
    "transactions-page",
    "reports-page",
    "support-page",
    "vouchers-page",
    "servers-page",
    "analytics-page"
  ].forEach(id => {

    const page =
      document.getElementById(id);

    if (page) {
      page.style.display = "none";
    }

  });

  document.getElementById(
    "dashboard-controls"
  ).style.display = "none";

  document.getElementById("notifications-page").style.display = "none";

  document.getElementById(
    "settings-page"
  ).style.display = "block";

}

// ================= SAVE PLATFORM =================

async function savePlatformSettings() {

  const enabled =
    document.getElementById(
      "setMaintenance"
    ).value === "true";

  const data = await safeFetch(
    `${BACKEND_URL}/toggle-maintenance`,
    {
      method:"POST",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({
        enabled
      })
    }
  );

  if (data?.success) {

    alert(
      "Platform settings saved"
    );

  } else {

    alert("Failed");

  }

}

// ================= SAVE LINKS =================

function saveLinksSettings() {

  const discord =
    document.getElementById(
      "setDiscord"
    ).value;

  const website =
    document.getElementById(
      "setWebsite"
    ).value;

  const support =
    document.getElementById(
      "setSupport"
    ).value;

  localStorage.setItem(
    "zp_discord",
    discord
  );

  localStorage.setItem(
    "zp_website",
    website
  );

  localStorage.setItem(
    "zp_support",
    support
  );

  alert("Links saved");

}

// ================= SAVE STREAM SETTINGS =================

function saveStreamSettings() {

  const streamUrl =
    document.getElementById(
      "setStreamUrl"
    ).value;

  const agentUrl =
    document.getElementById(
      "setAgentUrl"
    ).value;

  localStorage.setItem(
    "zp_stream_url",
    streamUrl
  );

  localStorage.setItem(
    "zp_agent_url",
    agentUrl
  );

  alert("Streaming settings saved");

}

// ================= NOTIFICATIONS =================

let notifications = [];

// OPEN PAGE
function openNotifications(el) {

  document.querySelectorAll(".menu li")
    .forEach(li =>
      li.classList.remove("active")
    );

  el.classList.add("active");

  [
    "dashboard-page",
    "users-page",
    "subscriptions-page",
    "games-page",
    "transactions-page",
    "reports-page",
    "support-page",
    "vouchers-page",
    "servers-page",
    "analytics-page",
    "settings-page"
  ].forEach(id => {

    const page =
      document.getElementById(id);

    if (page) {
      page.style.display = "none";
    }

  });

  document.getElementById(
    "dashboard-controls"
  ).style.display = "none";

  document.getElementById(
    "notifications-page"
  ).style.display = "block";

  renderNotifications();

}

// ADD NOTIFICATION
function addNotification(
  title,
  message,
  color = "#00d4ff"
) {

  notifications.unshift({
    title,
    message,
    color,
    time:new Date()
      .toLocaleTimeString()
  });

  renderNotifications();

}

// RENDER
function renderNotifications() {

  const box =
    document.getElementById(
      "notificationsList"
    );

  if (!notifications.length) {

    box.innerHTML = `
      <div style="
        opacity:0.7;
        padding:20px;
      ">
        No notifications
      </div>
    `;

    return;
  }

  let html = "";

  notifications.forEach(n => {

    html += `
      <div style="
        padding:20px;
        background:#111827;
        border-radius:16px;
        margin-bottom:15px;
        border-left:4px solid ${n.color};
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          margin-bottom:10px;
        ">

          <strong>
            ${n.title}
          </strong>

          <span style="
            color:#888;
            font-size:13px;
          ">
            ${n.time}
          </span>

        </div>

        <p style="
          color:#ccc;
        ">
          ${n.message}
        </p>

      </div>
    `;

  });

  box.innerHTML = html;

}

// CLEAR
function clearNotifications() {

  notifications = [];

  renderNotifications();

}