# OneFlow Frontend - Project Management System

A modern, responsive React frontend for the OneFlow Project Management System built with Vite, React Router, Tailwind CSS, and Framer Motion.

## Features

- **Role-Based Authentication** - JWT-based auth with 4 user roles
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean interface with Tailwind CSS
- **Smooth Animations** - Page transitions with Framer Motion
- **Toast Notifications** - Real-time feedback for user actions

## User Roles

- **Admin** - Full system access, manage users and projects
- **Project Manager** - Create projects, assign tasks, approve expenses
- **Team Member** - View tasks, log hours, submit expenses
- **Sales/Finance** - Manage sales orders, purchase orders, invoices, bills

## Tech Stack

- React 18
- Vite
- React Router v6
- Axios
- Tailwind CSS
- Framer Motion
- React Toastify
- Lucide React (icons)

## Installation

1. Install dependencies:
```bash
cd oneflow-frontend
npm install
```

2. Create `.env` file:
```bash
copy .env.example .env
```

3. Update `.env` with your backend API URL (default: http://localhost:5000/api)

4. Start development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # Axios configuration
├── components/       # Reusable components (Navbar, Sidebar)
├── context/          # Auth context for state management
├── layouts/          # Role-based layouts
├── pages/            # Page components
│   ├── Auth/         # Login, Signup
│   ├── Admin/        # Admin pages
│   ├── PM/           # Project Manager pages
│   ├── Team/         # Team Member pages
│   └── Finance/      # Finance pages
├── router/           # Route configuration
└── styles/           # Global styles
```

## API Integration

The frontend connects to the Node.js + Express + MySQL backend via REST APIs. All API calls are made through Axios with automatic JWT token injection.

## Default Credentials

After signup, users are assigned the `team_member` role by default. Admin can change roles through the Manage Users page.

## Features by Role

### Admin
- Dashboard with system stats
- Manage users (view, update roles, delete)
- View all projects
- System settings

### Project Manager
- Dashboard with project stats
- Create and manage projects
- Create and assign tasks
- View team timesheets
- Approve/reject expenses
- Analytics

### Team Member
- Dashboard with personal stats
- View assigned tasks
- Update task status
- Log work hours
- Submit expenses

### Sales/Finance
- Dashboard with billing stats
- Create sales orders
- Create purchase orders
- Generate invoices
- Manage vendor bills

## Color Theme

- Primary: `#2563eb` (Blue)
- Accent: `#10b981` (Green)
- Background: `#f9fafb` (Light Gray)
- Font: Inter

## License

ISC
