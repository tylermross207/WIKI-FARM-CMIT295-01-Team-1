# Wiki Farm 🌱

A multi-tenant wiki hosting platform built with Node.js. Create and manage multiple wikis from a single installation.

## 🌐 Live Demo

**[View Live App on Render](https://wiki-farm-cmit295-01-team-1.onrender.com)**

## ✨ Features

### Core Features

- **Multi-tenant Architecture**: Host multiple wikis from one instance
- **User Authentication**: Secure login/registration system
- **Markdown Support**: Write pages using Markdown with live rendering
- **Revision History**: Track all changes with full version history
- **Access Control**: Public/private wikis with member management
- **Admin Dashboard**: Manage users and wikis from a central dashboard
- **Responsive Design**: Works on desktop and mobile devices

### 🎨 UI/UX Features

- ✅ **Dark Mode**: Toggle button in header with persistent storage and smooth transitions across all pages
- ✅ **Color Themes**: 6 different customizable color schemes for personalization
- ✅ **Smooth Transitions**: Enhanced visual feedback and animations throughout the interface

### 📸 Media Features

- ✅ **Image Upload**: Users can upload wiki images (PNG, JPG, GIF, WebP; max 5MB) with live preview
- ✅ **YouTube Embedding**: Embed videos when creating and editing wikis
- ✅ **Live Preview**: Real-time preview while creating wikis and editing pages

### 🔍 Content & Organization

- ✅ **Search Functionality**: Search across wikis and pages
- ✅ **Unique Page Slugs**: Auto-generate unique slugs for new pages
- ✅ **All Pages Tab**: Display all created pages in a wiki
- ✅ **Wiki Settings**: Edit wiki details including images, videos, name, and description

### 🛡️ Security & Validation

- ✅ **Input Filtering**: Protection against HTML/JavaScript injection (XSS prevention)
- ✅ **Wiki Validation**: Prevent wiki creation on validation errors
- ✅ **Server-side Security**: Comprehensive input sanitization and validation

### 💾 Data & Persistence

- ✅ **Persistent Storage**: All data survives Render redeployments
- ✅ **Image Persistence**: Uploaded images stored on persistent disk
- ✅ **Database Persistence**: SQLite database preserved across deployments

## Getting Started

### Using the Live App (Recommended)

No installation required! Just visit the live demo:

**[https://wiki-farm-cmit295-01-team-1.onrender.com](https://wiki-farm-cmit295-01-team-1.onrender.com)**

1. Click **Register** to create an account
2. The first user automatically becomes an admin
3. Click **Create Wiki** to start your first wiki

### Local Development (Optional)

If you want to run the app locally on your own computer:

#### Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- npm (comes with Node.js)
- Git installed ([Download here](https://git-scm.com/))

#### Step-by-Step Installation

1. **Clone the repository** to your computer:
   ```bash
   git clone https://github.com/tylermross207/WIKI-FARM-CMIT295-01-Team-1.git
   ```

2. **Navigate into the project folder**:
   ```bash
   cd WIKI-FARM-CMIT295-01-Team-1
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

6. **Register an account** - the first user automatically becomes an admin

7. **Start creating wikis!**

> **Tip**: The server uses `nodemon` for development, so any code changes will automatically restart the server.

### Deploying to Render

To deploy your own instance of Wiki Farm to Render:

1. **Fork or clone** this repository to your GitHub account

2. **Go to** [https://render.com](https://render.com) and sign in with GitHub

3. **Click** "New" → "Web Service"

4. **Select** your Wiki Farm repository from the list

5. **Configure the service:**
   - **Name**: `wiki-farm` (or your preferred name)
   - **Region**: Choose the closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. **Click** "Create Web Service"

7. **Wait** for the build to complete (takes 2-3 minutes)

8. **Access** your app at the provided `.onrender.com` URL

> **Note**: On the free tier, the app may sleep after 15 minutes of inactivity. The first request after sleeping may take 30-60 seconds to respond.

### First User

The first user to register automatically becomes an admin. This account can:
- Access the admin dashboard
- Manage all users and wikis
- Delete any content

## Usage

### Creating a Wiki

1. Register or log in
2. Click "Create Wiki"
3. Choose a name and URL slug
4. Add an optional image for your wiki (supported formats: PNG, JPG, GIF, WebP; max 5MB)
5. Optionally embed a YouTube video by providing the video URL
6. Configure visibility (public/private)
7. See a live preview as you fill in the form
8. Create and start adding pages!

### Editing Pages

- Use Markdown syntax for formatting
- Create links to other pages using `[Page Title](page-slug)`
- All changes are saved with revision history

### Wiki Settings

As a wiki owner you can:
- Change wiki name and description
- Upload or change your wiki's image
- Embed YouTube videos
- Toggle public/private visibility
- Allow open editing (anyone can edit)
- Add members with editor/viewer roles
- Delete the wiki

## Project Structure

```
wiki-farm/
├── src/
│   ├── db/
│   │   ├── database.js    # Database connection
│   │   └── init.js        # Schema initialization
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   ├── public/
│   │   └── css/
│   │       └── style.css  # Styles
│   ├── routes/
│   │   ├── admin.js       # Admin routes
│   │   ├── auth.js        # Auth routes
│   │   ├── pages.js       # Page CRUD routes
│   │   └── wiki.js        # Wiki management routes
│   ├── views/             # EJS templates
│   └── server.js          # Express app
└── package.json
```

## API Routes

### Authentication
- `GET /auth/login` - Login page
- `POST /auth/login` - Process login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Process registration
- `GET /auth/logout` - Logout

### Wikis
- `GET /w/create` - Create wiki form
- `POST /w/create` - Create new wiki
- `GET /w/:slug` - Wiki home page
- `GET /w/:slug/pages` - List all pages
- `GET /w/:slug/settings` - Wiki settings

### Pages
- `GET /w/:wiki/:page` - View page
- `GET /w/:wiki/:page/edit` - Edit page form
- `POST /w/:wiki/:page/edit` - Save page
- `GET /w/:wiki/:page/history` - Revision history
- `GET /w/:wiki/:page/revision/:id` - View revision

### Admin
- `GET /admin` - Dashboard
- `GET /admin/users` - Manage users
- `GET /admin/wikis` - Manage wikis

## Configuration

Environment variables:
- `PORT` - Server port (default: 3000)
- `SESSION_SECRET` - Session encryption key

## Data Persistence

The app uses SQLite for data storage with automatic persistence, plus persistent file storage for uploaded images:

- **Local Development**: 
  - Database stored at `src/db/wikifarm.sqlite`
  - Uploaded images stored in `src/public/uploads`
- **Render Deployment**: 
  - Database stored at `/opt/render/project/.data/wikifarm.sqlite` on a persistent disk
  - Uploaded images stored at `/opt/render/project/.data/uploads` on the same persistent disk
- **Automatic Saving**: All changes (users, wikis, pages, messages, images) are saved immediately
- **Redeployments**: Data persists across code redeployments thanks to Render's persistent disk

The `render.yaml` file configures a **1GB persistent disk** that stays intact when you push new commits to GitHub. This means:
- ✅ All your wikis and pages stay intact after redeployment
- ✅ All uploaded images remain available
- ✅ User accounts and data are preserved
- ✅ No data loss when pulling code updates

You can freely update your code on GitHub and Render will redeploy without losing any of the data you've created through the web interface!

## License

MIT
