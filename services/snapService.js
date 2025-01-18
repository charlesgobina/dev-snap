import { db } from "../config/adminConfig.js";
import {v4 as uuidv4} from 'uuid';


class SnapService {
  static snapCollection = 'snapsCollection';
  static snapSubcollection = 'snaps';

  static async createSnap(userId, snap) {
    try {
      await db.collection(this.snapCollection).doc(userId).collection(this.snapSubcollection).doc(uuidv4()).set(snap)
    } catch (e) {
      console.log(e)
    }
  }

  static async getSnap(userId, snapId) {
    try {
      const snap = await db.collection(this.snapCollection).doc(userId).collection(this.snapSubcollection).doc(snapId).get()
      return snap.data()
    } catch (e) {
      console.log(e)
    }
  }

  // get all snaps
  static async getAllSnaps(userId) {
    try {
      const snaps = await db.collection(this.snapCollection).doc(userId).collection(this.snapSubcollection).get()
      return snaps.docs.map(doc => doc.data())
    } catch (e) {
      console.log(e)
    }
  }
}

export default SnapService