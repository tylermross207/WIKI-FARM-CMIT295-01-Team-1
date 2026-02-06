# Wiki Farm - Capstone Project Documentation

---

## Project Information

| Field | Details |
| ----- | ------- |
| **Course** | CMIT295-01 |
| **Team** | Team 1 |
| **Project Name** | Wiki Farm |
| **Repository** | [github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1](https://github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1) |
| **Live Application** | [wiki-farm-cmit295-01-team-1.onrender.com](https://wiki-farm-cmit295-01-team-1.onrender.com) |
| **Submission Date** | February 2026 |

---

## Table of Contents

| Section | Description |
| ------- | ----------- |
| [1. Executive Summary](#1-executive-summary) | High-level project overview |
| [2. Project Overview](#2-project-overview) | Problem statement and solution |
| [3. Technologies Used](#3-technologies-used) | Technical stack breakdown |
| [4. System Architecture](#4-system-architecture) | Architecture diagrams and data flow |
| [5. Database Design](#5-database-design) | Entity relationships and schemas |
| [6. Development Process](#6-development-process) | Step-by-step implementation |
| [7. Project Structure](#7-project-structure) | File organization |
| [8. Features Implemented](#8-features-implemented) | Complete feature list |
| [9. Deployment Process](#9-deployment-process) | Production deployment steps |
| [10. Testing & Validation](#10-testing--validation) | Quality assurance |
| [11. Challenges & Solutions](#11-challenges--solutions) | Problem-solving documentation |
| [12. Future Enhancements](#12-future-enhancements) | Roadmap for improvements |
| [13. Conclusion](#13-conclusion) | Summary and skills demonstrated |
| [Appendix A: API Reference](#appendix-a-api-reference) | Complete API documentation |
| [Appendix B: Environment Variables](#appendix-b-environment-variables) | Configuration reference |

---

## 1. Executive Summary

Wiki Farm is a **multi-tenant wiki hosting platform** developed as a capstone project for CMIT295-01. The application enables users to create, manage, and collaborate on multiple wikis from a single installation.

### Key Accomplishments

- ✅ Developed a full-stack web application using Node.js and Express.js
- ✅ Implemented secure user authentication with password hashing
- ✅ Created a multi-tenant architecture supporting unlimited wikis
- ✅ Built a Markdown-based content editor with revision history
- ✅ Designed and implemented a relational database schema
- ✅ Deployed the application to a production cloud environment
- ✅ Created comprehensive documentation for maintenance and extension

### Project Metrics

| Metric | Value |
| ------ | ----- |
| Total Lines of Code | ~2,500+ |
| Number of Files | 25+ |
| Database Tables | 5 |
| API Endpoints | 20+ |
| Development Time | 1 week |

---

## 2. Project Overview

### 2.1 Problem Statement

Organizations and communities often need a simple way to create and manage multiple wikis for documentation, knowledge bases, and collaborative content. Existing solutions like MediaWiki present several challenges:

- Complex installation and configuration requirements
- Difficult to manage multiple wiki instances
- Steep learning curve for non-technical users
- Resource-intensive for small-scale deployments

### 2.2 Proposed Solution

Wiki Farm addresses these challenges by providing:

| Challenge | Solution |
| --------- | -------- |
| Complex setup | One-click wiki creation with no technical knowledge required |
| Multiple instances | Multi-tenant architecture from a single installation |
| Learning curve | Intuitive interface with familiar Markdown editing |
| Resource usage | Lightweight SQLite database with minimal server requirements |

### 2.3 Target Users

| User Type | Use Case |
| --------- | -------- |
| Small Teams | Internal documentation and knowledge sharing |
| Educational Institutions | Course materials and collaborative learning |
| Community Organizations | Public information and member resources |
| Individuals | Personal knowledge bases and note-taking |

---

## 3. Technologies Used

### 3.1 Backend Technologies

| Technology | Version | Purpose |
| ---------- | ------- | ------- |
| Node.js | 18+ | JavaScript runtime environment |
| Express.js | 4.18.2 | Web application framework |
| SQL.js | 1.10.2 | SQLite database (JavaScript implementation) |
| bcryptjs | 2.4.3 | Secure password hashing |
| express-session | 1.17.3 | Session management |
| memorystore | 1.6.7 | Session storage |

### 3.2 Frontend Technologies

| Technology | Purpose |
| ---------- | ------- |
| EJS | Server-side templating engine |
| CSS3 | Styling and responsive design |
| Marked | Markdown to HTML conversion |
| sanitize-html | XSS protection for user content |

### 3.3 Development & Deployment Tools

| Tool | Purpose |
| ---- | ------- |
| Visual Studio Code | Integrated development environment |
| GitHub Copilot | AI-assisted development |
| nodemon | Development server with auto-restart |
| Git | Version control system |
| GitHub | Code repository hosting |
| Render | Cloud deployment platform |

---

## 4. System Architecture

### 4.1 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            CLIENT BROWSER                                 │
│                       (HTML, CSS, JavaScript)                            │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS Requests
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          EXPRESS.JS SERVER                                │
│                                                                          │
│   ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐    │
│   │     ROUTES       │   │   MIDDLEWARE     │   │    EJS VIEWS     │    │
│   │                  │   │                  │   │                  │    │
│   │  • auth.js       │   │  • auth.js       │   │  • home.ejs      │    │
│   │  • wiki.js       │   │  • session       │   │  • page/view.ejs │    │
│   │  • pages.js      │   │  • body-parser   │   │  • wiki/create   │    │
│   │  • admin.js      │   │  • static files  │   │  • admin/dash    │    │
│   └──────────────────┘   └──────────────────┘   └──────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          SQLite DATABASE                                  │
│                                                                          │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│   │   users    │  │   wikis    │  │   pages    │  │ page_revisions  │   │
│   └────────────┘  └────────────┘  └────────────┘  └─────────────────┘   │
│                           ┌────────────────┐                             │
│                           │  wiki_members  │                             │
│                           └────────────────┘                             │
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Request-Response Flow

The following diagram illustrates how a typical request flows through the application:

```
┌─────────┐    ┌─────────┐    ┌────────────┐    ┌──────────┐    ┌─────────┐
│ Browser │───▶│ Express │───▶│ Middleware │───▶│  Route   │───▶│ Database│
│         │    │ Server  │    │  (Auth)    │    │ Handler  │    │  Query  │
└─────────┘    └─────────┘    └────────────┘    └──────────┘    └─────────┘
     ▲                                                │               │
     │                                                ▼               │
     │         ┌─────────┐    ┌────────────┐    ┌──────────┐         │
     └─────────│  HTML   │◀───│    EJS     │◀───│   Data   │◀────────┘
               │Response │    │  Template  │    │  Object  │
               └─────────┘    └────────────┘    └──────────┘
```

### 4.3 Request Flow Description

| Step | Component | Action |
| ---- | --------- | ------ |
| 1 | Browser | User initiates HTTP request (e.g., view wiki page) |
| 2 | Express Server | Receives request and routes to appropriate handler |
| 3 | Middleware | Validates session and checks user permissions |
| 4 | Route Handler | Processes business logic and queries database |
| 5 | Database | Returns requested data |
| 6 | EJS Template | Renders HTML with dynamic data |
| 7 | Browser | Displays rendered page to user |

---

## 5. Database Design

### 5.1 Entity Relationship Diagram

```
┌─────────────────┐           ┌─────────────────┐           ┌─────────────────┐
│     USERS       │           │     WIKIS       │           │     PAGES       │
├─────────────────┤           ├─────────────────┤           ├─────────────────┤
│ id (PK)         │──────┐    │ id (PK)         │──────┐    │ id (PK)         │
│ username        │      │    │ slug            │      │    │ wiki_id (FK)    │───┐
│ email           │      │    │ name            │      │    │ slug            │   │
│ password_hash   │      └───▶│ owner_id (FK)   │      └───▶│ title           │   │
│ is_admin        │           │ description     │           │ content         │   │
│ created_at      │           │ is_public       │           │ created_by (FK) │   │
│ updated_at      │           │ allow_edit      │           │ updated_by (FK) │   │
└─────────────────┘           │ created_at      │           │ created_at      │   │
         │                    └─────────────────┘           │ updated_at      │   │
         │                            │                     └─────────────────┘   │
         │                            │                             │             │
         │                    ┌───────┴───────┐                     │             │
         │                    ▼               │                     ▼             │
         │           ┌─────────────────┐      │         ┌─────────────────────┐   │
         │           │  WIKI_MEMBERS   │      │         │   PAGE_REVISIONS    │   │
         │           ├─────────────────┤      │         ├─────────────────────┤   │
         └──────────▶│ user_id (FK)    │      │         │ id (PK)             │   │
                     │ wiki_id (FK)    │◀─────┘         │ page_id (FK)        │◀──┘
                     │ role            │                │ title               │
                     │ created_at      │                │ content             │
                     └─────────────────┘                │ edited_by (FK)      │
                                                        │ edit_summary        │
                                                        │ created_at          │
                                                        └─────────────────────┘
```

### 5.2 Table Definitions

#### 5.2.1 Users Table

Stores user account information and authentication credentials.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

| Column | Type | Description |
| ------ | ---- | ----------- |
| id | INTEGER | Primary key, auto-incremented |
| username | TEXT | Unique username for login |
| email | TEXT | Unique email address |
| password_hash | TEXT | bcrypt-hashed password |
| is_admin | INTEGER | Admin flag (0 or 1) |
| created_at | DATETIME | Account creation timestamp |
| updated_at | DATETIME | Last update timestamp |

#### 5.2.2 Wikis Table

Stores wiki metadata and configuration.

```sql
CREATE TABLE wikis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL,
    is_public INTEGER DEFAULT 1,
    allow_public_edit INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

| Column | Type | Description |
| ------ | ---- | ----------- |
| id | INTEGER | Primary key, auto-incremented |
| slug | TEXT | URL-friendly identifier |
| name | TEXT | Display name of wiki |
| description | TEXT | Optional description |
| owner_id | INTEGER | Foreign key to users table |
| is_public | INTEGER | Visibility flag (0 or 1) |
| allow_public_edit | INTEGER | Open editing flag (0 or 1) |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

#### 5.2.3 Pages Table

Stores wiki page content and metadata.

```sql
CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wiki_id INTEGER NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_by INTEGER NOT NULL,
    updated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wiki_id) REFERENCES wikis(id) ON DELETE CASCADE,
    UNIQUE(wiki_id, slug)
);
```

#### 5.2.4 Page Revisions Table

Stores historical versions of page content for revision tracking.

```sql
CREATE TABLE page_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    edited_by INTEGER NOT NULL,
    edit_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);
```

#### 5.2.5 Wiki Members Table

Manages user access and roles for private wikis.

```sql
CREATE TABLE wiki_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wiki_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role TEXT DEFAULT 'editor',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wiki_id) REFERENCES wikis(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(wiki_id, user_id)
);
```

---

## 6. Development Process

### Phase 1: Project Initialization

#### Step 1.1: Create Project Directory

```bash
mkdir "Wiki Farm"
cd "Wiki Farm"
```

#### Step 1.2: Initialize Node.js Project

Created `package.json` with the following configuration:

```json
{
  "name": "wiki-farm",
  "version": "1.0.0",
  "description": "A multi-tenant wiki hosting platform",
  "main": "src/server.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

#### Step 1.3: Install Dependencies

```bash
# Production dependencies
npm install express express-session ejs bcryptjs marked sanitize-html sql.js memorystore

# Development dependencies
npm install --save-dev nodemon
```

---

### Phase 2: Database Layer Implementation

#### Step 2.1: Database Connection Module

Created `src/db/database.js` with the following functionality:

- Implemented SQL.js for pure JavaScript SQLite support
- Created a wrapper class for synchronous-style API
- Added automatic database persistence to file system

#### Step 2.2: Schema Initialization

Created `src/db/init.js` with:

- All table creation statements
- Index creation for query optimization
- Initialization function for application startup

---

### Phase 3: Authentication System

#### Step 3.1: Authentication Middleware

Created `src/middleware/auth.js` with three middleware functions:

| Middleware | Purpose |
| ---------- | ------- |
| `requireAuth` | Ensures user is logged in before accessing route |
| `requireAdmin` | Ensures user has admin privileges |
| `requireWikiAccess` | Checks wiki-specific permissions |

#### Step 3.2: Authentication Routes

Created `src/routes/auth.js` with the following endpoints:

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /auth/login | Display login form |
| POST | /auth/login | Process login with bcrypt verification |
| GET | /auth/register | Display registration form |
| POST | /auth/register | Create new user account |
| GET | /auth/logout | Destroy session and logout |

---

### Phase 4: Wiki Management System

#### Step 4.1: Wiki Routes

Created `src/routes/wiki.js` with the following endpoints:

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /w/create | Display wiki creation form |
| POST | /w/create | Create new wiki with default home page |
| GET | /w/:slug | Redirect to wiki home page |
| GET | /w/:slug/settings | Display wiki settings (owner only) |
| POST | /w/:slug/settings | Update wiki configuration |
| POST | /w/:slug/members | Add members to wiki |
| GET | /w/:slug/pages | List all pages in wiki |

---

### Phase 5: Page Management System

#### Step 5.1: Page Routes

Created `src/routes/pages.js` with the following endpoints:

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /w/:wiki/:page | View page with rendered Markdown |
| GET | /w/:wiki/:page/edit | Display page editor |
| POST | /w/:wiki/:page/edit | Save page and create revision |
| GET | /w/:wiki/:page/history | View revision history |
| GET | /w/:wiki/:page/revision/:id | View specific revision |
| POST | /w/:wiki/:page/delete | Delete page |

#### Step 5.2: Markdown Rendering

Implemented secure Markdown rendering with:

- GitHub-flavored Markdown support via `marked` library
- XSS protection via `sanitize-html`
- Custom wiki-style link conversion

---

### Phase 6: Admin Dashboard

#### Step 6.1: Admin Routes

Created `src/routes/admin.js` with the following endpoints:

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /admin | Dashboard with statistics |
| GET | /admin/users | User management interface |
| POST | /admin/users/:id/toggle-admin | Toggle admin status |
| POST | /admin/users/:id/delete | Delete user account |
| GET | /admin/wikis | Wiki management interface |
| POST | /admin/wikis/:id/delete | Delete wiki |

---

### Phase 7: Frontend Development

#### Step 7.1: Layout Templates

Created reusable layout components:

| Template | Purpose |
| -------- | ------- |
| `partials/header.ejs` | Navigation bar and common header |
| `partials/footer.ejs` | Footer and closing tags |

#### Step 7.2: View Templates

Created the following view templates:

| Category | Templates |
| -------- | --------- |
| **Home** | `home.ejs` - Landing page with public wiki list |
| **Auth** | `login.ejs`, `register.ejs` - Authentication forms |
| **Wiki** | `create.ejs`, `settings.ejs`, `pages.ejs` - Wiki management |
| **Page** | `view.ejs`, `edit.ejs`, `history.ejs`, `revision.ejs`, `not-found.ejs` |
| **Admin** | `dashboard.ejs`, `users.ejs`, `wikis.ejs` - Admin interfaces |
| **Error** | `error.ejs` - Error display page |

#### Step 7.3: Stylesheet

Created `src/public/css/style.css` (500+ lines) with:

- CSS custom properties for consistent theming
- Responsive grid layout system
- Mobile-friendly navigation
- Card-based wiki display components
- Form styling and validation states
- Markdown content styling

---

### Phase 8: Server Configuration

#### Step 8.1: Express Server Setup

Created `src/server.js` with:

- Express middleware configuration
- Session management setup
- Route registration
- EJS view engine configuration
- Error handling middleware
- Database initialization on startup

---

## 7. Project Structure

```
Wiki Farm/
│
├── src/
│   │
│   ├── db/
│   │   ├── database.js            # Database connection and wrapper class
│   │   └── init.js                # Schema initialization and table creation
│   │
│   ├── middleware/
│   │   └── auth.js                # Authentication and authorization middleware
│   │
│   ├── public/
│   │   └── css/
│   │       └── style.css          # Main stylesheet (500+ lines)
│   │
│   ├── routes/
│   │   ├── admin.js               # Admin dashboard routes
│   │   ├── auth.js                # Authentication routes
│   │   ├── pages.js               # Wiki page CRUD routes
│   │   └── wiki.js                # Wiki management routes
│   │
│   ├── views/
│   │   │
│   │   ├── partials/
│   │   │   ├── header.ejs         # Common header with navigation
│   │   │   └── footer.ejs         # Common footer
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard.ejs      # Admin statistics dashboard
│   │   │   ├── users.ejs          # User management interface
│   │   │   └── wikis.ejs          # Wiki management interface
│   │   │
│   │   ├── auth/
│   │   │   ├── login.ejs          # Login form
│   │   │   └── register.ejs       # Registration form
│   │   │
│   │   ├── page/
│   │   │   ├── edit.ejs           # Markdown page editor
│   │   │   ├── history.ejs        # Revision history list
│   │   │   ├── not-found.ejs      # 404 with create option
│   │   │   ├── revision.ejs       # Historical revision view
│   │   │   └── view.ejs           # Page display with rendered Markdown
│   │   │
│   │   ├── wiki/
│   │   │   ├── create.ejs         # Wiki creation form
│   │   │   ├── pages.ejs          # Page listing
│   │   │   └── settings.ejs       # Wiki configuration
│   │   │
│   │   ├── error.ejs              # Error display page
│   │   └── home.ejs               # Landing page
│   │
│   └── server.js                  # Main Express application entry point
│
├── .gitignore                     # Git ignore rules
├── package.json                   # Project configuration and dependencies
├── package-lock.json              # Dependency lock file
├── Procfile                       # Render deployment configuration
├── README.md                      # Project overview and setup guide
└── DOCUMENTATION.md               # This comprehensive documentation
```

---

## 8. Features Implemented

### 8.1 User Authentication System

| Feature | Description | Implementation |
| ------- | ----------- | -------------- |
| User Registration | Create account with username, email, password | Form validation, duplicate checking |
| User Login | Authenticate with username/email and password | bcrypt password verification |
| Password Security | Secure password storage | bcrypt with 10 salt rounds |
| Session Management | Persistent user sessions | express-session with memorystore |
| Auto-Admin | First user becomes administrator | Automatic role assignment |
| Logout | Secure session termination | Session destruction |

### 8.2 Wiki Management System

| Feature | Description | Implementation |
| ------- | ----------- | -------------- |
| Create Wiki | New wiki with name, slug, description | Form with slug auto-generation |
| Public/Private | Control wiki visibility | Toggle in settings |
| Open Editing | Allow anyone to edit | Permission flag |
| Member Management | Add editors/viewers | Role-based access |
| Wiki Settings | Edit properties | Owner-only access |
| Delete Wiki | Remove wiki and pages | Cascade delete |

### 8.3 Page Management System

| Feature | Description | Implementation |
| ------- | ----------- | -------------- |
| Create Page | Auto-create on visit to non-existent page | Prompt with create option |
| Edit Page | Markdown editor | Textarea with syntax help |
| View Page | Rendered Markdown display | marked + sanitize-html |
| Revision History | Track all changes | Automatic revision creation |
| View Revisions | Browse previous versions | Historical content display |
| Delete Page | Remove page | Owner/admin only |

### 8.4 Markdown Support

| Feature | Syntax | Rendered Output |
| ------- | ------ | --------------- |
| Headers | `# H1` to `###### H6` | Hierarchical headings |
| Bold | `**text**` | **Bold text** |
| Italic | `*text*` | *Italic text* |
| Lists | `- item` or `1. item` | Bulleted/numbered lists |
| Code | `` `code` `` or code blocks | Monospace formatting |
| Links | `[text](url)` | Clickable hyperlinks |
| Images | `![alt](url)` | Embedded images |
| Tables | Pipe-delimited | Formatted tables |
| Blockquotes | `> quote` | Indented quotes |

### 8.5 Admin Dashboard

| Feature | Description |
| ------- | ----------- |
| Statistics | User, wiki, page, and revision counts |
| User Management | View, promote, demote, delete users |
| Wiki Management | View and delete any wiki |
| Recent Activity | Display recent wikis and users |

### 8.6 Security Features

| Feature | Implementation | Protection Against |
| ------- | -------------- | ------------------ |
| Password Hashing | bcrypt with 10 salt rounds | Password theft |
| XSS Prevention | sanitize-html on all content | Cross-site scripting |
| Session Security | HTTP-only cookies | Session hijacking |
| Access Control | Middleware-based authorization | Unauthorized access |
| SQL Injection | Parameterized queries | Database attacks |

---

## 9. Deployment Process

### 9.1 Pre-Deployment Preparation

#### Step 1: Create Procfile

Created `Procfile` for Render deployment:

```
web: npm start
```

#### Step 2: Configure Node.js Version

Added engine specification to `package.json`:

```json
"engines": {
  "node": ">=18.0.0"
}
```

#### Step 3: Create .gitignore

```
node_modules/
*.sqlite
.env
.DS_Store
```

---

### 9.2 GitHub Repository Setup

#### Step 1: Initialize Git Repository

```bash
git init
```

#### Step 2: Stage All Files

```bash
git add -A
```

#### Step 3: Create Initial Commit

```bash
git commit -m "Initial commit - Wiki Farm"
```

#### Step 4: Add Remote Repository

```bash
git remote add origin https://github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1.git
```

#### Step 5: Push to GitHub

```bash
git push -u origin main
```

---

### 9.3 Render Deployment

#### Step 1: Sign In to Render

Navigate to [render.com](https://render.com) and sign in with GitHub.

#### Step 2: Create New Web Service

Click "New" → "Web Service"

#### Step 3: Select Repository

Choose `WIKI-FARM-CMIT295-01-Team-1` from the repository list.

#### Step 4: Configure Service

| Setting | Value |
| ------- | ----- |
| Name | wiki-farm-cmit295-01-team-1 |
| Region | Oregon (US West) |
| Branch | main |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

#### Step 5: Deploy

Click "Create Web Service" and wait for build completion (2-3 minutes).

#### Step 6: Access Application

Application available at: [wiki-farm-cmit295-01-team-1.onrender.com](https://wiki-farm-cmit295-01-team-1.onrender.com)

---

### 9.4 Deployment Architecture

```
┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
│                   │         │                   │         │                   │
│  LOCAL MACHINE    │────────▶│     GITHUB        │────────▶│     RENDER        │
│                   │  push   │                   │  webhook │                   │
│  Development      │         │  Repository       │         │  Production       │
│  Environment      │         │  Storage          │         │  Hosting          │
│                   │         │                   │         │                   │
└───────────────────┘         └───────────────────┘         └───────────────────┘
                                                                     │
                                                                     │
                                                                     ▼
                                                            ┌───────────────────┐
                                                            │                   │
                                                            │    INTERNET       │
                                                            │                   │
                                                            │  Public Access    │
                                                            │  via HTTPS        │
                                                            │                   │
                                                            └───────────────────┘
```

---

## 10. Testing & Validation

### 10.1 Functional Testing

| Category | Test Case | Expected Result | Status |
| -------- | --------- | --------------- | ------ |
| **Registration** | Create new account | Account created, redirected to home | ✅ Pass |
| **Registration** | First user admin status | First user has admin privileges | ✅ Pass |
| **Registration** | Duplicate username | Error message displayed | ✅ Pass |
| **Registration** | Duplicate email | Error message displayed | ✅ Pass |
| **Login** | Valid credentials | Logged in, redirected to home | ✅ Pass |
| **Login** | Invalid password | Error message displayed | ✅ Pass |
| **Login** | Non-existent user | Error message displayed | ✅ Pass |
| **Wiki** | Create with valid slug | Wiki created, redirected | ✅ Pass |
| **Wiki** | Duplicate slug | Error message displayed | ✅ Pass |
| **Wiki** | View public wiki | Content displayed | ✅ Pass |
| **Wiki** | View private wiki (unauthorized) | Access denied | ✅ Pass |
| **Page** | Create new page | Page created successfully | ✅ Pass |
| **Page** | Edit existing page | Changes saved | ✅ Pass |
| **Page** | Markdown rendering | Content properly formatted | ✅ Pass |
| **Page** | Revision created on edit | History updated | ✅ Pass |
| **History** | View revision list | All revisions displayed | ✅ Pass |
| **History** | View old revision | Historical content shown | ✅ Pass |
| **Admin** | Dashboard access | Statistics displayed | ✅ Pass |
| **Admin** | User management | Can modify users | ✅ Pass |
| **Responsive** | Mobile layout | Proper mobile display | ✅ Pass |

### 10.2 Security Testing

| Test | Description | Expected Result | Status |
| ---- | ----------- | --------------- | ------ |
| XSS Prevention | Script tags in content | Tags sanitized/escaped | ✅ Pass |
| Auth Required | Access protected routes | Redirect to login | ✅ Pass |
| Admin Required | Access admin routes | Access denied for non-admins | ✅ Pass |
| Session Persistence | Navigate between pages | Session maintained | ✅ Pass |
| Password Storage | Check database | Passwords hashed | ✅ Pass |

### 10.3 Browser Compatibility

| Browser | Version | Status |
| ------- | ------- | ------ |
| Google Chrome | Latest | ✅ Pass |
| Mozilla Firefox | Latest | ✅ Pass |
| Safari | Latest | ✅ Pass |
| Microsoft Edge | Latest | ✅ Pass |

---

## 11. Challenges & Solutions

### Challenge 1: Native Database Compilation Failure

**Problem Description:**

The initial database choice, `better-sqlite3`, required native C++ compilation during installation. This failed on the Render deployment environment due to missing build tools.

**Error Encountered:**

```
npm error gyp ERR! configure error
npm error gyp ERR! stack Error: `gyp` failed with exit code: 1
```

**Solution Implemented:**

Replaced `better-sqlite3` with `sql.js`, a pure JavaScript implementation of SQLite that compiles SQLite to WebAssembly. Created a wrapper class to maintain API compatibility with the original code.

**Key Changes:**

- Switched from `better-sqlite3` to `sql.js` in `package.json`
- Rewrote `src/db/database.js` with async initialization
- Added file-based persistence for database state

---

### Challenge 2: Session Storage Dependency

**Problem Description:**

The initial session storage solution, `connect-sqlite3`, depended on native SQLite and failed alongside the database issue.

**Solution Implemented:**

Replaced with `memorystore`, which stores sessions in memory. This is suitable for single-instance deployments and eliminates native dependencies.

**Trade-offs:**

- Sessions are lost on server restart
- Not suitable for multi-instance deployments
- Adequate for demonstration and small-scale use

---

### Challenge 3: Markdown Security Vulnerabilities

**Problem Description:**

User-generated Markdown content could potentially contain malicious JavaScript code, leading to Cross-Site Scripting (XSS) attacks.

**Example Vulnerability:**

```markdown
<script>alert('XSS Attack!');</script>
```

**Solution Implemented:**

Integrated `sanitize-html` library to strip dangerous HTML tags while preserving safe Markdown formatting.

**Configuration:**

```javascript
sanitizeHtml(html, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', ...]),
  allowedAttributes: {
    a: ['href', 'class', 'target'],
    img: ['src', 'alt', 'title']
  }
});
```

---

### Challenge 4: Wiki-Relative Link Handling

**Problem Description:**

Internal wiki links in Markdown needed to resolve relative to the current wiki context, not the site root.

**Example:**

A link `[Home](home)` in wiki "my-wiki" should resolve to `/w/my-wiki/home`, not `/home`.

**Solution Implemented:**

Created a custom link transformation in the Markdown renderer that prepends the wiki path to relative URLs.

```javascript
const withLinks = html.replace(/href="([^"]+)"/g, (match, href) => {
  if (!href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
    return `href="/w/${wikiSlug}/${href}"`;
  }
  return match;
});
```

---

## 12. Future Enhancements

### 12.1 Planned Feature Additions

| Priority | Feature | Description | Complexity |
| -------- | ------- | ----------- | ---------- |
| High | Search | Full-text search across all pages | Medium |
| High | File Uploads | Image and document attachments | High |
| Medium | Export | Export wiki as PDF or static HTML | Medium |
| Medium | Themes | Customizable wiki appearance | Low |
| Medium | REST API | Programmatic access to wiki data | High |
| Low | Notifications | Email alerts for page changes | Medium |
| Low | OAuth | Login with Google/GitHub accounts | Medium |

### 12.2 Technical Improvements

| Category | Improvement | Benefit |
| -------- | ----------- | ------- |
| Database | Migrate to PostgreSQL | Better performance, scalability |
| Sessions | Implement Redis storage | Multi-instance support |
| Performance | Add page caching | Faster response times |
| CDN | Serve static assets externally | Reduced server load |
| Testing | Automated test suite | Quality assurance |
| CI/CD | GitHub Actions pipeline | Automated deployments |

### 12.3 User Experience Improvements

| Feature | Description |
| ------- | ----------- |
| Live Preview | Real-time Markdown preview while editing |
| Keyboard Shortcuts | Quick actions for common operations |
| Dark Mode | Alternative color scheme |
| Mobile App | Native mobile application |

---

## 13. Conclusion

### 13.1 Project Achievements

Wiki Farm successfully delivers a functional multi-tenant wiki platform that meets all project requirements:

| Requirement | Status | Evidence |
| ----------- | ------ | -------- |
| User Authentication | ✅ Complete | Login, registration, sessions |
| Multi-Wiki Support | ✅ Complete | Unlimited wikis per user |
| Content Editing | ✅ Complete | Markdown editor with preview |
| Revision History | ✅ Complete | Full version tracking |
| Access Control | ✅ Complete | Public/private, roles |
| Admin Dashboard | ✅ Complete | User and wiki management |
| Responsive Design | ✅ Complete | Mobile-friendly layout |
| Cloud Deployment | ✅ Complete | Live on Render |

### 13.2 Technical Skills Demonstrated

| Category | Skills Applied |
| -------- | -------------- |
| **Backend Development** | Node.js, Express.js, REST API design, middleware patterns, session management |
| **Database Design** | Relational schema design, SQL queries, foreign keys, indexes |
| **Frontend Development** | HTML5, CSS3, EJS templating, responsive design, form handling |
| **Security** | Password hashing, XSS prevention, access control, input validation |
| **DevOps** | Git version control, GitHub workflows, cloud deployment, environment configuration |
| **Documentation** | Technical writing, API documentation, architecture diagrams |

### 13.3 Learning Outcomes

Through this capstone project, the following learning outcomes were achieved:

1. **Full-Stack Development**: Gained hands-on experience building a complete web application from database to user interface.

2. **Software Architecture**: Applied MVC patterns and learned to organize code for maintainability.

3. **Security Best Practices**: Implemented authentication, authorization, and input sanitization.

4. **Cloud Deployment**: Successfully deployed an application to a production environment.

5. **Problem Solving**: Overcame technical challenges with native dependencies and security vulnerabilities.

6. **Documentation**: Created comprehensive documentation suitable for project handoff.

### 13.4 Acknowledgments

This project was completed as part of the CMIT295-01 capstone course requirements. Development was assisted by GitHub Copilot for code generation and debugging.

---

## Appendix A: API Reference

### A.1 Authentication Endpoints

#### POST /auth/register

Creates a new user account.

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response:** Redirect to `/` on success, re-render form with error on failure.

---

#### POST /auth/login

Authenticates a user.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** Redirect to `/` on success, re-render form with error on failure.

---

#### GET /auth/logout

Terminates the current session.

**Response:** Redirect to `/`

---

### A.2 Wiki Endpoints

#### GET /w/create

Displays wiki creation form.

**Authentication:** Required

---

#### POST /w/create

Creates a new wiki.

**Request Body:**

```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "is_public": "boolean",
  "allow_public_edit": "boolean"
}
```

**Response:** Redirect to `/w/:slug`

---

#### GET /w/:slug

Redirects to wiki home page.

**Response:** Redirect to `/w/:slug/home`

---

#### GET /w/:slug/settings

Displays wiki settings.

**Authentication:** Owner or Admin required

---

#### POST /w/:slug/settings

Updates wiki configuration.

**Authentication:** Owner or Admin required

---

### A.3 Page Endpoints

#### GET /w/:wiki/:page

Displays a wiki page.

**Response:** Rendered HTML page

---

#### GET /w/:wiki/:page/edit

Displays page editor.

**Authentication:** Required (unless open editing enabled)

---

#### POST /w/:wiki/:page/edit

Saves page content.

**Request Body:**

```json
{
  "title": "string",
  "content": "string",
  "edit_summary": "string"
}
```

**Response:** Redirect to `/w/:wiki/:page`

---

#### GET /w/:wiki/:page/history

Displays revision history.

**Response:** List of revisions

---

#### GET /w/:wiki/:page/revision/:id

Displays a specific revision.

**Response:** Rendered historical content

---

### A.4 Admin Endpoints

#### GET /admin

Displays admin dashboard.

**Authentication:** Admin required

---

#### GET /admin/users

Displays user management.

**Authentication:** Admin required

---

#### POST /admin/users/:id/toggle-admin

Toggles admin status.

**Authentication:** Admin required

---

#### GET /admin/wikis

Displays wiki management.

**Authentication:** Admin required

---

## Appendix B: Environment Variables

| Variable | Default Value | Description |
| -------- | ------------- | ----------- |
| `PORT` | 3000 | Server listening port |
| `SESSION_SECRET` | wiki-farm-secret... | Session encryption key (change in production) |
| `NODE_ENV` | development | Environment mode (development/production) |

### Production Recommendations

For production deployment, set the following:

```bash
SESSION_SECRET=<random-32-character-string>
NODE_ENV=production
```

Generate a secure session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Document Information

| Field | Value |
| ----- | ----- |
| Document Title | Wiki Farm - Capstone Project Documentation |
| Course | CMIT295-01 |
| Team | Team 1 |
| Version | 1.0 |
| Last Updated | February 2026 |
| Total Pages | ~40 |
| Word Count | ~4,500 |


 2026 CMIT295-01 Team 1. All rights reserved.*
