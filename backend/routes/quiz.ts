// quiz.ts
import express, { Request, Response, Router } from 'express'
import { loadData, writeDataFile } from '../db/dataStore'
import { User } from '../interfaces'

const app: Router = express.Router()

// -------------------------------------------------------
// The 5 personality quiz questions
// Each question has 4 options, stored as index 0-3
// -------------------------------------------------------
export const QUIZ_QUESTIONS = [
  {
    id: 0,
    question: "Would you rather watch a show or play video games?",
    options: [
      "Watch a show",       // 0
      "Play video games", // 1
    ]
  },
  {
    id: 1,
    question: "Would you rather go skydiving or read at cafes?",
    options: [
      "Go skydiving",   // 0
      "Read at cafes",  // 1
    ]
  },
  {
    id: 2,
    question: "Are you capable of keeping a pet fish alive?",
    options: [
      "Absolutely",        // 0
      "No way",          // 1
    ]
  },
  {
    id: 3,
    question: "Would you rather live in a mystery novel or a superhero movie?",
    options: [
      "Mystery novel",       // 0
      "Superhero movie",     // 1
    ]
  },
  {
    id: 4,
    question: "How do you recharge after a big social event?",
    options: [
      "Already planning the next one",    // 0
      "Quiet time alone",                 // 1
    ]
  }
]

// -------------------------------------------------------
// GET /quiz/questions
// Returns the quiz questions (called before user answers)
// -------------------------------------------------------
app.get('/questions', (req: Request, res: Response) => {
  return res.json(QUIZ_QUESTIONS)
})

// -------------------------------------------------------
// POST /quiz/submit
// Saves the user's answers to their profile
// Body: { answers: number[] } — e.g. [0, 2, 1, 3, 0]
// -------------------------------------------------------
app.post('/submit', (req: Request, res: Response) => {
  const { answers, userId } = req.body

  // Validate answers exists and is an array
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers must be an array' })
  }

  // Validate correct number of answers
  if (answers.length !== QUIZ_QUESTIONS.length) {
    return res.status(400).json({
      error: `Expected ${QUIZ_QUESTIONS.length} answers, got ${answers.length}`
    })
  }

  // Validate each answer is a valid option index (0-1)
  const isValid = answers.every(a => typeof a === 'number' && a >= 0 && a <= 1)
  if (!isValid) {
    return res.status(400).json({ error: 'Each answer must be a number between 0 and 1' })
  }

  // Find the user and update their quizAnswers
  const data = loadData();
  const user = data.users.find((u: User) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  user.quizAnswers = answers
  writeDataFile(data);  // persist to db.json if you're using file persistence

  return res.json({
    message: 'Quiz saved!',
    quizAnswers: user.quizAnswers
  })
})

// -------------------------------------------------------
// GET /quiz/me
// Returns the logged-in user's current quiz answers
// -------------------------------------------------------
app.get('/me', (req: Request, res: Response) => {
  const {userId} = req.body;

  const data = loadData();
  const user = data.users.find((u: User) => u.id === userId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (!user.quizAnswers || user.quizAnswers.length === 0) {
    return res.status(404).json({ error: 'User has not completed the quiz yet' })
  }

  // Return answers mapped back to the question text for readability
  const answersWithContext = user.quizAnswers.map((answerIndex: number, i: number) => ({
    question: QUIZ_QUESTIONS[i].question,
    answer: QUIZ_QUESTIONS[i].options[answerIndex],
    answerIndex
  }))

  return res.json({ quizAnswers: user.quizAnswers, answersWithContext })
})

export default app