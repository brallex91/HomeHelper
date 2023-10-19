import { collection, getDocs } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export async function getProfiles(): Promise<Profile[]> {
  const querySnapshot = await getDocs(collection(database, "profiles"));
  const profiles = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Profile
  );
  return profiles;
}
