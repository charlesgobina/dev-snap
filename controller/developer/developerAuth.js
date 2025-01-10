import DeveloperModel from "../../model/developerModel.js";
import DeveloperService from "../../services/developerService.js";
// import { writeToFirestire } from "../../utils/firestireHelper";
import { hashPassword } from "../../utils/passwordHashing.js";
import { auth } from "../../config/config.js";
import * as uuid from 'uuid'



class DevAuth {

  static async createUser(id, email, password) {
    console.log('Creating user')
    try {
      const userProperties = {
        email: email,
        password: password,
        emailVerified: false,
      }

      await auth.createUser(userProperties)
      console.log('User created successfully')
    } catch (error) {
      return error.message
    }
  }

  static async DeveloperSignup (email, password, companyname) {
    try {
      const developerId = uuid.v4()
      const passwordHash = hashPassword(password)
      const devData = new DeveloperModel(email, passwordHash, companyname)

      //check if developer already exists
      
      // create developer account
      await this.createUser(developerId, email, password)
      DeveloperService.saveDeveloperData(developerId, devData.toJSON());
    } catch (error) {
      console.log(error)
    }
  }

}

export { DevAuth }