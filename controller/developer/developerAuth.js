import DeveloperModel from "../../model/developerModel.js";
import DeveloperService from "../../services/developerService.js";
// import { writeToFirestire } from "../../utils/firestireHelper";
import { fbAdmin } from "../../config/config.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { auth } from "../../config/config.js";
import * as uuid from 'uuid'
import { trimmer, validateEmail, validatePassword } from "../../utils/emailAndPasswordValidationHelper.js";



class DevAuth {

  static async createUser(email, password) {
    validateEmail(trimmer(email))
    validatePassword(trimmer(password))
    try {
      const userProperties = {
        email: email,
        password: password,
        emailVerified: false,
      }

      await fbAdmin.auth().createUser(userProperties)
      console.log('User created successfully')
    } catch (error) {
      console.log('Error creating user:', error.message)
      return error.message
    }
  }

  // for express
  static async login(req, res) {
    const { email, password } = req.body
    try {
      const user = await this.createUser(email, password)
      console.log(user)
      res.send('Login successful')
    }
    catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  

  static async DeveloperSignup (email, password, companyname) {
    try {
      const developerId = uuid.v4()
      const passwordHash = hashPassword(password)
      const devData = new DeveloperModel(email, passwordHash, companyname)

      //check if developer already exists
      
      // create developer account
      await this.createUser(developerId, "charles.gobina@gmail.com", password)
      DeveloperService.saveDeveloperData(developerId, devData.toJSON());
      await this.createUser(email, password)
      console.log(error)
    } catch (error) {
      console.log(error)
      return error
    }
  }

}

export { DevAuth }