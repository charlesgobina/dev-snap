import DeveloperModel from "../../model/developerModel.js";
import DeveloperService from "../../services/developerService.js";
import { verifyPassword } from "../../utils/passwordHashing.js";
import { fbAdmin } from "../../config/config.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { createJWT } from "../../utils/jwt.js";
import { auth } from "../../config/config.js";
import * as uuid from 'uuid'
import { trimmer, validateEmail, validatePassword } from "../../utils/emailAndPasswordValidationHelper.js";



class DevAuth {

  // for express
  static async signup(req, res) {
    const developerId = uuid.v4()
    const { email, password, companyName } = req.body
    validateEmail(email)
    validatePassword(password)
    try {
      // create developer account
      const user = await fbAdmin.auth().createUser({
        uid: developerId,
        email: email,
        password: password,
        emailVerified: false
      })

      // save developer data to firestore
      if (user.uid != null) {

        // hash password
        const hashedPassword = hashPassword(password)
        const developerData = new DeveloperModel(developerId, email, hashedPassword, companyName)
        DeveloperService.saveDeveloperData(developerId, developerData.toJSON())
      }

      // generate jwt token
      const token = createJWT(user)

      console.log(user)
      res.status(201).json({ token: token })
    }
    catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

  

  static async login(req, res) {
    const { email, password } = req.body
    try {
      const user = await DeveloperService.getDeveloperByEmail(email)
      const newDeveloper = new DeveloperModel(user.id, user.email, user.password.hashedPassword, user.companyName)
      // compare password
      if (!verifyPassword(password, newDeveloper.password, user.password.salt)) {
        res.status(401).json({ message: 'Invalid email or password' })
        return
      }
      await DeveloperService.updateDevReadyStatus(newDeveloper.id, true)
      res.status(200).json({ message: 'Login successful' })
    } catch (error) {
      console.log(error)
      res.send(error.message)
    }
  }

}

export { DevAuth }