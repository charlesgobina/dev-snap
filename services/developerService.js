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

  // get developer by email
  static async getDeveloperByEmail(email) {
    try {
      const developer = await db.collection('developers').where('email', '==', email).get()
      console.log(developer.docs[0].data())
      return developer.docs[0].data()
    } catch (e) {
      console.log(e)
    }
  }

  // update devReady status
  static async updateDevReadyStatus(id, status) {
    try {
      await db.collection('developers').doc(id).update({ isDevReady: status })
    } catch (e) {
      console.log(e)
    }
  }
}

export default DeveloperService