# QuizWizard 🧠

A full-stack quiz application built with React, TypeScript, Fastify, and SQLite that allows students to take quizzes and receive real-time AI-powered feedback.

## Features

### ✅ Core Functionality
- **Quiz Selection**: Browse and select from available quizzes
- **Quiz Taking**: Answer multiple-choice and free-text questions one at a time
- **Progress Tracking**: Resume quizzes from where you left off
- **Real-time Feedback**: Get immediate results with detailed explanations
- **AI Grading**: Free-text questions graded using LLM API
- **Session Management**: Secure authentication with email-based login

### 🎨 User Experience
- Clean, modern interface with consistent styling
- Responsive design that works on all devices
- Intuitive navigation and progress indicators
- Real-time progress saving
- Cross-device quiz resumption

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Radix UI** components for accessibility

### Backend
- **Fastify** for high-performance API server
- **TypeScript** for type safety
- **SQLite** for data persistence
- **Session management** with cookies

### AI Integration
- **Stepful LLM API** for grading free-text questions
- Real-time feedback generation
- Detailed explanations for incorrect answers

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd quiz_wizard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run setup
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 3001) and frontend development server (port 5173).

### Logging In

Once the servers are running, you can access the application at `http://localhost:5173`.

**Test Account:**
- Email: `john@example.com`
- No password required (email-only authentication)

Simply enter the email address and click "Login" to access the quiz interface.

### Database Setup

The application uses SQLite with the following schema:

- **users**: User accounts with email authentication
- **assignments**: Available quizzes with questions
- **quiz_attempts**: Track quiz progress and completion

Run setup to install dependencies and set up the database:
```bash
npm run setup
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register with email
- `POST /api/auth/login` - Login with email
- `POST /api/auth/logout` - Logout

### Quizzes
- `GET /api/quizzes` - Get all available quizzes
- `GET /api/quizzes/:id` - Get specific quiz details
- `GET /api/quiz-attempts/incomplete` - Get user's incomplete attempts
- `POST /api/quiz-attempts` - Start or update quiz attempt
- `PUT /api/quiz-attempts/:id/complete` - Mark attempt as complete

### Feedback
- `POST /api/feedback` - Get AI feedback for individual question
- `POST /api/feedback/bulk` - Get AI feedback for multiple questions

## Project Structure

```
fullstack_boilerplate/
├── backend/
│   ├── controllers/     # API route handlers
│   ├── migrations/      # Database migrations
│   ├── models/          # Data models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic (LLM integration)
│   └── server.ts        # Fastify server setup
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   └── styles/      # Global styles
│   └── index.html       # Entry point
└── package.json         # Root package.json for dev scripts
```

## Key Implementation Decisions

### Authentication
- **Email-only authentication**: Simplified user experience without password complexity
- **Session-based**: Secure cookie-based sessions for cross-device access
- **No password storage**: Reduces security surface area

### Quiz Progress
- **Real-time saving**: Answers saved as user progresses
- **Resume functionality**: Users can continue from any device
- **Incomplete attempt detection**: Shows "Resume" vs "Start" buttons

### AI Integration
- **Stepful LLM API**: Free, reliable AI grading service
- **Structured feedback**: Consistent feedback format with explanations
- **Error handling**: Graceful fallbacks when AI service is unavailable

### UI/UX Design
- **Clean, modern interface**: Inspired by educational platforms
- **Consistent styling**: Unified design system with Tailwind
- **Responsive design**: Works seamlessly across devices


## Development

### Running Tests
```bash
npm test
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Reset database
npm run db:reset
```

### Building for Production
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the Stepful Take-Home Assignment for QuizWizard.


