import { db } from "../config/config.js";

class DeveloperService {
  static developerCollection = "developers";

  static async saveDeveloperData(id, developerData) {
    try {
      await db.collection('developers').doc(id).set(developerData)
    } catch (e) {
      console.log(e)
    }
  }
}

export default DeveloperService