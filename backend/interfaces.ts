export interface DataStore {
  users: User[];
  events: Event[];
  recipes: Recipe[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  quizAnswers: number[];
  registeredEvents: string[]; 
  coins: number;
  currentRecipe: Recipe; 
  recipeProgress: number;
  completedRecipes: number[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];   
  description: string;
  code: number;
}

export interface Recipe {
  id: string;
  name: string;
  steps: string[];
  pointCosts: number[]; 
}