# CV Mock Test Application

A comprehensive mock test web application for CV (College Exam) with user authentication, exam selection, test interface, performance analytics, and more.

## Features

- **User Authentication**
  - Login & Signup with email/password
  - JWT based authentication

- **Exam Selection**
  - Choose from different years or subject units
  - Default exam: "CV"

- **Mock Test Interface**
  - Multiple choice questions with 4 options
  - Navigation: Next, Previous, Mark for Review
  - Test Timer
  - Instant feedback on submission

- **Performance Analytics**
  - Score tracking
  - Accuracy percentage
  - Subject-wise performance
  - Time taken analysis
  - Score trends over multiple attempts

- **Additional Features**
  - Bookmark difficult questions
  - Leaderboard (college-specific)
  - Topic-wise micro-tests
  - Responsive design

## Tech Stack

- **Frontend**:
  - React.js
  - React Router
  - Recharts for analytics
  - Framer Motion for animations
  - Tailwind CSS for styling

- **Backend**:
  - Node.js & Express
  - MongoDB with Mongoose
  - JWT for authentication
  - RESTful API

## Installation

### Prerequisites
- Node.js
- MongoDB

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cv-mock-test.git
   cd cv-mock-test
   ```

2. Install server dependencies
   ```
   npm install
   ```

3. Install client dependencies
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   ```

5. Run the application
   ```
   # Run both frontend and backend
   npm run dev
   
   # Run backend only
   npm run server
   
   # Run frontend only
   npm run client
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Exams
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get single exam
- `POST /api/exams` - Create new exam (admin)
- `PUT /api/exams/:id` - Update exam (admin)
- `DELETE /api/exams/:id` - Delete exam (admin)

### Questions
- `GET /api/questions` - Get all questions (admin)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)
- `POST /api/questions/:id/bookmark` - Bookmark a question
- `DELETE /api/questions/:id/bookmark` - Remove bookmark
- `GET /api/questions/bookmarks` - Get bookmarked questions

### Attempts
- `GET /api/attempts` - Get all attempts for current user
- `GET /api/attempts/:id` - Get single attempt
- `POST /api/attempts` - Start new attempt
- `PUT /api/attempts/:id/answer` - Submit answer for a question
- `PUT /api/attempts/:id/mark-review` - Mark question for review
- `PUT /api/attempts/:id/submit` - Submit attempt (complete test)
- `GET /api/attempts/analytics` - Get performance analytics

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get single user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/profile` - Update current user profile
- `PUT /api/users/password` - Update password
- `GET /api/users/leaderboard` - Get leaderboard for user's college

## PDF Question Import

The application now supports importing questions from PDF files. This feature allows you to extract questions from your PDF files and add them to the database for use in mock tests.

### How to Use PDF Import

1. Prepare your PDF file with questions in a consistent format:
   - Questions should be numbered (e.g., "1. What is...")
   - Each question should have 4 options labeled A, B, C, D or 1, 2, 3, 4
   - Correct answers should be marked in some way (the parser will try to detect them)

2. Upload your PDF file through the admin interface:
   - Go to the admin dashboard
   - Navigate to the "Import Questions" section
   - Select your PDF file
   - Provide metadata (exam name, year, topic)
   - Click "Upload and Import"

3. Review the imported questions:
   - After import, you'll see a summary of the imported questions
   - You can review and edit them as needed

### PDF Parser Customization

The PDF parser is designed to be flexible, but you may need to customize it for your specific PDF format. If you find that the parser isn't correctly extracting questions or answers, you can modify the parsing logic in `server/utils/pdfParser.js`.

Key areas you might need to customize:
- Question pattern detection
- Option pattern detection
- Correct answer identification
- Multi-line question/option handling

### Testing PDF Import

You can test PDF parsing without affecting the database using the test script:

```
node server/directPdfTest.js
```

This will parse the PDF and show the extracted questions without saving them to the database.

## Deployment Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Local Development Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd cv-mock-test
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your MongoDB connection string and other settings.

4. Run the development server:
   ```
   npm run dev
   ```
   This will start both the backend server and React development server.

### Production Deployment

#### Option 1: Manual Deployment

1. Build the client:
   ```
   npm run build
   ```

2. Set environment variables:
   - Set `NODE_ENV=production`
   - Set `MONGO_URI` to your production MongoDB connection string
   - Set `JWT_SECRET` to a secure random string
   - Set `PORT` to your desired port (default: 5000)

3. Start the server:
   ```
   npm start
   ```

#### Option 2: Heroku Deployment

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku CLI:
   ```
   heroku login
   ```

3. Create a new Heroku app:
   ```
   heroku create cv-mock-test
   ```

4. Set environment variables:
   ```
   heroku config:set MONGO_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set NODE_ENV=production
   ```

5. Push to Heroku:
   ```
   git push heroku main
   ```

#### Option 3: Docker Deployment

1. Build the Docker image:
   ```
   docker build -t cv-mock-test .
   ```

2. Run the Docker container:
   ```
   docker run -p 5000:5000 --env-file .env cv-mock-test
   ```

## Maintenance and Updates

### Adding New Questions via PDF

1. Log in as an admin user
2. Navigate to the Admin Dashboard (/admin)
3. Go to the "PDF Upload" tab
4. Upload your PDF file with questions
5. Provide metadata (exam, year, topic)
6. Click "Upload PDF"

### Database Backups

It's recommended to set up regular backups of your MongoDB database:

1. For MongoDB Atlas:
   - Use the built-in backup feature
   - Schedule automated backups

2. For self-hosted MongoDB:
   ```
   mongodump --uri="your_mongodb_uri" --out=backup_directory
   ```

## License

This project is licensed under the MIT License. 