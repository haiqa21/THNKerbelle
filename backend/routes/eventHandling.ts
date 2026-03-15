import { Router, Request, Response } from 'express';
import { loadData, writeDataFile } from '../db/dataStore';
import { User } from '../interfaces';

const router = Router();


// GET /events/all — get all events
router.get('/events/all', (req: Request, res: Response) => {
  const data = loadData()
  return res.json(data.events)
})

// POST /events/register — register user for an event
router.post('/events/register', (req: Request, res: Response) => {
  const { userId, eventId } = req.body

  if (!userId || !eventId)
    return res.status(400).json({ error: 'Missing userId or eventId' })

  const data = loadData()

  const user = data.users.find((u: User) => u.id === userId)
  if (!user) return res.status(404).json({ error: 'User not found' })

  const event = data.events.find((e: any) => e.id === eventId)
  if (!event) return res.status(404).json({ error: 'Event not found' })

  // check if already registered
  if (user.registeredEvents.includes(eventId)) {
    return res.status(400).json({ error: 'Already registered for this event' })
  }

  // add event to user's registeredEvents
  user.registeredEvents.push(event)
  event.attendees.push(userId) // also add user to event's attendees
  writeDataFile(data)

  return res.json({ message: 'Registered successfully', event })
})


// Get /events - list all events
router.get('/events', async (req: Request, res: Response) => {
  const userId = String(req.query.userId);
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if (!user) return res.status(400).json({ error: 'Invalid User' });

  // ← cross-reference registeredEvents IDs (strings) with full event objects
  const userEvents = user.registeredEvents; 
  return res.json(userEvents);
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

router.post('/events/:eventId/registeredEnterance', (req: Request, res: Response) => {
    const eventId = String(req.params.eventId);
    const {userId} = req.body
    const data = loadData();

    const event = data.events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // find the current user
    const currentUser = data.users.find(u => u.id === userId);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    // get all attendees except the current user
    const attendees = data.users.filter(u => 
        event.attendees.includes(u.id) && u.id !== userId
    );

    // score each attendee by how many quiz answers match
    const scored = attendees.map(attendee => {
    let matchScore = 0;
    for (let i = 0; i < currentUser.quizAnswers.length; i++) {
        if (attendee.quizAnswers[i] === currentUser.quizAnswers[i])
            matchScore++;
        }
        return { id: attendee.id, name: attendee.name, bio: attendee.bio, matchScore };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return res.json({ people: scored });

});
export default router;