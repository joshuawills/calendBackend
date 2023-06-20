import express, { Request, Response, Router } from 'express';
import { db } from '../server';

const router = Router();

router.get('/livenessCheck', (req: Request, res: Response, next) => {
  try {
    return res.json('Active');
  } catch (err) {
    next(err);
  }
});

router.post('/calend/initialiseUser', async (req: Request, res: Response, next) => {
  try {
    const initialDataPreferences = {
      'lightMode': true,
      'email': req.body.email,
      'firstName': '',
      'lastName': '',
      'columns': [
        {
          'name':  'toDo',
          'order': 0,
          'color': '#FF0000'
        },
        {
          'name':  'inProgress',
          'order': 1,
          'color': '#FFA500'
        },
        {
          'name': 'complete',
          'order': 2,
          'color': '#00FF00'
        }
      ],
      'epic': [],
      'tickets': []
    }

    await db.collection('Users').doc(req.body.userID).set(initialDataPreferences);

    res.json('User succesfully initialised');
  } catch (err) {
    next(err);
  }
})

export default router