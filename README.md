🏋️ FitTrack — Gym Membership & Workout Tracking System

FitTrack is a web-based gym management system built as a university OOP group project. It allows gym members to manage their memberships and track workout progress, trainers to assign and monitor workout plans and admins to manage the entire gym from a single dashboard.

## 📖 About the Project

### Problem
Many small local gyms in Sri Lanka still manage memberships and workout plans manually using paper registers and WhatsApp messages. This leads to:
- Payment confusion and missed renewals
- No proper workout guidance for members
- No way to monitor member progress

### Solution
**FitTrack** is a web-based platform that provides:
- A clean dashboard for **members** to manage memberships and track workouts
- A panel for **trainers** to assign and monitor workout plans
- A full control panel for **admins** to manage the entire gym

---

## ✨ Features

### 👤 Member
- Register and purchase a membership plan
- View membership status and expiry date
- View personalized workout plan assigned by trainer
- Log daily workout progress
- Receive notifications before membership expires

### 💪 Trainer
- View list of assigned members
- Create and assign personalized workout plans
- Monitor each member's workout progress

### 🔧 Admin
- Manage all members and membership plans
- Track all payments and revenue
- Add and manage trainers
- View membership reports and statistics

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Java with Spring Boot |
| **Database** | MySQL |
| **ORM** | Hibernate |
| **Version Control** | Git and GitHub |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

---

## 📁 Project Structure

```
fittrack/
│
├── frontend/                        # React.js frontend
│   ├── public/
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── Sidebar.jsx
│       ├── pages/                   # All page screens
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── member/
│       │   │   ├── MemberHome.jsx
│       │   │   ├── Membership.jsx
│       │   │   ├── WorkoutPlan.jsx
│       │   │   ├── Progress.jsx
│       │   │   └── Notifications.jsx
│       │   ├── trainer/
│       │   │   ├── TrainerHome.jsx
│       │   │   ├── MyMembers.jsx
│       │   │   ├── AssignPlan.jsx
│       │   │   └── MonitorProgress.jsx
│       │   └── admin/
│       │       ├── AdminHome.jsx
│       │       ├── ManageMembers.jsx
│       │       ├── PaymentTracking.jsx
│       │       ├── ManageTrainers.jsx
│       │       └── Reports.jsx
│       ├── services/                # API call functions
│       └── App.jsx
│
├── backend/                         # Java Spring Boot backend
│   └── src/main/java/com/fittrack/
│       ├── model/                   # OOP classes
│       │   ├── User.java
│       │   ├── Member.java
│       │   ├── Trainer.java
│       │   ├── Admin.java
│       │   ├── Membership.java
│       │   ├── WorkoutPlan.java
│       │   ├── WorkoutDay.java
│       │   ├── Exercise.java
│       │   ├── ProgressLog.java
│       │   └── Notification.java
│       ├── controller/              # REST API endpoints
│       ├── service/                 # Business logic layer
│       ├── repository/              # Database query layer
│       └── FitTrackApplication.java
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Java JDK](https://www.oracle.com/java/technologies/downloads/) (v17+)
- [MySQL](https://www.mysql.com/)
- [Maven](https://maven.apache.org/)

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/fittrack.git
cd fittrack
```

---

### 2️⃣ Setup the database

```sql
CREATE DATABASE fittrack;
```

---

### 3️⃣ Configure the backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fittrack
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

---

### 4️⃣ Run the backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

---

### 5️⃣ Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---
