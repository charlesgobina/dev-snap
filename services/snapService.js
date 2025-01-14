import { db } from "../config/config.js";


class SnapService {
  static snapCollection = 'snapsCollection';
  static snapSubcollection = 'snaps';

  static async createSnap(userId, snap) {
    try {
      await db.collection(this.snapCollection).doc(userId).collection(this.snapSubcollection).set(snap)
    } catch (e) {
      console.log(e)
    }
  }
}

export default SnapService