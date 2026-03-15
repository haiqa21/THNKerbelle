// Base URL for the backend API
const API_BASE_URL = 'http://localhost:3000'; // Change to your computer's IP for mobile simulator, e.g., 'http://192.168.1.100:3000'

// Function to register a new user
export const authRegister = async (name: string, email: string, password: string, bio?: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, bio }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data; // { message: 'Registered', userId: ... }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function to log in a user
export const authLogin = async (email: string, password: string) => {
  const res = await fetch('http://localhost:3000/auth/login', {  // ← hits your backend
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })  // ← becomes req.body in Express
  })
  return res.json()  // ← returns whatever your backend sends back
};
