// routes/bakery.ts
import express, { Request, Response }  from 'express'
import { loadData, writeDataFile } from '../db/dataStore'
import { DataStore, Recipe, User } from '../interfaces';
// import { authenticate } from '../middleware/auth'

const app = express.Router()

// -------------------------------------------------------
// bakeryRecipeList — GET /bakery/recipes
// Returns all available recipes
// -------------------------------------------------------
app.get('/recipes', (req: Request, res: Response) => {
  const data: DataStore = loadData(); 
  return res.json(data.recipes); 
}); 

// -------------------------------------------------------
// bakeryCurrentRecipe — GET /bakery/currentRecipe
// Returns the logged-in user's active recipe + progress
// -------------------------------------------------------
app.get('/currentRecipe', (req: Request, res: Response) => {
  const {userId} = req.body; 
  const data = loadData();
  const user: User | undefined = data.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'No active recipe found' });
  }

  const recipe = user.currentRecipe; 
  const progress = user.recipeProgress;

  writeDataFile(data); // Save any changes to the data store

  return res.json({ recipe, progress });
})

// -------------------------------------------------------
// bakeryStartRecipe — POST /bakery/startRecipe
// User picks a recipe to start cooking
// Body: { recipeId, userId }
// -------------------------------------------------------
app.post('/startRecipe', (req: Request, res: Response) => {
  const { recipeId, userId } = req.body

  const data = loadData();
  const user = data.users.find(u => u.id === userId) as User; 

  // Check they don't already have an active recipe
  if (user.currentRecipe) {
    return res.status(400).json({ error: 'You already have an active recipe!' })
  }

  const recipe = data.recipes.find(r => r.id === recipeId); 
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }

  const userUpdate: User = {
    ...user,
    currentRecipe: recipe,
    recipeProgress: 0
  };

  // Update the user in the data store
  const userIndex = data.users.findIndex(u => u.id === userId);
  data.users[userIndex] = userUpdate;

  writeDataFile(data); // Save changes to the data store

  res.status(201).json({ user: userUpdate, recipe });
}); 

// -------------------------------------------------------
// bakeryCook — POST /bakery/cook
// Spend coins to advance to the next step
// Body: { userId, recipeId }
// -------------------------------------------------------
app.post('/cook', (req: Request, res: Response) => {
  const { userId, recipeId } = req.body;

  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  const recipe = data.recipes.find(r => r.id === recipeId);

  if (!user || !recipe) {
    return res.status(404).json({ error: 'User or recipe not found' });
  }

  const userRecipe = user.currentRecipe;
  const nextStep = user.recipeProgress + 1;

  if (!user.currentRecipe) {
    return res.status(404).json({ error: 'No active recipe found' })
  }

  // Check they haven't already finished
  if (user.recipeProgress >= recipe.steps.length - 1) {
    return res.status(400).json({ error: 'Recipe already completed!' })
  }

  // Check how many coins the next step costs
  const cost = recipe.pointCosts[nextStep]

  if (user.coins < cost) {
    return res.status(400).json({
      error: 'Not enough coins',
      required: cost,
      current: user.coins
    })
  }

  // Deduct coins
  user.coins -= cost

  // Advance step
  user.recipeProgress = nextStep

  // Mark complete if this was the last step
  const isComplete = nextStep === recipe.steps.length - 1
  if (isComplete) {
    user.completedRecipes.push(recipeId);
  }

  res.json({
    success: true,
    stepCompleted: recipe.steps[nextStep],
    coinsSpent: cost,
    coinsRemaining: user.coins,
    completed: isComplete,
    nextStepCost: recipe.pointCosts[nextStep + 1] ?? null,
    message: isComplete
      ? `🎉 You finished ${recipe.name}!`
      : `Step complete! Next: ${recipe.steps[nextStep + 1]}`
  })
})

export default app