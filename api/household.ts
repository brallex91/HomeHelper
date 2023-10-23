import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export async function updateApiHousehold(household: Household) {
  const householdRef = doc(database, "households", household.id);
  await setDoc(householdRef, household);
}

export async function getHouseholds(): Promise<Household[]> {
  const querySnapshot = await getDocs(collection(database, "households"));
  const households = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Household
  );
  return households;
}
