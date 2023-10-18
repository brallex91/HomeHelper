import { collection, getDocs } from 'firebase/firestore';
import { database } from '../database/firebaseConfig';

export async function getHouseholds(): Promise<Household[]> {
  const querySnapshot = await getDocs(collection(database, 'households'));
  const households = querySnapshot.docs.map((doc) => doc.data() as Household);
  return households;
}
