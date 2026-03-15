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

  currentRecipe: Recipe | null;
  recipeProgress: number;

  completedRecipes: string[]; 
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;

  attendees: string[]; 

  description: string;
  code: string; 
}

export interface Recipe {
  id: number;
  name: string;

  steps: string[];
  pointCosts: number[];
}