import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { database } from '../database/firebaseConfig';
import { Household } from '../store/houseHoldSlice';

export async function updateApiHousehold(household: Household) {
  const householdRef = doc(database, 'households', household.id);
  await setDoc(householdRef, household);
}

export async function getHouseholds(): Promise<Household[]> {
  const querySnapshot = await getDocs(collection(database, 'households'));
  const households = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Household
  );
  return households;
}

export async function getHouseholdByCode(code: string) {
  try {
    const q = query(
      collection(database, 'households'),
      where('key', '==', code)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Household;
  } catch (error) {
    console.error('Fel vid hämtning av hushåll:', error);
    throw error;
  }
}

export async function getHouseholdById(docId: string) {
  try {
    // Reference to the document in the 'households' collection with the given docId
    const docRef = doc(database, 'households', docId);
    // Fetch the document
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.error('No such household found!');
      return null;
    }

    // Return the household data with its id
    return { id: docSnapshot.id, ...docSnapshot.data() } as Household;
  } catch (error) {
    console.error('Error fetching household by id:', error);
    throw error;
  }
}
