import { Router, Request, Response } from 'express';
import { loadData, writeDataFile } from '../db/dataStore';

const router = Router();

// Get /events - list all events
router.get('/events', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if(!user){
    return res.status(400).json({ error: 'Invalid User' });
  }
  return res.json(user?.registeredEvents)
});

router.post('/events/:eventId/join', (req: Request, res: Response) => {
  const eventId = String(req.params.eventId);
  const { code, userId } = req.body

  const data = loadData()

  // find the event
  const event = data.events.find(e => e.id === eventId)
  if (!event) {
    return res.status(404).json({ error: 'Event not found' })
  }

  // check the code
  if (event.code !== code) {
    return res.status(401).json({ error: 'Incorrect event code' })
  }

  // check if user already joined
  if (event.attendees.includes(userId)) {
    return res.json({ success: true, event })
  }

  // add user to attendees
  event.attendees.push(userId)
  writeDataFile(data)

  return res.json({ success: true, event })
})

export default router;