# Note Stream - Professional Note-Taking Application

A full-stack web application for creating, managing, and organizing your personal notes with a clean, intuitive interface. Build with modern web technologies and professional design principles.

## 📋 Overview

Note Stream is a secure, user-friendly note-taking application that allows users to create, edit, view, and delete notes with ease. The application features user authentication, a professional settings page, and a beautiful, responsive user interface.

## ✨ Features

### Core Features
- **User Authentication**: Secure registration and login system with password hashing using PBKDF2
- **Create Notes**: Easily create new notes with title and content
- **View Notes**: Browse all your notes in a clean, organized list view
- **Edit Notes**: Modify existing notes with automatic timestamp tracking
- **Delete Notes**: Remove notes you no longer need
- **Sort & Organization**: Notes are automatically sorted by last updated date and creation date

### User-Friendly Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Settings Page**: Manage account information and view statistics
- **Account Statistics**: Track total notes created and account age
- **Beautiful UI**: Modern, gradient-based design with smooth animations and transitions
- **Clickable Note Cards**: Click any note card to view, or use action buttons for edit/delete

### Security Features
- **Secure Password Hashing**: PBKDF2 with 310,000 iterations for secure password storage
- **Session Management**: Secure session handling with Passport.js authentication
- **Account Deletion**: Two-step verification process for account deletion with password confirmation
- **Password Verification**: Password confirmation required before account deletion

## 🛠 Technologies Used

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for building RESTful APIs and routing
- **MongoDB**: NoSQL database for storing user accounts and notes
- **Mongoose**: MongoDB object modeling with schema validation
- **Passport.js**: Authentication middleware for user login and registration
- **Crypto**: Built-in Node.js crypto module for secure password hashing

### Frontend
- **HTML5**: Semantic markup for web pages
- **CSS3**: Custom styling with gradients, animations, and responsive layouts
- **EJS (Embedded JavaScript)**:  Server-side templating engine
- **Bootstrap 5**: Responsive UI framework for components and grid system
- **JavaScript (Vanilla)**: Client-side interactivity and form handling

### Development Tools
- **Method Override**: HTTP verb tunneling for PUT/DELETE requests in forms
- **Express Sessions**: Server-side session management
- **dotenv**: Environment variable management (if needed)

## 📦 Project Structure

```
Note-taking-App/
├── models/
│   └── models.js              # Mongoose schemas for User and Note
├── routers/
│   ├── auth.js                # Authentication routes (login, register, logout)
│   ├── notes.js               # Note CRUD operations
│   └── users.js               # User settings and account management
├── views/
│   ├── partials/
│   │   └── header.ejs         # Navigation header component
│   ├── home.ejs               # Landing/home page
│   ├── login.ejs              # Login page
│   ├── register.ejs           # Registration page
│   ├── index.ejs              # Notes list view
│   ├── view.ejs               # Single note view
│   ├── add.ejs                # Add new note form
│   ├── edit.ejs               # Edit note form
│   └── settings.ejs           # User settings and account management
├── public/
│   └── stylesheets/
│       └── style.css          # Global and page-specific styles
├── index.js                   # Main application file
├── package.json               # Project dependencies and metadata
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/hsn200406/Note-taking-App.git
   cd Note-taking-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   - Ensure MongoDB is running on your system or have a MongoDB Atlas connection string
   - Update the MongoDB connection string in `index.js` if needed:
     ```javascript
     mongoose.connect('mongodb://localhost:27017/notesApp')
     ```

4. **Start the application**
   ```bash
   npm start
   // or
   node index.js
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 💻 Usage

### Registration
1. Click "Register" on the home page or login page
2. Enter a username (minimum 6 characters) and password (minimum 12 characters with uppercase, lowercase, number, and special character)
3. Submit the form to create your account

### Creating Notes
1. Log in to your account
2. Click "Create a Note" button
3. Enter a title and content for your note
4. Click "Save Note" to store it

### Managing Notes
- **View**: Click any note card to view its full content
- **Edit**: Click the "Edit" button to modify a note
- **Delete**: Click the "Delete" button to remove a note (confirmation required)
- **Sort**: Notes are automatically sorted by last updated date

### Settings
1. Click the "Settings" gear icon in the navigation bar
2. View your profile information and account statistics
3. To delete your account:
   - Click "Delete Account Permanently"
   - Enter your password to verify
   - Confirm that passwords match
   - Click "Proceed" to move to final confirmation
   - Click "Yes, Delete Everything" to permanently delete your account

## 🔐 API Routes

### Authentication Routes (`/auth`)
- `GET /auth/register` - Display registration form
- `POST /auth/register` - Submit registration form
- `GET /auth/login` - Display login form
- `POST /auth/login` - Submit login form
- `POST /auth/logout` - Logout user

### Notes Routes (`/notes`) - *Requires Login*
- `GET /notes` - Display all user notes
- `GET /notes/new` - Display new note form
- `POST /notes` - Create new note
- `GET /notes/:id` - View single note
- `GET /notes/:id/edit` - Display edit form
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

### Users Routes (`/users`) - *Requires Login*
- `GET /users/settings` - Display settings page
- `GET /users/profile` - Get user profile (JSON)
- `GET /users/stats` - Get account statistics
- `POST /users/verify-password` - Verify password for account deletion
- `DELETE /users/account` - Delete user account

## 🔒 Security Features

### Password Security
- Uses PBKDF2 with 310,000 iterations for password hashing
- Salt is randomly generated for each password
- Password requirements:
  - Minimum 12 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

### User Session Management
- Secure session handling with Passport.js
- Session expiration: 24 hours
- HttpOnly cookies for session management

### Account Deletion Security
- Two-step verification process
- Password confirmation required before deletion
- Clear warnings about data loss
- All associated notes are permanently deleted

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  hashedPassword: String (required),
  passwordSalt: String (required),
  createdAt: Date (default: now),
  updatedAt: Date,
  lastLoginAt: Date
}
```

### Note Model
```javascript
{
  title: String (required),
  content: String (required),
  user: ObjectId (reference to User),
  createdAt: Date (default: now),
  updatedAt: Date
}
```

## 🎨 Design Highlights

- **Gradient Headers**: Eye-catching blue gradient backgrounds (#0d6efd to #0a58ca)
- **Card-Based Layout**: Clean, organized note cards with hover effects
- **Responsive Grid**: Bootstrap grid system for perfect alignment on all devices
- **Danger Zone Styling**: Red gradient backgrounds for destructive actions
- **Smooth Animations**: Transitions and transforms for interactive elements
- **Professional Typography**: Clear hierarchy and readable fonts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Hassan** - [GitHub Profile](https://github.com/hsn200406)

## 🆘 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Built with ❤️ using Node.js and MongoDB**
