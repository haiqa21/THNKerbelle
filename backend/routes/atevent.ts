import { Router, Request, Response } from 'express';
import { loadData } from '../db/dataStore';
import { User } from '../interfaces';

const router = Router();

router.get('/network', (req: Request, res: Response) => {
  const { userId, eventId } = req.body;

  const data = loadData();

  const currentUser = data.users.find((u: User) => u.id === userId);
  const event = data.events.find(e => e.id === eventId);

  if (!currentUser || !event) {
    return res.status(404).json({ error: 'User or event not found' });
  }

  const attendees = data.users.filter(
    u => event.attendees.includes(u.id) && u.id !== userId
  );

  const results = attendees.map(person => {

    let matches = 0;
    const total = currentUser.quizAnswers.length;

    for (let i = 0; i < total; i++) {
      if (currentUser.quizAnswers[i] === person.quizAnswers[i]) {
        matches++;
      }
    }

    const compatibilityScore = Math.round((matches / total) * 100);

    let radarLevel = "red";
    if (compatibilityScore >= 80) radarLevel = "green";
    else if (compatibilityScore >= 40) radarLevel = "yellow";

    return {
      id: person.id,
      name: person.name,
      bio: person.bio,
      compatibilityScore,
      radarLevel
    };
  });

  results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return res.json({ people: results });
});


router.post('/convoStarter', (req: Request, res: Response) => {

  const { userId, targetUserId } = req.body;

  const data = loadData();

  const user = data.users.find((u: User) => u.id === userId);
  const target = data.users.find((u: User) => u.id === targetUserId);

  if (!user || !target) {
    return res.status(404).json({ error: 'User not found' });
  }

  const starters: string[] = [];

  if (user.quizAnswers && target.quizAnswers) {

    if (user.quizAnswers[0] === target.quizAnswers[0]) {
      if (user.quizAnswers[0] === 0) {
        starters.push(`You both like watching shows. Ask ${target.name}: "What show are you watching lately?"`);
      } else {
        starters.push(`You both like gaming. Ask ${target.name}: "What game are you playing right now?"`);
      }
    }

    if (user.quizAnswers[1] === target.quizAnswers[1]) {
      starters.push(`You both picked the same adventure level. Ask: "Would you actually go skydiving?"`);
    }

    if (user.quizAnswers[3] === target.quizAnswers[3]) {
      starters.push(`You both like the same type of stories. Ask: "If you were in that world, what role would you play?"`);
    }

  }

  if (target.bio && target.bio.length > 0) {
    starters.push(`I saw in your bio: "${target.bio}". How did you get into that?`);
  }

  if (starters.length === 0) {
    starters.push(`Hey ${target.name}, what made you come to this event today?`);
  }

  const suggestion = starters[Math.floor(Math.random() * starters.length)];

  return res.json({
    with: target.name,
    conversationStarter: suggestion
  });

});

router.get('/mainQuest', (req: Request, res: Response) => {

  const { userId, eventId } = req.body;

  const data = loadData();

  const user = data.users.find((u: User) => u.id === userId);
  const event = data.events.find(e => e.id === eventId);

  if (!user || !event) {
    return res.status(404).json({ error: 'User or event not found' });
  }

  const quests = [
    "Meet someone with a GREEN compatibility radar",
    "Start a conversation with someone you haven't met",
    "Find someone who also likes video games",
    "Ask someone about their favourite weekend activity",
    "Meet 2 new people at this event"
  ];

  const quest = quests[Math.floor(Math.random() * quests.length)];

  return res.json({
    event: event.name,
    quest,
    reward: 20
  });

});

export default router;