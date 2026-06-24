# Dental Clinic Management System

![Dental Clinic Login](https://raw.githubusercontent.com/abdelilah-wail/Dental-Clinic/main/client/public/Login_img.png)

<div align="center">

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql)](https://www.postgresql.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A comprehensive, enterprise-grade dental clinic management system with real-time appointment scheduling, patient records, digital dental charts, billing, insurance claims, and analytics.

[**Live Demo**](#) • [**Documentation**](#documentation) • [**Support**](mailto:support@dentalclinic.app)

</div>

---

## 📋 Overview

**Dental Clinic Management System** is a full-stack web application designed to streamline all aspects of dental practice management. From patient onboarding to treatment billing, this system provides an integrated platform for dentists, assistants, receptionists, and clinic administrators to work seamlessly together.

### Key Highlights

- **Multi-user Architecture**: Role-based access control with 6 distinct user roles
- **Real-time Data**: Instant updates across all connected clients
- **HIPAA-Ready**: Security-focused authentication and data protection
- **Multilingual Support**: Arabic, French, and English interfaces
- **Scalable Infrastructure**: Built for growing dental practices
- **Mobile-Responsive**: Works on desktop, tablet, and mobile devices

---

## ✨ Core Features

### 👥 Patient Management
- **Patient Profiles**: Comprehensive patient information including contact details, medical history, and emergency contacts
- **Wylaya & Commune Tracking**: Location-based patient organization specific to Algerian administrative divisions
- **Insurance Information**: Integrated insurance provider tracking
- **Patient Search & Filtering**: Rapid patient lookup with multiple filter options
- **Patient File Numbers**: Unique identification system for clinic records

### 📅 Appointment Management
- **Appointment Scheduling**: Drag-and-drop calendar interface for scheduling appointments
- **Dentist Assignment**: Link appointments to specific dental professionals
- **Duration Tracking**: Flexible appointment duration settings
- **Appointment Status**: Track status (scheduled, confirmed, completed, cancelled)
- **Reason & Notes**: Document appointment purpose and clinical notes
- **Appointment History**: View all historical appointments for patients

### 🦷 Dental Records & Charts
- **Digital Dental Chart**: Interactive 3D tooth diagram with condition tracking
- **Tooth Conditions**: Track condition types for each tooth (healthy, cavity, root canal, missing, etc.)
- **Visual Documentation**: Clear visual representation of patient dental status
- **Treatment History**: Link treatments to specific teeth on the chart
- **Condition Updates**: Real-time updates to tooth conditions

### 💼 Treatment Management
- **Treatment Planning**: Create and track treatment plans
- **Procedure Tracking**: Document procedures per tooth with status (planned, in-progress, completed)
- **Cost Estimation**: Calculate treatment costs for patient transparency
- **Treatment Notes**: Add clinical notes for each treatment
- **Treatment Status**: Monitor treatment progress and completion

### 💰 Billing & Payments
- **Invoice Generation**: Auto-generated invoices with invoice numbers
- **Payment Methods**: Support for cash, card, and digital payments
- **Payment Tracking**: Record and track all patient payments
- **Outstanding Balance**: Clear visibility of patient account balances
- **Invoice Status**: Draft, sent, paid, or overdue tracking
- **Financial Reports**: Monthly and quarterly revenue analysis

### 🏥 Insurance Claims
- **Claim Management**: Create and track insurance claims
- **Provider Integration**: Track multiple insurance providers
- **Reimbursement Tracking**: Monitor approved vs. pending reimbursements
- **Claim Status**: Draft, submitted, approved, rejected, or received states
- **Claim Documentation**: Attach notes and references to claims
- **Amount Tracking**: Monitor claimed vs. reimbursed amounts

### 📸 X-Ray Management
- **X-Ray Upload**: Store dental X-rays with Supabase cloud storage
- **Image Linking**: Associate X-rays with specific patients and dates
- **File Organization**: Categorize by type (panoramic, intraoral, digital, etc.)
- **Cloud Integration**: Secure cloud-based X-ray repository
- **Quick Access**: Fast retrieval of patient X-ray history

### 📦 Inventory Management
- **Stock Tracking**: Monitor dental supplies and equipment inventory
- **SKU Management**: Organize items by stock keeping unit
- **Reorder Alerts**: Automatic low-stock notifications
- **Supplier Tracking**: Maintain supplier information and contacts
- **Unit Costs**: Track cost per unit for financial analysis
- **Stock Adjustments**: Record inventory additions and adjustments
- **Category Organization**: Organize supplies by category for easy lookup

### 👨‍⚕️ Staff Management
- **Staff Directory**: Maintain complete staff member information
- **Role Assignment**: Assign specialized roles (dentist, assistant, admin)
- **Specialty Tracking**: Document dental specialties (orthodontics, implants, etc.)
- **Hire Date Records**: Track employment history
- **Staff Status**: Active, inactive, or on-leave status
- **Staff Colors**: Visual identification in scheduling

### 📊 Analytics & Reporting
- **Dashboard Overview**: Real-time clinic statistics and KPIs
- **Revenue Analytics**: Track revenue trends and patterns
- **Patient Metrics**: Monitor patient acquisition and retention
- **Appointment Analytics**: View appointment completion rates and volume
- **Treatment Reports**: Analyze treatment distribution and success rates
- **Financial Reports**: Monthly, quarterly revenue and expense reports
- **Appointment Timelines**: View upcoming appointments and schedules

### 🔒 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Fine-grained permission system
- **Password Hashing**: Bcrypt-based secure password storage
- **Token Refresh**: Automatic token refresh mechanism
- **Logout Functionality**: Secure session termination
- **Access Control Headers**: CORS protection and secure headers

### 🌐 Multi-Language Support
- **Arabic**: Full Arabic interface with right-to-left text direction
- **French**: Complete French localization
- **English**: Full English interface
- **Language Persistence**: Remember user language preference

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Tablet Support**: Full functionality on tablets
- **Desktop Optimization**: Enhanced experience on larger screens
- **Touch-Friendly**: Optimized touch interactions
- **Dark Mode Ready**: Theme system for future dark theme implementation

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AppRoutes (Role-Based Route Guards)                │  │
│  │  ├─ LoginPage (Public)                              │  │
│  │  ├─ Dashboard (Protected, All Roles)                │  │
│  │  ├─ Patients (patients.read permission)             │  │
│  │  ├─ Appointments (appointments.read)                │  │
│  │  ├─ Treatments (treatments.read)                    │  │
│  │  ├─ Dental Charts (charts.read)                     │  │
│  │  ├─ X-Rays (xray.read)                              │  │
│  │  ├─ Billing (billing.read)                          │  │
│  │  ├─ Insurance (insurance.read)                      │  │
│  │  ├─ Inventory (inventory.read)                      │  │
│  │  ├─ Staff (staff.read)                              │  │
│  │  └─ Reports (reports.read)                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management (Zustand)                          │  │
│  │  ├─ AuthStore (User, Tokens)                        │  │
│  │  └─ Persisted to LocalStorage                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Data Fetching (React Query)                        │  │
│  │  ├─ useAppointments, usePatients, etc.              │  │
│  │  └─ Automatic caching & synchronization             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │                      │
              │ HTTP/REST APIs       │ JWT Authorization
              │ Base: /api/*         │ Bearer Token
              ▼                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware Stack                                   │  │
│  │  ├─ CORS (Origin: http://localhost:5173)           │  │
│  │  ├─ JWT Authentication                              │  │
│  │  ├─ Role-Based Access Control (RBAC)               │  │
│  │  ├─ Error Handling                                  │  │
│  │  └─ Request Logging                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes (/api/*)                                │  │
│  │  ├─ /auth (Login, Refresh, Logout, Me)             │  │
│  │  ├─ /patients (CRUD + Search)                       │  │
│  │  ├─ /appointments (Schedule, Update, Cancel)        │  │
│  │  ├─ /charts (Dental Chart CRUD)                     │  │
│  │  ├─ /treatments (Treatment Management)              │  │
│  │  ├─ /invoices (Billing, Payments)                   │  │
│  │  ├─ /xrays (Image Storage, Retrieval)               │  │
│  │  ├─ /insurance (Claims Management)                  │  │
│  │  ├─ /inventory (Stock Management)                   │  │
│  │  ├─ /staff (Staff Directory)                        │  │
│  │  └─ /reports (Analytics, Reports)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              │
              │ SQL / Database Queries
              │ Connection Pool
              ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                          │
│                                                              │
│  Tables:                                                     │
│  ├─ users (Authentication)                                 │
│  ├─ staff (Clinic Staff)                                   │
│  ├─ patients (Patient Records)                             │
│  ├─ appointments (Scheduling)                              │
│  ├─ treatments (Treatment Records)                         │
│  ├─ invoices (Billing)                                     │
│  ├─ payments (Payment Records)                             │
│  ├─ dental_charts (Tooth Conditions)                       │
│  ├─ xrays (X-Ray References)                               │
│  ├─ insurance_claims (Insurance)                           │
│  └─ inventory_items (Stock)                                │
│                                                              │
│  + Indexes for performance optimization                      │
└─────────────────────────────────────────────────────────────┘
              │
              │ Cloud Storage (Supabase)
              ▼
┌─────────────────────────────────────────────────────────────┐
│           EXTERNAL SERVICES (Supabase Storage)              │
│                                                              │
│  ├─ X-Ray Image Bucket (Secure cloud storage)             │
│  └─ File uploads/retrieval with signed URLs               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```mermaid
graph TD
    A[User Browser] -->|Login Credentials| B[React App]
    B -->|POST /api/auth/login| C[Express Server]
    C -->|Query: Find User| D[PostgreSQL DB]
    D -->|User Record| C
    C -->|JWT Tokens| B
    B -->|Store in Zustand| E[Auth Store]
    E -->|Add to Header| F[API Requests]
    F -->|Authorization Bearer| C
    C -->|Check RBAC| G{Permissions Valid?}
    G -->|Yes| H[Execute Query]
    G -->|No| I[403 Forbidden]
    H -->|Query Results| C
    C -->|JSON Response| B
    B -->|React Query Cache| J[Query Client]
    J -->|Render UI| A
```

### Role-Based Access Control (RBAC)

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Owner** | All permissions (`*`) | Clinic owner with full system access |
| **Admin** | All permissions (`*`) | System administrator |
| **Dentist** | patients.*, appointments.*, treatments.*, charts.*, xray.*, inventory.read | Dental professionals |
| **Assistant** | patients.read, appointments.read, charts.read, xray.read, inventory.* | Dental assistants |
| **Receptionist** | patients.*, appointments.*, billing.read, insurance.read, inventory.read | Front desk staff |
| **Accountant** | billing.*, reports.read, insurance.* | Financial management |

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2 - UI framework with hooks
- **Vite** 8.0 - Lightning-fast build tool
- **Tailwind CSS** 3.4 - Utility-first CSS
- **React Router** 7.18 - Client-side routing with nested routes
- **React Query** 5.101 - Server state management and caching
- **Zustand** 5.0 - Lightweight state management
- **Framer Motion** 12.40 - Smooth animations
- **Lucide React** 1.21 - Beautiful icon library
- **Axios** 1.18 - HTTP client
- **i18next** 26.3 - Internationalization
- **React i18next** 17.0 - i18n React integration

### Backend
- **Node.js** 20+ - JavaScript runtime
- **Express** 4.19 - Web framework
- **PostgreSQL** 14+ - Relational database
- **pg** 8.12 - PostgreSQL client
- **JWT (jsonwebtoken)** 9.0 - Token authentication
- **Bcryptjs** 2.4 - Password hashing
- **Multer** 1.4 - File upload handling
- **CORS** 2.8 - Cross-Origin Resource Sharing
- **Dotenv** 16.4 - Environment variables
- **Supabase JS** 2.108 - Cloud storage integration

### Development Tools
- **Nodemon** 3.1 - Auto-restart server
- **ESLint** 10.3 - Code linting
- **PostCSS** 8.5 - CSS transformations
- **Autoprefixer** 10.5 - CSS vendor prefixes

---

## 📁 Project Structure

```
Dental-Clinic/
│
├── client/                          # React Frontend
│   ├── public/                      # Static assets
│   │   ├── Login_img.png           # Login page background
│   │   ├── xray_img.png            # X-ray page background
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx                # Entry point
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx       # Main route configuration
│   │   │   ├── ProtectedRoute.jsx  # Auth guard
│   │   │   └── RoleGuard.jsx       # RBAC guard
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx   # Main layout wrapper
│   │   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   │   └── Topbar.jsx      # Header with user menu
│   │   │   ├── ui/
│   │   │   │   ├── StatCard.jsx    # Dashboard stat card
│   │   │   │   └── ToothIcon.jsx   # Tooth visualization
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── features/               # Feature modules (domain-driven)
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── authApi.js
│   │   │   │   ├── authStore.js
│   │   │   │   ├── useAuth.js
│   │   │   │   └── roles.js
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── dashboardApi.js
│   │   │   │   └── useDashboard.js
│   │   │   │
│   │   │   ├── patients/
│   │   │   │   ├── PatientsPage.jsx
│   │   │   │   ├── PatientProfilePage.jsx
│   │   │   │   ├── patientsApi.js
│   │   │   │   └── usePatients.js
│   │   │   │
│   │   │   ├── appointments/
│   │   │   │   ├── AppointmentsPage.jsx
│   │   │   │   ├── appointmentsApi.js
│   │   │   │   ├── useAppointments.js
│   │   │   │   ├── appointmentMeta.js
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── dental-chart/
│   │   │   │   ├── DentalChartPage.jsx
│   │   │   │   ├── chartApi.js
│   │   │   │   ├── useDentalChart.js
│   │   │   │   ├── conditions.js
│   │   │   │   ├── toothData.js
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── treatments/
│   │   │   │   ├── TreatmentsPage.jsx
│   │   │   │   ├── treatmentsApi.js
│   │   │   │   └── useTreatments.js
│   │   │   │
│   │   │   ├── billing/
│   │   │   │   ├── BillingPage.jsx
│   │   │   │   ├── billingApi.js
│   │   │   │   ├── useBilling.js
│   │   │   │   ├── billingMeta.js
│   │   │   │   └── components/
│   │   │   │
│   │   │   ├── xray/
│   │   │   │   ├── XrayPage.jsx
│   │   │   │   ├── xrayApi.js
│   │   │   │   └── useXray.js
│   │   │   │
│   │   │   ├── insurance/
│   │   │   │   ├── InsurancePage.jsx
│   │   │   │   ├── InsuranceClaimModal.jsx
│   │   │   │   ├── insuranceApi.js
│   │   │   │   ├── insuranceMeta.js
│   │   │   │   └── useInsurance.js
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── InventoryPage.jsx
│   │   │   │   ├── InventoryItemModal.jsx
│   │   │   │   ├── StockAdjustModal.jsx
│   │   │   │   ├── inventoryApi.js
│   │   │   │   ├── inventoryMeta.js
│   │   │   │   └── useInventory.js
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── StaffPage.jsx
│   │   │   │   ├── staffApi.js
│   │   │   │   └── useStaff.js
│   │   │   │
│   │   │   └── reports/
│   │   │       ├── ReportsPage.jsx
│   │   │       ├── reportsApi.js
│   │   │       └── useReports.js
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js              # Axios instance with auth
│   │   │   ├── motion.js           # Framer Motion presets
│   │   │   └── queryClient.js      # React Query config
│   │   │
│   │   ├── providers/
│   │   │   ├── DirectionProvider.jsx  # RTL/LTR support
│   │   │   ├── ThemeProvider.jsx
│   │   │   └── ToastProvider.jsx
│   │   │
│   │   ├── i18n/
│   │   │   ├── index.js            # i18n configuration
│   │   │   └── locales/
│   │   │       ├── ar.json         # Arabic translations
│   │   │       ├── fr.json         # French translations
│   │   │       └── en.json         # English translations
│   │   │
│   │   └── styles/
│   │       ├── globals.css         # Global styles
│   │       └── tokens.css          # Design tokens
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── server.js               # Server entry point
│   │   │
│   │   ├── config/
│   │   │   ├── db.js               # PostgreSQL connection
│   │   │   └── env.js              # Environment variables
│   │   │
│   │   ├── lib/
│   │   │   ├── jwt.js              # JWT utilities
│   │   │   ├── roles.js            # RBAC definitions
│   │   │   └── storage.js          # Supabase storage
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT authentication
│   │   │   ├── rbac.js             # Permission checks
│   │   │   ├── errorHandler.js     # Error handling
│   │   │   └── asyncHandler.js     # Async/await wrapper
│   │   │
│   │   ├── modules/                # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── auth.service.js
│   │   │   │
│   │   │   ├── patients/
│   │   │   │   ├── patients.controller.js
│   │   │   │   ├── patients.routes.js
│   │   │   │   └── patients.service.js
│   │   │   │
│   │   │   ├── appointments/
│   │   │   │   ├── appointments.controller.js
│   │   │   │   ├── appointments.routes.js
│   │   │   │   └── appointments.service.js
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── charts.controller.js
│   │   │   │   ├── charts.routes.js
│   │   │   │   └── charts.service.js
│   │   │   │
│   │   │   ├── treatments/
│   │   │   │   ├── treatments.controller.js
│   │   │   │   ├── treatments.routes.js
│   │   │   │   └── treatments.service.js
│   │   │   │
│   │   │   ├── billing/
│   │   │   │   ├── billing.controller.js
│   │   │   │   ├── billing.routes.js
│   │   │   │   └── billing.service.js
│   │   │   │
│   │   │   ├── xrays/
│   │   │   │   ├── xrays.controller.js
│   │   │   │   ├── xrays.routes.js
│   │   │   │   └── xrays.service.js
│   │   │   │
│   │   │   ├── insurance/
│   │   │   │   ├── insurance.controller.js
│   │   │   │   ├── insurance.routes.js
│   │   │   │   └── insurance.service.js
│   │   │   │
│   │   │   ├── inventory/
│   │   │   │   ├── inventory.controller.js
│   │   │   │   ├── inventory.routes.js
│   │   │   │   └── inventory.service.js
│   │   │   │
│   │   │   ├── staff/
│   │   │   │   ├── staff.controller.js
│   │   │   │   ├── staff.routes.js
│   │   │   │   └── staff.service.js
│   │   │   │
│   │   │   └── reports/
│   │   │       ├── reports.controller.js
│   │   │       ├── reports.routes.js
│   │   │       └── reports.service.js
│   │   │
│   │   └── routes/
│   │       └── index.js            # Main API router
│   │
│   ├── migrations/
│   │   ├── 001_init.sql            # Initial schema
│   │   ├── 002_add_patient_fields.sql  # Patient fields
│   │   └── run.js                  # Migration runner
│   │
│   ├── seeds/
│   │   ├── data.js                 # Seed data
│   │   └── run.js                  # Seed runner
│   │
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ and **npm** or **yarn**
- **PostgreSQL** 14+ (local or cloud instance)
- **Supabase Account** (for X-ray image storage)
- **Git**

### Step 1: Clone Repository

```bash
git clone https://github.com/abdelilah-wail/Dental-Clinic.git
cd Dental-Clinic
```

### Step 2: Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/dental_clinic
PGSSL=false

# JWT Secrets (use strong random strings in production)
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Bcrypt
BCRYPT_ROUNDS=10

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_BUCKET=xrays
```

### Step 3: Database Setup

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed

# Start server
npm run dev
```

### Step 4: Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 5: Create Initial User

Use the seed script or create a user via the API:

```bash
# Default credentials (from seeds)
Email: admin@clinic.local
Password: password123
Role: admin
```

---

## 🔧 Environment Variables

### Server Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PGSSL` | Use SSL for PostgreSQL | `false` or `true` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | Generate with `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Generate with `openssl rand -hex 32` |
| `JWT_ACCESS_EXPIRES` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES` | Refresh token expiry | `7d` |
| `BCRYPT_ROUNDS` | Password hash rounds | `10` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | `eyJ0...` |
| `SUPABASE_BUCKET` | Storage bucket name | `xrays` |

### Client Variables

Client uses `.env` for API configuration (defined in `vite.config.js`):

```javascript
// Proxy configuration
"/api": {
  target: "http://localhost:4000",
  changeOrigin: true
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Header
```
Authorization: Bearer <accessToken>
```

### Core Endpoints

#### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login` | Login user | ❌ |
| `POST` | `/auth/refresh` | Refresh access token | ❌ |
| `POST` | `/auth/logout` | Logout user | ✅ |
| `GET` | `/auth/me` | Get current user | ✅ |

#### Patients

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/patients` | List patients | `patients.read` |
| `GET` | `/patients/:id` | Get patient details | `patients.read` |
| `POST` | `/patients` | Create patient | `patients.write` |
| `PUT` | `/patients/:id` | Update patient | `patients.write` |
| `DELETE` | `/patients/:id` | Delete patient | `patients.write` |

#### Appointments

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/appointments` | List appointments | `appointments.read` |
| `GET` | `/appointments/:id` | Get appointment | `appointments.read` |
| `POST` | `/appointments` | Create appointment | `appointments.write` |
| `PUT` | `/appointments/:id` | Update appointment | `appointments.write` |
| `DELETE` | `/appointments/:id` | Delete appointment | `appointments.write` |

#### Treatments

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/treatments` | List treatments | `treatments.read` |
| `GET` | `/treatments/:id` | Get treatment | `treatments.read` |
| `POST` | `/treatments` | Create treatment | `treatments.write` |
| `PUT` | `/treatments/:id` | Update treatment | `treatments.write` |
| `DELETE` | `/treatments/:id` | Delete treatment | `treatments.write` |

#### Dental Charts

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/charts/:patientId` | Get patient chart | `charts.read` |
| `PUT` | `/charts/:patientId` | Update chart | `charts.write` |

#### Billing & Invoices

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/invoices` | List invoices | `billing.read` |
| `GET` | `/invoices/:id` | Get invoice | `billing.read` |
| `POST` | `/invoices` | Create invoice | `billing.write` |
| `PUT` | `/invoices/:id` | Update invoice | `billing.write` |
| `DELETE` | `/invoices/:id` | Delete invoice | `billing.write` |
| `POST` | `/invoices/:id/payments` | Record payment | `billing.write` |
| `DELETE` | `/invoices/:id/payments/:paymentId` | Delete payment | `billing.write` |

#### X-Rays

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/xrays` | List X-rays | `xray.read` |
| `GET` | `/xrays/:id` | Get X-ray | `xray.read` |
| `POST` | `/xrays` | Upload X-ray | `xray.write` |
| `DELETE` | `/xrays/:id` | Delete X-ray | `xray.write` |

#### Insurance Claims

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/insurance` | List claims | `insurance.read` |
| `GET` | `/insurance/:id` | Get claim | `insurance.read` |
| `POST` | `/insurance` | Create claim | `insurance.write` |
| `PUT` | `/insurance/:id` | Update claim | `insurance.write` |
| `DELETE` | `/insurance/:id` | Delete claim | `insurance.write` |

#### Inventory

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/inventory` | List items | `inventory.read` |
| `GET` | `/inventory/:id` | Get item | `inventory.read` |
| `POST` | `/inventory` | Create item | `inventory.write` |
| `PUT` | `/inventory/:id` | Update item | `inventory.write` |
| `DELETE` | `/inventory/:id` | Delete item | `inventory.write` |

#### Staff

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/staff` | List staff | `staff.read` |
| `GET` | `/staff/:id` | Get staff member | `staff.read` |
| `POST` | `/staff` | Create staff | `staff.write` |
| `PUT` | `/staff/:id` | Update staff | `staff.write` |
| `DELETE` | `/staff/:id` | Delete staff | `staff.write` |

#### Reports

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|-----------|
| `GET` | `/reports/dashboard` | Dashboard statistics | `reports.read` |
| `GET` | `/reports/revenue` | Revenue analytics | `reports.read` |
| `GET` | `/reports/appointments` | Appointment analytics | `reports.read` |

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id                BIGINT PRIMARY KEY,
  email             TEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  full_name         TEXT NOT NULL,
  role              TEXT NOT NULL DEFAULT 'receptionist',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Patients Table
```sql
CREATE TABLE patients (
  id                BIGINT PRIMARY KEY,
  file_number       TEXT UNIQUE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  phone             TEXT,
  nin               TEXT,
  date_of_birth     DATE,
  gender            TEXT,
  email             TEXT,
  address           TEXT,
  blood_type        TEXT,
  wilaya            TEXT,
  commune           TEXT,
  insurance         TEXT,
  emergency_contact TEXT,
  medical_history   JSONB NOT NULL DEFAULT '{}',
  status            TEXT NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id                BIGINT PRIMARY KEY,
  patient_id        BIGINT NOT NULL,
  dentist_id        BIGINT,
  date              DATE NOT NULL,
  time              TEXT,
  duration          INTEGER,
  status            TEXT NOT NULL DEFAULT 'scheduled',
  reason            TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Treatments Table
```sql
CREATE TABLE treatments (
  id                BIGINT PRIMARY KEY,
  patient_id        BIGINT NOT NULL,
  procedure         TEXT,
  tooth             TEXT,
  status            TEXT NOT NULL DEFAULT 'planned',
  cost              NUMERIC(12,2),
  date              DATE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Invoices Table
```sql
CREATE TABLE invoices (
  id                BIGINT PRIMARY KEY,
  invoice_number    TEXT UNIQUE,
  patient_id        BIGINT NOT NULL,
  date              DATE NOT NULL,
  total             NUMERIC(12,2),
  status            TEXT NOT NULL DEFAULT 'unpaid',
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id                BIGINT PRIMARY KEY,
  invoice_id        BIGINT NOT NULL,
  amount            NUMERIC(12,2),
  method            TEXT NOT NULL DEFAULT 'cash',
  date              DATE NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### X-Rays Table
```sql
CREATE TABLE xrays (
  id                BIGINT PRIMARY KEY,
  patient_id        BIGINT NOT NULL,
  type              TEXT,
  image_url         TEXT,
  file_path         TEXT,
  notes             TEXT,
  date              DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Insurance Claims Table
```sql
CREATE TABLE insurance_claims (
  id                BIGINT PRIMARY KEY,
  claim_number      TEXT UNIQUE,
  patient_id        BIGINT NOT NULL,
  provider          TEXT,
  amount            NUMERIC(12,2),
  amount_reimbursed NUMERIC(12,2),
  status            TEXT NOT NULL DEFAULT 'draft',
  notes             TEXT,
  date              DATE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Inventory Items Table
```sql
CREATE TABLE inventory_items (
  id                BIGINT PRIMARY KEY,
  name              TEXT NOT NULL,
  sku               TEXT UNIQUE,
  category          TEXT,
  quantity          INTEGER NOT NULL,
  reorder_level     INTEGER NOT NULL,
  unit              TEXT NOT NULL,
  supplier          TEXT,
  unit_cost         NUMERIC(12,2),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## 🔐 Security

### Authentication
- **JWT-based Authentication**: Secure token generation and validation
- **Access & Refresh Tokens**: Separated token types for security
- **Token Expiration**: Automatic expiry with refresh capability
- **Bearer Token Scheme**: Standard HTTP Authorization header

### Authorization
- **Role-Based Access Control (RBAC)**: Fine-grained permission system
- **Permission Wildcards**: Flexible permission matching
- **Route Guards**: Protected routes with permission checks
- **Middleware Enforcement**: Server-side permission validation

### Data Protection
- **Password Hashing**: Bcryptjs with configurable salt rounds
- **CORS Protection**: Whitelist allowed origins
- **SQL Injection Prevention**: Parameterized queries via pg library
- **XSS Protection**: React's built-in escaping

### Best Practices
- Use strong JWT secrets (minimum 32 characters)
- Store tokens in HttpOnly cookies (recommended for production)
- Implement rate limiting on auth endpoints
- Use HTTPS in production
- Keep dependencies updated
- Regular security audits

---

## 🚢 Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:password@prod-host:5432/dental_clinic
JWT_ACCESS_SECRET=<use strong secret>
JWT_REFRESH_SECRET=<use strong secret>
SUPABASE_URL=<your supabase url>
SUPABASE_SERVICE_KEY=<service key>
```

### Railway Deployment

1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Configure build command: `npm install`
4. Configure start command: `npm start`
5. Deploy

### Vercel (Frontend Only)

1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables
5. Deploy

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

### VPS Deployment

1. SSH into your VPS
2. Install Node.js and PostgreSQL
3. Clone repository
4. Install dependencies
5. Configure `.env`
6. Run migrations
7. Start with PM2 or systemd

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅
- [x] Multi-user RBAC system
- [x] Patient management
- [x] Appointment scheduling
- [x] Digital dental charts
- [x] Treatment tracking
- [x] Billing system
- [x] Inventory management

### Phase 2: Enhancement (In Progress)
- [ ] Appointment reminders (SMS/Email)
- [ ] Advanced reporting dashboard
- [ ] Patient portal for appointments
- [ ] Insurance pre-authorization automation
- [ ] Digital prescriptions
- [ ] Staff scheduling optimization

### Phase 3: Intelligence
- [ ] AI-powered treatment recommendations
- [ ] Predictive analytics for revenue
- [ ] Automated patient segmentation
- [ ] Intelligent inventory forecasting
- [ ] Computer-aided diagnosis (CAD)

### Phase 4: Integration
- [ ] Integration with payment gateways
- [ ] EHR system integration
- [ ] DICOM image viewer for X-rays
- [ ] EDI for insurance claims
- [ ] Accounting software integration

### Phase 5: Mobile
- [ ] React Native mobile app
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Staff mobile portal

---

## 📊 Dashboard Overview

The dashboard provides real-time insights into clinic operations:

- **Revenue Statistics**: Total revenue, pending payments, collections
- **Patient Metrics**: Total patients, new patients this month, active patients
- **Appointment Analytics**: Scheduled appointments, completion rate, no-shows
- **Treatment Overview**: Pending treatments, completed treatments, upcoming procedures
- **Staff Performance**: Staff availability, appointment distribution
- **Inventory Status**: Low stock alerts, reorder requirements
- **Financial Summary**: Monthly income, expense trends, cash flow

---

## 🌐 Multi-Language Support

The system supports:
- **Arabic** (العربية) - Full RTL support
- **French** (Français) - European French
- **English** - American English

Language preference is persisted in localStorage and can be changed from the user menu.

---

## 🐛 Troubleshooting

### Common Issues

**Connection refused on port 4000**
```bash
# Check if port is in use
lsof -i :4000
# Kill process if needed
kill -9 <PID>
```

**Database connection failed**
```bash
# Verify PostgreSQL is running
sudo service postgresql status
# Check connection string in .env
```

**CORS errors**
```bash
# Ensure CORS_ORIGIN in .env matches your frontend URL
CORS_ORIGIN=http://localhost:5173
```

**Authentication fails**
```bash
# Clear browser localStorage
localStorage.clear()
# Restart browser and try again
```

---

## 📞 Support

For questions or issues:

- 📧 Email: nedjar.abdelilah.wail@gmail.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/abdelilah-wail/Dental-Clinic/issues)
- 📚 Documentation: [Full docs](./docs/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

### Technologies
- React team for the excellent UI framework
- Express.js community for the robust web server
- PostgreSQL for reliable data storage
- Supabase for cloud storage and authentication
- Tailwind CSS for modern styling
- Framer Motion for animations

### Contributors
- Lead Developer: [Your Name]
- UI/UX Design: [Designer Name]
- Quality Assurance: [QA Team]

### Acknowledgments
Special thanks to the dental professionals who provided feedback and requirements for this system.

---

<div align="center">

**Made with ❤️ for Dental Professionals**

[⬆ back to top](#-dental-clinic-management-system)

</div>
