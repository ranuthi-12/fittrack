🏋️ FitTrack — Gym Membership & Workout Tracking System

FitTrack is a web-based gym management system built as a university OOP group project. It allows gym members to manage their memberships and track workout progress, trainers to assign and monitor workout plans, and admins to manage the entire gym from a single dashboard.

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
- Self-register and purchase a membership plan (Monthly / Quarterly / Annual)
- View membership status, expiry date, and payment history — and renew online
- View a personalized workout plan assigned by their trainer
- Log daily workout progress (weight, reps, sets) and view progress history / personal records
- Browse a searchable exercise library (by name, category, or muscle group)
- View a digital membership pass for gym check-in
- Receive and manage in-app notifications (workout assignments, membership reminders, achievements)

### 💪 Trainer
- View list of assigned members
- Create and assign personalized workout plans
- Monitor each assigned member's logged workout progress

### 🔧 Admin
- Manage all member accounts
- Add and manage trainer accounts
- Track all payments and revenue
- View gym-wide reports and statistics (new members per month, revenue growth)

> **Note on registration:** only Members can self-register through the public sign-up page. Trainer and Admin accounts are created by an existing Admin (not publicly self registered), since those roles have access to other users' data.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Java with Spring Boot |
| **Security** | Spring Security + JWT (stateless authentication, role-based access control) |
| **Database** | MySQL |
| **ORM** | Hibernate / JPA |
| **Version Control** | Git and GitHub |
| **Frontend Deployment** | Vercel |

---

## 📁 Project Structure

```
fittrack/
│
├── frontend/                        # React.js frontend
│   ├── public/
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── MemberLayout.jsx
│       │   └── DigitalPassModal.jsx
│       ├── pages/                   # All page screens
│       │   ├── LandingPage.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ExerciseLibrary.jsx
│       │   ├── ProfileSettings.jsx
│       │   ├── NotFound.jsx
│       │   ├── member/
│       │   │   ├── MemberHome.jsx
│       │   │   ├── Membership.jsx
│       │   │   ├── WorkoutPlan.jsx
│       │   │   ├── Progress.jsx
│       │   │   └── Notifications.jsx
│       │   ├── trainer/
│       │   │   ├── TrainerDashboard.jsx
│       │   │   ├── MyMembers.jsx
│       │   │   ├── AssignPlan.jsx
│       │   │   └── MonitorProgress.jsx
│       │   └── admin/
│       │       ├── AdminDashboard.jsx
│       │       ├── ManageMembers.jsx
│       │       ├── ManageTrainers.jsx
│       │       ├── PaymentTracking.jsx
│       │       └── Reports.jsx
│       ├── services/                # API call functions (api.js)
│       └── App.jsx
│
├── backend/                         # Java Spring Boot backend
│   └── src/main/java/com/fittrack/backend/
│       ├── model/                   # JPA entities
│       │   ├── User.java            # single entity for all roles, via a Role enum
│       │   ├── Trainer.java
│       │   ├── TrainerMember.java   # links a Trainer to their assigned Members
│       │   ├── Membership.java
│       │   ├── WorkoutPlan.java
│       │   ├── WorkoutDay.java
│       │   ├── Exercise.java
│       │   ├── ProgressLog.java
│       │   ├── Notification.java
│       │   ├── ActivityLog.java
│       │   └── AttendanceLog.java
│       ├── controller/              # REST API endpoints
│       │   ├── AuthController.java
│       │   ├── UserController.java
│       │   ├── MembershipController.java
│       │   ├── WorkoutController.java
│       │   ├── ExerciseController.java
│       │   ├── ProgressController.java
│       │   ├── NotificationController.java
│       │   ├── TrainerController.java
│       │   ├── AdminController.java
│       │   └── PublicController.java
│       ├── service/                 # Business logic layer
│       ├── repository/              # Spring Data JPA query layer
│       ├── security/                # JWT filter, JWT util, security config
│       ├── exception/                # Global exception handling
│       ├── config/                  # DataSeeder and app configuration
│       └── FitTrackApplication.java
│
└── README.md
```

> **Note:** roles (Member, Trainer, Admin) are modelled as a single `User` entity with a `Role` enum, rather than separate subclasses — this keeps authentication and shared account fields (email, password, profile) in one place, while `Trainer` is a separate linked entity only for trainer-specific data (specialization, assigned members).

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

## 🧭 Roadmap

- [ ] Real, scannable QR-code generation for the digital membership pass (currently a static visual placeholder)
- [ ] In-app chat between members and trainers
- [ ] Integration with a real payment gateway
- [ ] Deployment to a hosting provider

---
