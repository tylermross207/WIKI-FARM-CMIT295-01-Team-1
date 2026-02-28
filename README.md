# Wiki Farm 🌱

A multi-tenant wiki hosting platform built with Node.js. Create and manage multiple wikis from a single installation.

## 🌐 Live Demo

**[View Live App on Render](https://wiki-farm-cmit295-01-team-1.onrender.com)**

## Features

- **Multi-tenant Architecture**: Host multiple wikis from one instance
- **User Authentication**: Secure login/registration system
- **Markdown Support**: Write pages using Markdown with live rendering
- **Revision History**: Track all changes with full version history
- **Access Control**: Public/private wikis with member management
- **Admin Dashboard**: Manage users and wikis from a central dashboard
- **Responsive Design**: Works on desktop and mobile devices

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
4. Configure visibility (public/private)
5. Start adding pages!

### Editing Pages

- Use Markdown syntax for formatting
- Create links to other pages using `[Page Title](page-slug)`
- All changes are saved with revision history

### Wiki Settings

As a wiki owner you can:
- Change wiki name and description
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

## Data Persistence (Render Deployment)

The app is configured with persistent storage on Render to ensure data is not lost during redeployments:

- **Database Location**: Uses Render's persistent disk at `/opt/render/project/src/db/wikifarm.sqlite`
- **Disk Size**: 1GB allocated for database storage
- **Auto-persistence**: All user logins, wikis, pages, contact messages, and revisions are automatically saved
- **Redeployments**: New code deployments will not erase existing data

The `render.yaml` file configures this persistent volume automatically. When you push new commits to GitHub, Render will:
1. Pull the latest code
2. Keep the existing database intact
3. Run the new code with all previous data available

## License

MIT
