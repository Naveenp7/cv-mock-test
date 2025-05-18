/**
 * This script is used to seed the remote MongoDB database with initial data.
 * Usage: 
 * 1. Set the MONGO_URI environment variable to your MongoDB Atlas connection string
 * 2. Run: node server/seed-remote-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/User');
const { Exam } = require('./models/Exam');
const { Question } = require('./models/Question');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    college: 'Test College',
  },
];

const exams = [
  {
    name: 'CV Mock Test 2023',
    description: 'Mock test for CV exam 2023',
    duration: 180, // 3 hours in minutes
    totalQuestions: 5,
    passingScore: 60,
    isActive: true,
  },
];

const questions = [
  {
    text: 'What is the primary purpose of a curriculum vitae (CV)?',
    options: [
      'To provide a comprehensive overview of your academic and professional history',
      'To serve as a brief introduction for job applications',
      'To list only your work experience',
      'To highlight only your educational background'
    ],
    correctAnswer: 0,
    explanation: 'A CV provides a comprehensive overview of your academic and professional history, including education, work experience, research, publications, presentations, and other achievements.',
    difficulty: 'easy',
    topic: 'General',
  },
  {
    text: 'Which of the following should NOT be included in a CV?',
    options: [
      'Your educational background',
      'Your professional experience',
      'Your personal hobbies and interests',
      'Your age, marital status, and religion'
    ],
    correctAnswer: 3,
    explanation: 'Personal information such as age, marital status, and religion should not be included in a CV as they can lead to unconscious bias and are not relevant to your professional qualifications.',
    difficulty: 'medium',
    topic: 'Content',
  },
  {
    text: 'What is the recommended length for a CV?',
    options: [
      '1 page maximum',
      '2-3 pages',
      '5-6 pages',
      'No limit, include everything'
    ],
    correctAnswer: 1,
    explanation: 'A CV is typically 2-3 pages in length, providing enough space to detail your qualifications without overwhelming the reader.',
    difficulty: 'easy',
    topic: 'Format',
  },
  {
    text: 'Which section typically comes first in a CV?',
    options: [
      'Work experience',
      'Skills',
      'Personal information and contact details',
      'References'
    ],
    correctAnswer: 2,
    explanation: 'Personal information and contact details typically come first in a CV, making it easy for employers to identify and contact you.',
    difficulty: 'easy',
    topic: 'Structure',
  },
  {
    text: 'What is the difference between a CV and a resume?',
    options: [
      'There is no difference',
      'A CV is shorter than a resume',
      'A CV is more comprehensive and used primarily in academic contexts',
      'A resume includes personal references while a CV does not'
    ],
    correctAnswer: 2,
    explanation: 'A CV is typically longer and more comprehensive than a resume, detailing academic achievements, research, and publications. It is commonly used in academic, scientific, and research contexts.',
    difficulty: 'medium',
    topic: 'General',
  },
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable not set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Question.deleteMany({});
    
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });
      
      createdUsers.push(newUser);
      console.log(`Created user: ${user.email}`);
    }

    // Create exams
    const createdExams = [];
    for (const exam of exams) {
      const newExam = await Exam.create({
        ...exam,
        createdBy: createdUsers.find(user => user.role === 'admin')._id,
      });
      
      createdExams.push(newExam);
      console.log(`Created exam: ${exam.name}`);
    }

    // Create questions
    for (const question of questions) {
      await Question.create({
        ...question,
        exam: createdExams[0]._id,
      });
      
      console.log(`Created question: ${question.text.substring(0, 30)}...`);
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 