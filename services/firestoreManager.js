// firestore-manager.js
import app from '../config/config.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDoc,
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

export class FirestoreManager {
  constructor() {
    this.app = app;
    this.db = getFirestore(this.app);
  }

  // Add a document to a collection
  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: new Date(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to add document: ${error.message}`);
    }
  }

  // Get a document by ID
  async getDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      throw new Error(`Failed to get document: ${error.message}`);
    }
  }

  // Query documents in a collection
  async queryDocuments(collectionName, conditions = [], sortBy = null) {
    try {
      let q = collection(this.db, collectionName);
      
      // Add where conditions
      if (conditions.length > 0) {
        q = query(q, ...conditions.map(c => 
          where(c.field, c.operator, c.value)
        ));
      }

      // Add sorting if specified
      if (sortBy) {
        q = query(q, orderBy(sortBy.field, sortBy.direction));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Failed to query documents: ${error.message}`);
    }
  }

  // Update a document
  async updateDocument(collectionName, documentId, data) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  // Delete a document
  async deleteDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }
}