// src/services/api.js
const BASE_URL = "http://localhost:8080/api";

// Helper — adds JWT token to every request
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("fittrack_token")}`,
});

// Helper — safe JSON parser for responses
const parseJsonResponse = async (res) => {
  const text = await res.text();
  let json = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = { message: text };
    }
  }
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json;
};

// ─── AUTH ─────────────────────────────────
export const authAPI = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseJsonResponse(res);
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return parseJsonResponse(res);
  },
};

// ─── MEMBERSHIP ───────────────────────────
export const membershipAPI = {
  getMy: () =>
    fetch(`${BASE_URL}/membership/my`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getPayments: () =>
    fetch(`${BASE_URL}/membership/payments`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  renew: (planType) =>
    fetch(`${BASE_URL}/membership/renew`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ planType }),
    }).then((r) => r.json()),
};

// ─── WORKOUT ──────────────────────────────
export const workoutAPI = {
  getMyPlan: () =>
    fetch(`${BASE_URL}/workout/my-plan`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  assignPlan: (data) =>
    fetch(`${BASE_URL}/workout/assign`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getMemberPlans: (memberId) =>
    fetch(`${BASE_URL}/workout/member/${memberId}`, {
      headers: authHeaders(),
    }).then((r) => r.json()),
};

// ─── PROGRESS ─────────────────────────────
export const progressAPI = {
  log: (data) =>
    fetch(`${BASE_URL}/progress/log`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(parseJsonResponse),

  getStats: () =>
    fetch(`${BASE_URL}/progress/stats`, {
      headers: authHeaders(),
    }).then(parseJsonResponse),

  getMy: () =>
    fetch(`${BASE_URL}/progress/my`, {
      headers: authHeaders(),
    }).then(parseJsonResponse),

  getMemberProgress: (memberId) =>
    fetch(`${BASE_URL}/progress/member/${memberId}`, {
      headers: authHeaders(),
    }).then(parseJsonResponse),
};

// ─── NOTIFICATIONS ────────────────────────
export const notificationAPI = {
  getMy: () =>
    fetch(`${BASE_URL}/notifications/my`, {
      headers: authHeaders(),
    }).then(parseJsonResponse),

  getUnreadCount: () =>
    fetch(`${BASE_URL}/notifications/unread-count`, {
      headers: authHeaders(),
    }).then(parseJsonResponse),

  markAsRead: (id) =>
    fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: "PUT",
      headers: authHeaders(),
    }).then(parseJsonResponse),

  markAllRead: () =>
    fetch(`${BASE_URL}/notifications/read-all`, {
      method: "PUT",
      headers: authHeaders(),
    }).then(parseJsonResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(parseJsonResponse),
};

// ─── USER & PROFILE ───────────────────────
export const userAPI = {
  getProfile: () =>
    fetch(`${BASE_URL}/user/profile`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  updateProfile: (data) =>
    fetch(`${BASE_URL}/user/profile`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  changePassword: (data) =>
    fetch(`${BASE_URL}/user/change-password`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),
};

// ─── EXERCISES ────────────────────────────
export const exerciseAPI = {
  getAll: (category = "", search = "") => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    return fetch(`${BASE_URL}/exercises?${params.toString()}`).then((r) => r.json());
  },
};

// ─── ATTENDANCE ───────────────────────────
export const attendanceAPI = {
  getToday: () =>
    fetch(`${BASE_URL}/attendance/today`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  checkIn: (query) =>
    fetch(`${BASE_URL}/attendance/check-in`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ query }),
    }).then((r) => r.json()),

  getMy: () =>
    fetch(`${BASE_URL}/attendance/my`, {
      headers: authHeaders(),
    }).then((r) => r.json()),
};

// ─── CHAT & MESSAGING ─────────────────────
export const chatAPI = {
  getContacts: () =>
    fetch(`${BASE_URL}/chat/contacts`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getMessages: (contactId) =>
    fetch(`${BASE_URL}/chat/messages/${contactId}`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  sendMessage: (recipientId, text) =>
    fetch(`${BASE_URL}/chat/send`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ recipientId, text }),
    }).then((r) => r.json()),
};

// ─── TRAINER ──────────────────────────────
export const trainerAPI = {
  getMyMembers: () =>
    fetch(`${BASE_URL}/trainer/my-members`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getStats: () =>
    fetch(`${BASE_URL}/trainer/stats`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getActivityFeed: () =>
    fetch(`${BASE_URL}/trainer/activity`, {
      headers: authHeaders(),
    }).then((r) => r.json()),
};

// ─── ADMIN ────────────────────────────────
export const adminAPI = {
  getStats: () =>
    fetch(`${BASE_URL}/admin/stats`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getMembers: () =>
    fetch(`${BASE_URL}/admin/members`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  addMember: (data) =>
    fetch(`${BASE_URL}/admin/members`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  updateMember: (id, data) =>
    fetch(`${BASE_URL}/admin/members/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  deleteMember: (id) =>
    fetch(`${BASE_URL}/admin/members/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => r.json()),

  getTrainers: () =>
    fetch(`${BASE_URL}/admin/trainers`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  addTrainer: (data) =>
    fetch(`${BASE_URL}/admin/trainers`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  updateTrainer: (id, data) =>
    fetch(`${BASE_URL}/admin/trainers/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  removeTrainer: (id) =>
    fetch(`${BASE_URL}/admin/trainers/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => r.json()),

  getPayments: () =>
    fetch(`${BASE_URL}/admin/payments`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  recordPayment: (data) =>
    fetch(`${BASE_URL}/admin/payments`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getNewMembersReport: () =>
    fetch(`${BASE_URL}/admin/reports/new-members-per-month`, {
      headers: authHeaders(),
    }).then((r) => r.json()),

  getRevenueReport: () =>
    fetch(`${BASE_URL}/admin/reports/revenue-growth`, {
      headers: authHeaders(),
    }).then((r) => r.json()),
};

// ─── PUBLIC LANDING ──────────────────────
export const publicAPI = {
  getLandingStats: () =>
    fetch(`${BASE_URL}/public/landing-stats`).then((r) => r.json()),
};