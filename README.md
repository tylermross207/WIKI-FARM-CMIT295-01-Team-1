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

If you want to run the app locally:

#### Prerequisites

- Node.js 18+
- npm

#### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

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

## License

MIT
