import express, { Request, Response, Router } from 'express';
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
import { db } from '../server';

const router = Router();

router.post('/calend/generateIncident', async (req: Request, res: Response, next) => {
  try {
    const newIncident = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      epic: req.body.epic
    }
    const uID = req.body.userID;

    await db.collection(`Users`).doc(uID).update({
      'tickets': FieldValue.arrayUnion(newIncident)
    })

    res.json('result');

  } catch (err){
    next(err);
  }
});

export default router