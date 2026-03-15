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

//
// api.tsx

// Function to fetch all events for a user
export const getEvents = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/events?userId=${userId}`, {  // ← hits GET /events?userId=...
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();  // ← returns array of Event objects from your backend
};

// Function to join an event with a code
export const joinEvent = async (eventId: string, userId: string, code: string) => {
  const res = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {  // ← hits POST /events/:id/join
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, code })  // ← becomes req.body in Express
  });
  return { data: await res.json(), ok: res.ok };  // ← returns response + ok flag for error handling
};

// get all events
export const getAllEvents = async () => {
  const res = await fetch(`${API_BASE_URL}/events/all`)
  return res.json()
}

// register for an event
export const registerForEvent = async (userId: string, eventId: string) => {
  const res = await fetch(`${API_BASE_URL}/events/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, eventId })
  })
  return { data: await res.json(), ok: res.ok }
}



// ── Bakery ────────────────────────────────────────────────

// Get all available recipes
export const getRecipes = async () => {
  const res = await fetch(`${API_BASE_URL}/bakery/recipes`);
  return res.json();  // ← returns Recipe[]
};

// Get the current user's active recipe + progress
export const getCurrentRecipe = async (userId: string) => {
  const res = await fetch(`${API_BASE_URL}/bakery/currentRecipe`, {
    headers: { Authorization: `Bearer ${userId}` }  // ← sends userId as token
  });
  return res.json();  // ← returns { recipe: Recipe | null, progress: number }
};

// Start a new recipe for the user
export const startRecipe = async (userId: string, recipeId: number) => {
  const res = await fetch(`${API_BASE_URL}/bakery/startRecipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userId}`
    },
    body: JSON.stringify({ recipeId })
  });
  return res.json();
};

// Cook the next step of the current recipe
export const cookStep = async (userId: string, recipeId: number) => {
  const res = await fetch(`${API_BASE_URL}/bakery/cook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userId}`
    },
    body: JSON.stringify({ recipeId })
  });
  return res.json();  // ← returns { message: string }
};