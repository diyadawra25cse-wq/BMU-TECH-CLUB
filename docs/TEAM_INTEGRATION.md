# BMU Tech Club — Team Integration Guide

Welcome to the BMU Tech Club project repository! This guide establishes the architectural boundaries, installation steps, API contracts, and integration procedures for all team members (Vipul, Diya, Ojas, and Vanshika) so everyone can work productively without conflicting edits.

---

## 1. Team Responsibilities & Ownership Matrix

| Member | Primary Ownership | Files & Directories Owned | Must NOT Edit Without Coordination |
| :--- | :--- | :--- | :--- |
| **Vipul & Diya** | Backend Architecture, Authentication, MongoDB Models, Core APIs, Security | `backend/src/app.js`, `backend/src/server.js`, `backend/src/config/`, `backend/src/controllers/authController.js`, `backend/src/controllers/registrationController.js`, `backend/src/middleware/`, `backend/src/models/`, `backend/src/routes/authRoutes.js`, `backend/src/routes/registrationRoutes.js`, `backend/src/services/` | Teammate JSON files, frontend design templates |
| **Ojas** | JSON Data Implementation (Events & Team Member Datasets) | `backend/src/data/events.json`, `backend/src/data/team.json`, `backend/src/controllers/localDataController.js` (for extending JSON queries) | Authentication middleware, MongoDB models, registration routes |
| **Vanshika** | Frontend UI, Responsive Pages, My Registrations View | `my-registrations.html`, `profile.html`, `notifications.html`, frontend stylesheets (`style.css`, etc.), frontend UI event handlers | Backend core controllers, Mongoose schemas |

---

## 2. Project Directory Structure

```
BMU-TECH-CLUB-main/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection logic (Mongoose)
│   │   ├── controllers/
│   │   │   ├── authController.js     # User signup, login, session profile (Vipul/Diya)
│   │   │   ├── registrationController.js # Event registration CRUD (Vipul/Diya)
│   │   │   └── localDataController.js # Local JSON file reader/writer (Ojas coordination)
│   │   ├── data/
│   │   │   ├── events.json           # Local JSON events dataset (Owned by Ojas)
│   │   │   └── team.json             # Local JSON team dataset (To be created by Ojas)
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT Bearer token & Admin verification
│   │   ├── models/
│   │   │   ├── Registration.js       # MongoDB registration schema (Stored in Atlas)
│   │   │   └── User.js               # MongoDB user schema with roles (Stored in Atlas)
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Routes for /api/auth
│   │   │   ├── registrationRoutes.js # Routes for /api/registrations
│   │   │   ├── localDataRoutes.js    # Routes for /api/local-data
│   │   │   └── externalRoutes.js     # Routes for /api/external
│   │   ├── services/
│   │   │   └── externalApiService.js # External GitHub API integration
│   │   ├── app.js                    # Express app configuration & middleware
│   │   └── server.js                 # Server entry point & DNS SRV configuration
│   ├── .env                          # Local secrets (NEVER commit to Git)
│   ├── .env.example                  # Environment configuration template
│   └── package.json                  # Backend dependencies and startup scripts
├── docs/
│   └── TEAM_INTEGRATION.md           # This integration document
├── images/                           # Static image assets
├── .gitignore                        # Root Git exclusion rules
├── ai-talk-register.html             # AI Talk event registration page
├── auth-ui.js                        # Dynamic navbar session handler
├── coding-register.html              # Coding Challenge event registration page
├── index.html                        # Main homepage
├── notifications.js                  # Client notification handler
├── package.json                      # Root workspace scripts
├── register.html                     # Student signup page
├── script.js                         # Core frontend form & event handlers
├── signin.css                        # Signin stylesheet
├── signin.html                       # Student sign-in page
├── signin.js                         # Sign-in form handler
├── style.css                         # Primary stylesheet
└── web-development-register.html     # Web Dev Workshop registration page
```

---

## 3. Installation & Local Development Setup

### Prerequisites
- Node.js (v18.x or higher; tested on v24.x)
- VS Code with "Live Server" extension (or any local static file server)

### Step 1: Install Backend Dependencies
Open your terminal in the project directory:
```bash
# Navigate to backend and install packages
cd backend
npm install
```

### Step 2: Configure Environment Variables
Inside the `backend/` directory, create a `.env` file based on `.env.example`:
```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Mac/Linux:
cp .env.example .env
```
Open `backend/.env` and configure your credentials:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key_here
FRONTEND_URL=http://localhost:5500
```
> **Security Reminder:** The `.env` file is in `.gitignore`. Never commit or share your `.env` file or database credentials.

### Step 3: Start the Backend Server
From the `backend/` directory:
```bash
# Development mode (auto-restarts on code changes using nodemon):
npm run dev

# Or standard production mode:
npm start
```
You can verify the backend is running by opening `http://localhost:5000/api/health` in your browser. You should receive:
```json
{
  "success": true,
  "message": "BMU Tech Club Backend is running!"
}
```

### Step 4: Run the Frontend
1. Open the project root folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. Live Server typically starts at `http://127.0.0.1:5500` or `http://localhost:5500`.
4. The frontend JavaScript scripts automatically connect to `http://localhost:5000` (or `window.API_BASE_URL` if customized).

---

## 4. Complete Backend API Documentation

### Base URL: `http://localhost:5000`

---

### A. Authentication Endpoints (`/api/auth`)

#### 1. Student Signup
- **Method / Endpoint:** `POST /api/auth/register`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "fullName": "Diya Dawra",
    "enrollmentNumber": "23000101",
    "email": "diya@bmu.edu.in",
    "password": "securepassword123",
    "phoneNumber": "9899922923",
    "course": "CSE",
    "year": "2",
    "interest": "Web Development"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Student account created successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "id": "6735e89a...",
      "fullName": "Diya Dawra",
      "enrollmentNumber": "23000101",
      "email": "diya@bmu.edu.in",
      "phoneNumber": "9899922923",
      "course": "CSE",
      "year": "2",
      "interest": "Web Development",
      "role": "student"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "Please provide all required fields." }` or `{ "message": "Password must be at least 6 characters long." }`
  - `409 Conflict`: `{ "success": false, "message": "An account with this email or enrollment number already exists." }`

#### 2. Student / Admin Login
- **Method / Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body (JSON):**
  ```json
  {
    "email": "diya@bmu.edu.in",
    "password": "securepassword123"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Login successful!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
      "id": "6735e89a...",
      "fullName": "Diya Dawra",
      "enrollmentNumber": "23000101",
      "email": "diya@bmu.edu.in",
      "phoneNumber": "9899922923",
      "course": "CSE",
      "year": "2",
      "interest": "Web Development",
      "role": "student"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "Please provide email and password." }`
  - `401 Unauthorized`: `{ "success": false, "message": "Invalid email or password." }`

#### 3. Current User Profile
- **Method / Endpoint:** `GET /api/auth/me` (alias: `GET /api/auth/profile`)
- **Access:** Authenticated (Requires Header: `Authorization: Bearer <token>`)
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "id": "6735e89a...",
      "fullName": "Diya Dawra",
      "enrollmentNumber": "23000101",
      "email": "diya@bmu.edu.in",
      "phoneNumber": "9899922923",
      "course": "CSE",
      "year": "2",
      "interest": "Web Development",
      "role": "student"
    }
  }
  ```
- **Error Response:**
  - `401 Unauthorized`: `{ "success": false, "message": "Access denied. Please log in first." }`

---

### B. Event Registration Endpoints (`/api/registrations`)

#### 1. Retrieve Logged-In Student's Registrations ("My Registrations")
- **Method / Endpoint:** `GET /api/registrations/my`
- **Access:** Authenticated Student/Admin (`Authorization: Bearer <token>`)
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "6735f12b...",
        "userId": "6735e89a...",
        "fullName": "Diya Dawra",
        "enrollmentNumber": "23000101",
        "email": "diya@bmu.edu.in",
        "phoneNumber": "9899922923",
        "course": "CSE",
        "eventName": "ai-future-talk",
        "aiInterests": ["Generative AI", "Robotics and Automation"],
        "createdAt": "2026-09-14T11:20:00.000Z"
      }
    ]
  }
  ```

#### 2. Submit Event Registration
- **Method / Endpoint:** `POST /api/registrations`
- **Access:** Authenticated (`Authorization: Bearer <token>`)
- **Request Body (JSON):**
  ```json
  {
    "eventName": "ai-future-talk",
    "aiInterests": ["Generative AI"]
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Registration submitted successfully!",
    "data": { ... }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: `{ "success": false, "message": "Please specify a valid event name." }`
  - `401 Unauthorized`: `{ "success": false, "message": "Access denied. Please log in first." }`
  - `409 Conflict`: `{ "success": false, "message": "You have already registered for this event." }`

#### 3. Admin: Retrieve All University Registrations
- **Method / Endpoint:** `GET /api/registrations`
- **Access:** Admin Only (`Authorization: Bearer <admin_token>`)
- **Success Response (`200 OK`):** `{ "success": true, "count": N, "data": [...] }`
- **Error Response:** `403 Forbidden`: `{ "success": false, "message": "Access forbidden. Administrative privileges required." }`

#### 4. Admin: Retrieve Registration by ID
- **Method / Endpoint:** `GET /api/registrations/:id`
- **Access:** Admin Only (`Authorization: Bearer <admin_token>`)

#### 5. Admin: Update Registration (Whitelisted Fields)
- **Method / Endpoint:** `PUT /api/registrations/:id`
- **Access:** Admin Only (`Authorization: Bearer <admin_token>`)
- **Whitelisted Editable Fields:** `fullName`, `enrollmentNumber`, `email`, `phoneNumber`, `course`, `eventName`, `aiInterests`.

#### 6. Admin: Delete Registration
- **Method / Endpoint:** `DELETE /api/registrations/:id`
- **Access:** Admin Only (`Authorization: Bearer <admin_token>`)

---

### C. Local JSON Data Endpoints (`/api/local-data`) — Ojas's Domain

#### 1. Fetch All Local Events
- **Method / Endpoint:** `GET /api/local-data/events`
- **Access:** Public
- **Source File:** `backend/src/data/events.json`
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": "web-development-workshop",
        "title": "Web Development Workshop",
        "date": "2026-09-15",
        "displayDate": "15 September",
        "time": "2:00 PM - 5:00 PM",
        "venue": "NB 105",
        "description": "Learn the basics of HTML, CSS and responsive web design.",
        "category": "Workshop",
        "capacity": 60
      }
    ]
  }
  ```

#### 2. Fetch Single Event by ID
- **Method / Endpoint:** `GET /api/local-data/events/:id`
- **Access:** Public

#### 3. Save / Add New Event (Admin)
- **Method / Endpoint:** `POST /api/local-data/events`
- **Access:** Admin Only

#### 4. Fetch Club Team Members
- **Method / Endpoint:** `GET /api/local-data/team`
- **Access:** Public
- **Source File:** `backend/src/data/team.json`

---

### D. External API Endpoints (`/api/external`)

#### 1. Club Repository Live Telemetry
- **Method / Endpoint:** `GET /api/external/github-stats`
- **Access:** Public
- **Target External Service:** GitHub REST API v3
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "status": "online",
    "live": true,
    "source": "https://api.github.com",
    "data": {
      "repoName": "BMU-TECH-CLUB",
      "fullName": "diyadawra25cse-wq/BMU-TECH-CLUB",
      "stars": 0,
      "forks": 0,
      "openIssues": 0,
      "htmlUrl": "https://github.com/diyadawra25cse-wq/BMU-TECH-CLUB"
    }
  }
  ```
- **Fallback / Honest Offline Response (`200 OK`):**
  ```json
  {
    "success": false,
    "status": "unavailable",
    "live": false,
    "message": "External GitHub API is currently unreachable (network offline or restricted)."
  }
  ```

---

## 5. Detailed Instructions for Ojas

### Your Assigned Scope:
1. Maintain and extend the local JSON datasets:
   - Events data: `backend/src/data/events.json`
   - Team member data: `backend/src/data/team.json`
2. Connect or enhance any controllers reading local JSON:
   - `backend/src/controllers/localDataController.js`
   - `backend/src/routes/localDataRoutes.js`

### Guidelines & Rules:
- **Do not touch MongoDB event registrations:** Event registrations must remain in MongoDB Atlas via `Registration.js`. Do not export or redirect student registrations into JSON files.
- **`events.json` is initialized:** We created a starter `backend/src/data/events.json` with 3 core events so testing can proceed. You can edit, extend, or enrich this file (adding tags, speakers, images, etc.) without breaking the backend.
- **Create `backend/src/data/team.json`:** Create this file with the team structure:
  ```json
  [
    {
      "id": "diya-dawra",
      "name": "Diya Dawra",
      "role": "Club President",
      "image": "Diya.jpeg",
      "linkedin": "https://www.linkedin.com/in/diya-dawra-3ab91b3a7/"
    },
    {
      "id": "vipul-mittal",
      "name": "Vipul Mittal",
      "role": "Vice President",
      "image": "Vipul.jpeg"
    },
    {
      "id": "vanshika-gupta",
      "name": "Vanshika Gupta",
      "role": "Event Coordinator",
      "image": "Vanshika.jpeg"
    },
    {
      "id": "ojas-srivastava",
      "name": "Ojas Srivastava",
      "role": "Event Coordinator",
      "image": "Ojas.jpeg"
    }
  ]
  ```
  The endpoint `GET /api/local-data/team` is already implemented and will automatically serve this file as soon as you save it!

---

## 6. Detailed Instructions for Vanshika

### Your Assigned Scope:
1. Build and refine frontend user pages and UI views:
   - `my-registrations.html` (Linked from homepage profile menu)
   - Profile view (`profile.html`)
   - Notifications view (`notifications.html`)
2. Ensure responsive styling and clean UX across all mobile and desktop viewports.

### How to Connect to Backend APIs:

#### 1. Retrieving Stored User and Token
When a student logs in via `signin.html`, the token and user profile are saved to `localStorage`:
```javascript
const token = localStorage.getItem("authToken");
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
```

#### 2. Building `my-registrations.html`
Here is the exact fetch recipe to fetch and display the student's registrations:
```javascript
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    
    // Redirect if not signed in
    if (!token) {
        window.location.href = "signin.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/registrations/my", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("authToken");
            window.location.href = "signin.html";
            return;
        }

        const result = await response.json();
        
        if (result.success) {
            console.log("My registrations:", result.data);
            // Render result.data into your UI container
        }
    } catch (error) {
        console.error("Failed to load registrations:", error);
    }
});
```

#### 3. Client Notifications
- Notifications are currently handled via `notifications.js` using `localStorage` under `notifications_${userId}`.
- When an event registration succeeds in `script.js`, it triggers `window.addNotification(title, message)`.
- If you build `notifications.html`, read from `localStorage.getItem("notifications_" + userId)` to render the full notification history.

---

## 7. Git Workflow & Collaboration Rules

1. **Always Pull Before You Work:**
   ```bash
   git pull origin main
   ```
2. **Never Commit Secrets:**
   - Double-check that `.env` is never staged.
   - Run `git status` before committing.
3. **Keep Commits Clean and Focused:**
   - Write descriptive commit messages (e.g., `feat(json): add team.json dataset`, `feat(ui): add my-registrations page`).
4. **Coordinate Before Changing Shared Files:**
   - If you need changes to `app.js` or `script.js`, coordinate with Vipul or Diya to prevent merge conflicts.
