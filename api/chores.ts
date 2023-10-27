import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";
import { Chore } from "../store/choreSlice";

export async function getChores(): Promise<Chore[]> {
  const querySnapshot = await getDocs(collection(database, "chores"));
  const chores = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Chore
  );
  return chores;
}

export async function updateApiChores(chore: Chore) {
  const choreRef = doc(database, "chore", chore.id);
  await setDoc(choreRef, chore);
}
