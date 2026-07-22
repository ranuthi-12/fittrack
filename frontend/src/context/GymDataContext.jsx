import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { adminAPI, trainerAPI, workoutAPI } from "../services/api.js";

const GymDataContext = createContext(null);

let idCounter = 100;
const nextId = (prefix) => `${prefix}${idCounter++}`;

export function GymDataProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activity, setActivity] = useState([]);
  const [newMembersPerMonth, setNewMembersPerMonth] = useState([]);
  const [myMembers, setMyMembers] = useState([]); // trainer's own assigned members

  // Load live data from Spring Boot REST API
  const refreshGymData = () => {
    const token = localStorage.getItem("fittrack_token");
    if (!token) return;

    const storedUser = localStorage.getItem("fittrack_user");
    let role = null;
    try {
      role = storedUser ? JSON.parse(storedUser).role : null;
    } catch (e) {
      role = null;
    }

    // Trainer-scoped data — safe for a TRAINER account to fetch.
    if (role === "TRAINER") {
      trainerAPI.getMyMembers()
        .then((data) => {
          if (Array.isArray(data)) {
            const formatted = data.map((u) => ({
              id: `m${u.id}`,
              rawId: u.id,
              name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
              plan: u.planType || "Monthly Plan",
              status: u.status || "Active",
              expiry: u.expiry || "2026-07-30",
              joined: u.joinedDate || "2026-06-01",
              phone: u.phone,
              email: u.email,
            }));
            setMyMembers(formatted);
          }
        })
        .catch(() => {});
    }

    // Admin-only data — skip the fetch entirely for member/trainer accounts
    // so they don't hit /api/admin/** and get 403s on every page load.
    if (role !== "ADMIN") return;

    // Fetch members
    adminAPI.getMembers()
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((u) => ({
            id: `m${u.id}`,
            rawId: u.id,
            name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
            plan: u.planType || "Monthly Plan",
            status: u.status || "Active",
            expiry: u.expiry || "2026-07-30",
            joined: u.joinedDate || "2026-06-01",
            phone: u.phone,
            email: u.email,
          }));
          setMembers(formatted);
        }
      })
      .catch(() => {});

    // Fetch trainers
    adminAPI.getTrainers()
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((t) => ({
            id: `t${t.id}`,
            rawId: t.id,
            name: t.user ? `${t.user.firstName || ''} ${t.user.lastName || ''}`.trim() : (t.name || "Trainer"),
            specialty: t.specialization || t.specialty || "Fitness",
            memberCount: t.memberCount || 0,
          }));
          setTrainers(formatted);
        }
      })
      .catch(() => {});

    // Fetch payments
    adminAPI.getPayments()
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((p) => ({
            id: `p${p.id}`,
            memberId: p.user ? `m${p.user.id}` : "m1",
            memberName: p.user ? `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() : "Member",
            plan: p.planType || "Monthly Plan",
            date: p.startDate || "2026-06-01",
            amount: p.amountPaid || 2500,
            status: p.status === "ACTIVE" ? "Paid" : p.status,
          }));
          setPayments(formatted);
        }
      })
      .catch(() => {});

    // Fetch activity feed
    trainerAPI.getActivityFeed()
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map((a) => ({
            id: `a${a.id}`,
            color: a.color || "blue",
            title: a.title,
            time: a.displayTime || "Recently",
          }));
          setActivity(formatted);
        }
      })
      .catch(() => {});

    // Fetch reports
    adminAPI.getNewMembersReport()
      .then((data) => {
        if (Array.isArray(data)) {
          setNewMembersPerMonth(data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshGymData();
  }, []);

  // ---------- Member actions ----------

  const addMember = (member) => {
    const newMemberObj = { id: nextId("m"), status: "Active", ...member };
    setMembers((prev) => [...prev, newMemberObj]);

    // Send to backend API
    const names = (member.name || "").split(" ");
    adminAPI.addMember({
      firstName: names[0] || member.name,
      lastName: names.slice(1).join(" ") || "Member",
      email: member.email || `${(member.name || "user").toLowerCase().replace(/\s+/g, '')}@fittrack.com`,
      password: "password123",
      phone: member.phone || "+94 77 000 0000",
    }).catch(() => {});
  };

  const updateMember = (id, updates) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    const m = members.find((item) => item.id === id);
    if (m && m.rawId) {
      const names = (updates.name || m.name || "").split(" ");
      adminAPI.updateMember(m.rawId, {
        firstName: names[0],
        lastName: names.slice(1).join(" "),
        phone: updates.phone || m.phone,
      }).catch(() => {});
    }
  };

  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    const m = members.find((item) => item.id === id);
    if (m && m.rawId) {
      adminAPI.deleteMember(m.rawId).catch(() => {});
    }
  };

  // ---------- Trainer actions ----------

  const addTrainer = (trainer) => {
    const newTrainerObj = { id: nextId("t"), memberCount: 0, ...trainer };
    setTrainers((prev) => [...prev, newTrainerObj]);

    const names = (trainer.name || "").split(" ");
    adminAPI.addTrainer({
      firstName: names[0] || trainer.name,
      lastName: names.slice(1).join(" ") || "Trainer",
      email: trainer.email || `${(trainer.name || "trainer").toLowerCase().replace(/\s+/g, '')}@fittrack.com`,
      password: "password123",
      phone: trainer.phone || "+94 77 111 2222",
      specialization: trainer.specialty || "General Fitness",
    }).catch(() => {});
  };

  const updateTrainer = (id, updates) => {
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    const t = trainers.find((item) => item.id === id);
    if (t && t.rawId) {
      const names = (updates.name || t.name || "").split(" ");
      adminAPI.updateTrainer(t.rawId, {
        firstName: names[0],
        lastName: names.slice(1).join(" "),
        specialization: updates.specialty || t.specialty,
      }).catch(() => {});
    }
  };

  const removeTrainer = (id) => {
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    const t = trainers.find((item) => item.id === id);
    if (t && t.rawId) {
      adminAPI.removeTrainer(t.rawId).catch(() => {});
    }
  };

  // ---------- Workout plan actions ----------

  const saveWorkoutPlan = (memberId, planEntry) => {
    return workoutAPI.assignPlan({
      memberId: memberId.replace('m', ''),
      planName: planEntry.planName || "Workout Plan",
      days: [
        {
          dayName: planEntry.day || "Monday",
          exercises: (planEntry.exercises || []).map((e) => ({
            exerciseName: e.name,
            sets: e.sets,
            reps: e.reps,
          })),
        },
      ],
    }).catch(() => {});
  };

  // ---------- Payment actions ----------

  const recordPayment = (paymentData) => {
    const newPaymentObj = {
      id: nextId("p"),
      memberId: paymentData.memberId || "m1",
      memberName: paymentData.memberName || "Member",
      plan: paymentData.plan || "Monthly Plan",
      date: paymentData.date || new Date().toISOString().slice(0, 10),
      amount: Number(paymentData.amount) || 2500,
      status: paymentData.status || "Paid",
    };
    setPayments((prev) => [newPaymentObj, ...prev]);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === paymentData.memberId || m.name === paymentData.memberName
          ? { ...m, status: "Active", plan: paymentData.plan || m.plan }
          : m
      )
    );
  };

  // ---------- Derived values used across dashboards ----------

  const stats = useMemo(() => {
    const totalMembers = members.length;
    const activeMemberships = members.filter((m) => m.status === "Active").length;
    const expiringSoon = members.filter((m) => m.status === "Expiring").length;
    const expiredMemberships = members.filter((m) => m.status === "Expired").length;
    const monthlyRevenue = payments
      .filter((p) => p.status === "Paid" || p.status === "ACTIVE")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      totalMembers,
      activeMemberships,
      expiringSoon,
      expiredMemberships,
      monthlyRevenue,
      activeTrainers: trainers.length,
    };
  }, [members, payments, trainers]);

  const value = {
    members,
    trainers,
    payments,
    activity,
    newMembersPerMonth,
    myMembers,
    stats,
    addMember,
    updateMember,
    deleteMember,
    addTrainer,
    updateTrainer,
    removeTrainer,
    saveWorkoutPlan,
    recordPayment,
    refreshGymData,
  };

  return (
    <GymDataContext.Provider value={value}>{children}</GymDataContext.Provider>
  );
}

export function useGymData() {
  const ctx = useContext(GymDataContext);
  if (!ctx) {
    throw new Error("useGymData must be used within a GymDataProvider");
  }
  return ctx;
}
