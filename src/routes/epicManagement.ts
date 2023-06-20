import express, { Request, Response, Router } from 'express';
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
import { db } from '../server';

const router = Router();

router.get('/getUserEpics', async (req: Request, res: Response, next) => {
  try {
    const data = (await db.collection(`Users`).doc(req.query.userID).get())['_fieldsProto']['epic'];
    res.json(data);
  } catch (err) {
    next(err);
  }
})

router.post('/generateInitialEpic', async (req: Request, res: Response, next) => {
  try {
    const arrColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
    const result = await db.collection(`Users`).doc(req.body.userID).update({
      epic: FieldValue.arrayUnion({
        title: req.body.title,
        color: arrColors[Math.floor(Math.random() * arrColors.length)]
      })
    })
    res.json(result);
  } catch (err) {
    next(err);
  }
})

router.post('/generateEpic', async (req: Request, res: Response, next) => {
  try {
    const userID = req.body.uID;
    const title = req.body.title;
    const totalArrColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
    const result = await db.collection(`Users`).doc(userID).get()
    const epics = result.data()['epic']
    for (const epic of epics) totalArrColors.splice(totalArrColors.indexOf(epic['color']), 1);
    await db.collection(`Users`).doc(userID).update({
      epic: FieldValue.arrayUnion({
        title: title,
        color: totalArrColors[Math.floor(Math.random() * totalArrColors.length)]
      })
    })
    res.json({
      title: title,
      color: totalArrColors[Math.floor(Math.random() * totalArrColors.length)]
    });
  } catch (err) {
    next(err);
  }
})

router.put('/editEpic', async (req: Request, res: Response, next) => {
  try {
    const oldName: string = req.body.oldEpicName.toString();
    const color: string = req.body.color.toString();
    const newName: string = req.body.newName.toString();
    const id: string = req.body.userID.toString();
    await db.collection(`Users`).doc(id).update({
      'epic': FieldValue.arrayRemove({ 'title': oldName, 'color': color})
    })
    await db.collection(`Users`).doc(id).update({
      'epic': FieldValue.arrayUnion({ 'title': newName, 'color': color})
    })
    res.json({id: id});
  } catch (err) {
    next(err);
  }
})

router.delete('/deleteEpic', async (req: Request, res: Response, next) => {
  try {
    const epicTitle: string = req.query.name.toString();
    const color: string = req.query.color.toString();
    const id: string = req.query.userID.toString();

    const result = await db.collection(`Users`).doc(id).update({
      epic: FieldValue.arrayRemove({
        'color': color,
        'title': epicTitle
      })
    })
    res.json(result);
  } catch(err) {
    next(err);
  }
})

export default router;