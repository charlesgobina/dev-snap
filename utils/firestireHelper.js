import { db } from "../config/config.js";


const  writeToFirestire = async (collection, id, data) => {
  await db.collection(collection).doc(id).set(data)
}


export {
  writeToFirestire
}