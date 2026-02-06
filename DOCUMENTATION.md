# Wiki Farm - Capstone Project Documentation

## CMIT295-01 Team 1

**Project Name:** Wiki Farm  
**Repository:** https://github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1  
**Live Demo:** https://wiki-farm-cmit295-01-team-1.onrender.com  
**Date:** February 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technologies Used](#2-technologies-used)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Step-by-Step Development Process](#5-step-by-step-development-process)
6. [File Structure & Code Organization](#6-file-structure--code-organization)
7. [Features Implemented](#7-features-implemented)
8. [Deployment Process](#8-deployment-process)
9. [Testing & Validation](#9-testing--validation)
10. [Challenges & Solutions](#10-challenges--solutions)
11. [Future Enhancements](#11-future-enhancements)
12. [Conclusion](#12-conclusion)

---

## 1. Project Overview

### 1.1 Problem Statement

Organizations and communities often need a simple way to create and manage multiple wikis for documentation, knowledge bases, and collaborative content. Existing solutions like MediaWiki are complex to set up and maintain for multiple instances.

### 1.2 Solution

Wiki Farm is a **multi-tenant wiki hosting platform** that allows users to create and manage multiple wikis from a single installation. It provides:

- Easy wiki creation without technical knowledge
- Markdown-based content editing
- User authentication and access control
- Revision history for all changes
- Admin dashboard for platform management

### 1.3 Target Users

- Small teams needing internal documentation
- Educational institutions
- Community organizations
- Individuals wanting personal knowledge bases

---

## 2. Technologies Used

### 2.1 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **SQL.js** | 1.10.2 | SQLite database (JavaScript implementation) |
| **bcryptjs** | 2.4.3 | Password hashing |
| **express-session** | 1.17.3 | Session management |
| **memorystore** | 1.6.7 | Session storage |

### 2.2 Frontend

| Technology | Purpose |
|------------|---------|
| **EJS** | Templating engine for dynamic HTML |
| **CSS3** | Styling and responsive design |
| **Marked** | Markdown to HTML conversion |
| **sanitize-html** | XSS protection for user content |

### 2.3 Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Integrated development environment |
| **GitHub Copilot** | AI-assisted development |
| **nodemon** | Auto-restart during development |
| **Git** | Version control |
| **GitHub** | Code repository hosting |
| **Render** | Cloud deployment platform |

---

## 3. System Architecture

### 3.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│                    (HTML, CSS, JavaScript)                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP Requests
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        EXPRESS.JS SERVER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Routes    │  │ Middleware  │  │      EJS Views          │  │
│  │  - auth.js  │  │  - auth.js  │  │  - home.ejs             │  │
│  │  - wiki.js  │  │  - session  │  │  - page/view.ejs        │  │
│  │  - pages.js │  │             │  │  - wiki/create.ejs      │  │
│  │  - admin.js │  │             │  │  - admin/dashboard.ejs  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Database Queries
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SQLite DATABASE                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │  users   │ │  wikis   │ │  pages   │ │  page_revisions   │   │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘   │
│                      ┌──────────────┐                           │
│                      │ wiki_members │                           │
│                      └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Request Flow

1. User makes HTTP request (e.g., view a wiki page)
2. Express router matches the URL pattern
3. Middleware checks authentication/authorization
4. Route handler queries the database
5. EJS template renders HTML with data
6. Response sent back to browser

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │    WIKIS    │       │    PAGES    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │──┐    │ id (PK)     │
│ username    │  │    │ slug        │  │    │ wiki_id(FK) │──┐
│ email       │  │    │ name        │  │    │ slug        │  │
│ password    │  └───▶│ owner_id(FK)│  └───▶│ title       │  │
│ is_admin    │       │ description │       │ content     │  │
│ created_at  │       │ is_public   │       │ created_by  │  │
└─────────────┘       │ allow_edit  │       │ updated_by  │  │
       │              │ created_at  │       │ created_at  │  │
       │              └─────────────┘       └─────────────┘  │
       │                     │                     │         │
       │              ┌──────┴──────┐              │         │
       │              ▼             │              ▼         │
       │      ┌─────────────┐       │      ┌───────────────┐ │
       │      │WIKI_MEMBERS │       │      │PAGE_REVISIONS │ │
       │      ├─────────────┤       │      ├───────────────┤ │
       └─────▶│ user_id(FK) │       │      │ id (PK)       │ │
              │ wiki_id(FK) │◀──────┘      │ page_id (FK)  │◀┘
              │ role        │              │ title         │
              │ created_at  │              │ content       │
              └─────────────┘              │ edited_by(FK) │
                                           │ edit_summary  │
                                           │ created_at    │
                                           └───────────────┘
```

### 4.2 Table Definitions

#### Users Table
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

#### Wikis Table
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

#### Pages Table
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

#### Page Revisions Table
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

#### Wiki Members Table
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

## 5. Step-by-Step Development Process

### Phase 1: Project Setup

#### Step 1.1: Create Project Directory
```bash
mkdir "Wiki Farm"
cd "Wiki Farm"
```

#### Step 1.2: Initialize Node.js Project
Created `package.json` with project configuration:
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
npm install express express-session ejs bcryptjs marked sanitize-html sql.js memorystore
npm install --save-dev nodemon
```

### Phase 2: Database Layer

#### Step 2.1: Create Database Connection (`src/db/database.js`)
- Implemented SQL.js for pure JavaScript SQLite
- Created wrapper class for synchronous-style API
- Added automatic database persistence to file

#### Step 2.2: Create Database Schema (`src/db/init.js`)
- Defined all table structures
- Created indexes for performance
- Implemented initialization function

### Phase 3: Authentication System

#### Step 3.1: Create Auth Middleware (`src/middleware/auth.js`)
- `requireAuth` - Ensures user is logged in
- `requireAdmin` - Ensures user has admin privileges
- `requireWikiAccess` - Checks wiki-specific permissions

#### Step 3.2: Create Auth Routes (`src/routes/auth.js`)
- `GET /auth/login` - Display login form
- `POST /auth/login` - Process login with bcrypt password verification
- `GET /auth/register` - Display registration form
- `POST /auth/register` - Create new user account
- `GET /auth/logout` - Destroy session and logout

### Phase 4: Wiki Management

#### Step 4.1: Create Wiki Routes (`src/routes/wiki.js`)
- `GET /w/create` - Wiki creation form
- `POST /w/create` - Create new wiki with default home page
- `GET /w/:slug` - Redirect to wiki home page
- `GET /w/:slug/settings` - Wiki settings (owner only)
- `POST /w/:slug/settings` - Update wiki settings
- `POST /w/:slug/members` - Add wiki members
- `GET /w/:slug/pages` - List all pages in wiki

### Phase 5: Page Management

#### Step 5.1: Create Page Routes (`src/routes/pages.js`)
- `GET /w/:wiki/:page` - View page with rendered Markdown
- `GET /w/:wiki/:page/edit` - Edit page form
- `POST /w/:wiki/:page/edit` - Save page (creates revision)
- `GET /w/:wiki/:page/history` - View revision history
- `GET /w/:wiki/:page/revision/:id` - View specific revision
- `POST /w/:wiki/:page/delete` - Delete page

#### Step 5.2: Implement Markdown Rendering
- Configured `marked` library for GitHub-flavored Markdown
- Added `sanitize-html` for XSS protection
- Implemented wiki-style link conversion

### Phase 6: Admin Dashboard

#### Step 6.1: Create Admin Routes (`src/routes/admin.js`)
- `GET /admin` - Dashboard with statistics
- `GET /admin/users` - User management
- `POST /admin/users/:id/toggle-admin` - Toggle admin status
- `POST /admin/users/:id/delete` - Delete user
- `GET /admin/wikis` - Wiki management
- `POST /admin/wikis/:id/delete` - Delete wiki

### Phase 7: Frontend Development

#### Step 7.1: Create Layout Templates
- `views/partials/header.ejs` - Common header with navigation
- `views/partials/footer.ejs` - Common footer

#### Step 7.2: Create Page Templates
| Template | Purpose |
|----------|---------|
| `home.ejs` | Landing page with public wiki list |
| `auth/login.ejs` | Login form |
| `auth/register.ejs` | Registration form |
| `wiki/create.ejs` | Create wiki form |
| `wiki/settings.ejs` | Wiki settings page |
| `wiki/pages.ejs` | List all pages in wiki |
| `page/view.ejs` | Display wiki page |
| `page/edit.ejs` | Edit page form |
| `page/history.ejs` | Revision history |
| `page/revision.ejs` | View old revision |
| `page/not-found.ejs` | Page not found (offer to create) |
| `admin/dashboard.ejs` | Admin statistics |
| `admin/users.ejs` | User management |
| `admin/wikis.ejs` | Wiki management |
| `error.ejs` | Error page |

#### Step 7.3: Create Stylesheet (`src/public/css/style.css`)
- CSS custom properties for theming
- Responsive grid layout
- Mobile-friendly navigation
- Card-based wiki display
- Form styling
- Markdown content styling

### Phase 8: Main Server Setup

#### Step 8.1: Create Express Server (`src/server.js`)
- Configure Express middleware
- Set up session management
- Register all routes
- Configure EJS view engine
- Error handling middleware
- Database initialization on startup

---

## 6. File Structure & Code Organization

```
Wiki Farm/
├── src/
│   ├── db/
│   │   ├── database.js        # Database connection & wrapper
│   │   └── init.js            # Schema initialization
│   │
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   │
│   ├── public/
│   │   └── css/
│   │       └── style.css      # Main stylesheet (500+ lines)
│   │
│   ├── routes/
│   │   ├── admin.js           # Admin dashboard routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── pages.js           # Wiki page CRUD routes
│   │   └── wiki.js            # Wiki management routes
│   │
│   ├── views/
│   │   ├── partials/
│   │   │   ├── header.ejs     # Common header
│   │   │   └── footer.ejs     # Common footer
│   │   ├── admin/
│   │   │   ├── dashboard.ejs  # Admin dashboard
│   │   │   ├── users.ejs      # User management
│   │   │   └── wikis.ejs      # Wiki management
│   │   ├── auth/
│   │   │   ├── login.ejs      # Login form
│   │   │   └── register.ejs   # Registration form
│   │   ├── page/
│   │   │   ├── edit.ejs       # Page editor
│   │   │   ├── history.ejs    # Revision history
│   │   │   ├── not-found.ejs  # 404 with create option
│   │   │   ├── revision.ejs   # View old revision
│   │   │   └── view.ejs       # Display page
│   │   ├── wiki/
│   │   │   ├── create.ejs     # Create wiki form
│   │   │   ├── pages.ejs      # List all pages
│   │   │   └── settings.ejs   # Wiki settings
│   │   ├── error.ejs          # Error page
│   │   └── home.ejs           # Landing page
│   │
│   └── server.js              # Main Express application
│
├── .gitignore                 # Git ignore rules
├── package.json               # Project configuration
├── Procfile                   # Deployment configuration
├── README.md                  # Project documentation
└── DOCUMENTATION.md           # This file
```

---

## 7. Features Implemented

### 7.1 User Authentication

| Feature | Description |
|---------|-------------|
| Registration | Create account with username, email, password |
| Login | Authenticate with username/email and password |
| Password Hashing | bcrypt with salt rounds for security |
| Session Management | Persistent sessions with memory store |
| Auto-Admin | First registered user becomes admin |

### 7.2 Wiki Management

| Feature | Description |
|---------|-------------|
| Create Wiki | Name, slug (URL), description |
| Public/Private | Toggle wiki visibility |
| Open Editing | Allow anyone to edit |
| Member Management | Add editors/viewers to wikis |
| Settings | Edit wiki properties |
| Delete Wiki | Remove wiki and all pages |

### 7.3 Page Management

| Feature | Description |
|---------|-------------|
| Create Page | Auto-create when visiting non-existent page |
| Edit Page | Markdown editor with preview |
| Revision History | Track all changes |
| View Revisions | See previous versions |
| Delete Page | Remove page (owner/admin only) |

### 7.4 Markdown Support

| Feature | Description |
|---------|-------------|
| Headers | H1-H6 support |
| Formatting | Bold, italic, strikethrough |
| Lists | Ordered and unordered |
| Code | Inline and code blocks |
| Links | External and wiki-internal |
| Images | Embedded images |
| Tables | GitHub-flavored tables |
| Blockquotes | Quote formatting |

### 7.5 Admin Dashboard

| Feature | Description |
|---------|-------------|
| Statistics | User, wiki, page, revision counts |
| User Management | View, promote, demote, delete users |
| Wiki Management | View and delete any wiki |
| Recent Activity | Recent wikis and users |

### 7.6 Security Features

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with 10 salt rounds |
| XSS Prevention | sanitize-html on all user content |
| Session Security | HTTP-only cookies |
| Access Control | Middleware-based authorization |
| SQL Injection | Parameterized queries |

---

## 8. Deployment Process

### 8.1 Prepare for Deployment

1. **Created Procfile** for Render:
   ```
   web: npm start
   ```

2. **Added Node.js version** to package.json:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. **Created .gitignore**:
   ```
   node_modules/
   *.sqlite
   .env
   .DS_Store
   ```

### 8.2 Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add -A

# Create initial commit
git commit -m "Initial commit - Wiki Farm"

# Add GitHub remote
git remote add origin https://github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1.git

# Push to GitHub
git push -u origin main
```

### 8.3 Deploy to Render

1. **Sign in** to https://render.com with GitHub

2. **Create new Web Service**:
   - Click "New" → "Web Service"
   - Select repository: `WIKI-FARM-CMIT295-01-Team-1`

3. **Configure service**:
   | Setting | Value |
   |---------|-------|
   | Name | wiki-farm-cmit295-01-team-1 |
   | Region | Oregon (US West) |
   | Branch | main |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

4. **Deploy**: Click "Create Web Service"

5. **Access**: App available at https://wiki-farm-cmit295-01-team-1.onrender.com

### 8.4 Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    GitHub       │────▶│    Render       │────▶│   Live App      │
│  Repository     │     │  Build & Deploy │     │   (Internet)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │ git push              │ Auto-deploy
        │                       │ on push
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Local Dev      │     │  Container      │
│  Environment    │     │  (Node.js 18)   │
└─────────────────┘     └─────────────────┘
```

---

## 9. Testing & Validation

### 9.1 Manual Testing Checklist

| Feature | Test Case | Status |
|---------|-----------|--------|
| Registration | Create new account | ✅ Pass |
| Registration | First user is admin | ✅ Pass |
| Registration | Duplicate username rejected | ✅ Pass |
| Login | Valid credentials | ✅ Pass |
| Login | Invalid password rejected | ✅ Pass |
| Create Wiki | With valid slug | ✅ Pass |
| Create Wiki | Duplicate slug rejected | ✅ Pass |
| View Wiki | Public wiki accessible | ✅ Pass |
| View Wiki | Private wiki requires login | ✅ Pass |
| Create Page | New page creation | ✅ Pass |
| Edit Page | Markdown rendering | ✅ Pass |
| Edit Page | Revision saved | ✅ Pass |
| History | View revision list | ✅ Pass |
| History | View old revision | ✅ Pass |
| Admin | Dashboard loads | ✅ Pass |
| Admin | User management works | ✅ Pass |
| Responsive | Mobile layout works | ✅ Pass |

### 9.2 Security Testing

| Test | Description | Status |
|------|-------------|--------|
| XSS | Script tags in content sanitized | ✅ Pass |
| Auth | Protected routes require login | ✅ Pass |
| Auth | Admin routes require admin | ✅ Pass |
| Session | Session persists across requests | ✅ Pass |

---

## 10. Challenges & Solutions

### Challenge 1: Native Database Compilation

**Problem:** The `better-sqlite3` package required native compilation which failed on the deployment environment.

**Solution:** Switched to `sql.js`, a pure JavaScript implementation of SQLite that works without compilation. Created a wrapper class to maintain API compatibility.

### Challenge 2: Session Storage

**Problem:** Initial session storage using `connect-sqlite3` had dependency on native SQLite.

**Solution:** Replaced with `memorystore`, which stores sessions in memory. Suitable for single-instance deployment.

### Challenge 3: Markdown Security

**Problem:** User-generated Markdown content could contain malicious scripts (XSS attacks).

**Solution:** Implemented `sanitize-html` to strip dangerous tags while preserving safe formatting. Configured allowlist for safe HTML elements.

### Challenge 4: Wiki Link Handling

**Problem:** Internal wiki links needed to work relative to the current wiki.

**Solution:** Created custom Markdown renderer that converts relative links to full wiki URLs, preserving the wiki context.

---

## 11. Future Enhancements

### 11.1 Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Search | High | Full-text search across pages |
| File Uploads | High | Image and file attachments |
| Export | Medium | Export wiki as PDF/HTML |
| Themes | Medium | Customizable wiki themes |
| API | Medium | REST API for integrations |
| Notifications | Low | Email notifications for changes |
| OAuth | Low | Login with Google/GitHub |

### 11.2 Technical Improvements

| Improvement | Description |
|-------------|-------------|
| PostgreSQL | Migrate to PostgreSQL for production |
| Redis Sessions | Use Redis for session storage |
| CDN | Serve static assets from CDN |
| Caching | Add page caching for performance |
| Testing | Add automated test suite |
| CI/CD | GitHub Actions for deployment |

---

## 12. Conclusion

### 12.1 Project Achievements

Wiki Farm successfully delivers a functional multi-tenant wiki platform with:

- ✅ Complete user authentication system
- ✅ Multi-wiki support with access control
- ✅ Markdown-based content editing
- ✅ Full revision history
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Cloud deployment

### 12.2 Skills Demonstrated

| Category | Skills |
|----------|--------|
| Backend | Node.js, Express.js, REST APIs, Session Management |
| Database | SQLite, Schema Design, SQL Queries, Foreign Keys |
| Frontend | HTML5, CSS3, EJS Templates, Responsive Design |
| Security | Password Hashing, XSS Prevention, Access Control |
| DevOps | Git, GitHub, Cloud Deployment, Environment Config |
| Documentation | Technical Writing, System Architecture, API Docs |

### 12.3 Team Contributions

This project was developed as part of CMIT295-01 capstone course, demonstrating proficiency in full-stack web development and modern deployment practices.

---

## Appendix A: API Reference

### Authentication Endpoints

```
POST /auth/register
Body: { username, email, password, confirmPassword }
Response: Redirect to / on success

POST /auth/login
Body: { username, password }
Response: Redirect to / on success

GET /auth/logout
Response: Redirect to /
```

### Wiki Endpoints

```
GET /w/create
Response: HTML form

POST /w/create
Body: { name, slug, description, is_public, allow_public_edit }
Response: Redirect to /w/:slug

GET /w/:slug
Response: Redirect to /w/:slug/home

GET /w/:slug/settings
Response: HTML settings page

POST /w/:slug/settings
Body: { name, description, is_public, allow_public_edit }
Response: HTML with success message
```

### Page Endpoints

```
GET /w/:wiki/:page
Response: HTML page view

GET /w/:wiki/:page/edit
Response: HTML edit form

POST /w/:wiki/:page/edit
Body: { title, content, edit_summary }
Response: Redirect to /w/:wiki/:page

GET /w/:wiki/:page/history
Response: HTML revision list

GET /w/:wiki/:page/revision/:id
Response: HTML revision view
```

---

## Appendix B: Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| SESSION_SECRET | wiki-farm-secret... | Session encryption key |
| NODE_ENV | development | Environment mode |

---

*Documentation created for CMIT295-01 Capstone Project*  
*Wiki Farm - Team 1*  
*February 2026*
