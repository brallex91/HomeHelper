import {
  collection,
  doc,
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
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Fel vid hämtning av hushåll:', error);
    throw error;
  }
}
