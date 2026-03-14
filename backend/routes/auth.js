import express from 'express'

const router = express.Router()

// Register endpoint
router.post('/register', (req, res) => {

  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing fields" })
  }

  // Later you will store this in the database
  console.log("New user:", username, email)

  res.json({
    message: "User registered successfully"
  })

})

// login end point
router.post('/login', (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" })
  }

  // later you will check database
  res.json({
    message: "Login successful"
  })

})

export default router