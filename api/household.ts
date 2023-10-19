import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export async function updateApiUser(household: Household) {
  const userRef = doc(database, "user", household.id);
  await setDoc(userRef, household);
}

export async function getHouseholds(): Promise<Household[]> {
  const querySnapshot = await getDocs(collection(database, "households"));
  const households = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Household
  );
  return households;
}
