# CoreConnect HRMS

**CoreConnect HRMS** is a comprehensive Human Resource Management System designed to streamline HR operations and empower employees through a centralized, secure, and user-friendly platform. Built with a modern tech stack centered on **Next.js** and **Supabase**, it provides a robust solution for managing the entire employee lifecycle.

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access Control (RBAC)
- **Secure Authentication**: Integrated with Supabase Auth for reliable and secure user management.
- **Dynamic Dashboards**: Automated redirection based on user roles (Admin, HR, or Employee) ensures users only see what they need to.
- **Protected Routes**: Middleware-enforced security for all sensitive dashboard areas.

### 👤 Employee Self-Service Portal
- **Interactive Dashboard**: Quick access to clock-in/out tools, leave balances, and recent payslips.
- **Attendance Management**: Real-time clock-in/out functionality with history tracking.
- **Leave Requests**: Easy submission of leave applications with real-time status tracking.
- **Digital Payslips**: View and download monthly payslips directly from the portal.
- **Internal Helpdesk**: Raise support tickets for HR concerns and monitor resolution progress.

### 💼 HR Administration Suite
- **Employee Directory**: Centralized management of employee profiles, including hiring and information updates.
- **Leave Approval Workflow**: Review, approve, or reject employee leave requests with automated balance updates.
- **Payroll Processing**: Automated monthly payroll generation, tax deduction calculations (fixed 5%), and digital payslip issuance.
- **Announcements System**: Post and manage company-wide announcements to keep the workforce informed.
- **Helpdesk Management**: Review and resolve employee-submitted tickets to ensure a smooth workplace experience.

### 📊 Admin Overview
- **System Metrics**: High-level insights into workforce statistics and system activity to support data-driven decision-making.

---

## 🛠️ Project Architecture

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15+](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Authentication** | [Supabase Auth](https://supabase.com/auth) |
| **Styling** | Vanilla CSS with [CSS Modules](https://github.com/css-modules/css-modules) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📂 Directory Structure

```text
CoreConnectHRMS_V2/
├── coreconnect-hrms/          # Main Next.js application
│   ├── src/
│   │   ├── app/               # Next.js App Router (Pages & API)
│   │   │   ├── dashboard/     # Role-specific dashboards (Admin, HR, Employee)
│   │   │   ├── login/         # Authentication views
│   │   │   └── layout.tsx     # Root layout & providers
│   │   ├── components/        # Reusable UI components
│   │   └── utils/             # Supabase client & helper functions
│   └── public/                # Static assets (images, icons)
└── SRS_CoreConnect.pdf        # Software Requirements Specification document
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm, yarn, or pnpm
- A Supabase account and project

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CoreConnectHRMS_V2/coreconnect-hrms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the `coreconnect-hrms` directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Database Configuration**:
   The database schema (tables, RLS policies, functions) must be configured in your Supabase project. Key tables include `user_profiles`, `attendance_records`, `leave_requests`, `announcements`, `payslips`, and `help_desk_tickets`.

5. **Run the development server**:
   ```bash
   npm run dev
   ```