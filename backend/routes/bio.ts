import { Router, Request, Response } from 'express';
import { loadData, writeDataFile } from '../db/dataStore';
import { User } from '../interfaces';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { userId } = req.body;
  const data = loadData();

  const user = data.users.find((u: User) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    name: user.name,
    bio: user.bio
  });
});


router.post('/', (req: Request, res: Response) => {
  const { userId, bio } = req.body;

  if (!bio || bio.length > 200) {
    return res.status(400).json({
      error: 'Bio must exist and be under 200 characters'
    });
  }

  const data = loadData();
  const userIndex = data.users.findIndex((u: User) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  data.users[userIndex].bio = bio;

  writeDataFile(data);

  return res.json({
    message: 'Bio updated successfully',
    bio
  });
});

export default router;