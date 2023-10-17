import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export async function getUsers(): Promise<User[]> {
  const querySnapshot = await getDocs(collection(database, "users"));
  const users = querySnapshot.docs.map((doc) => doc.data() as User);
  return users;
}

export async function updateApiUser(user: User) {
  const userRef = doc(database, "user", user.id);
  await setDoc(userRef, user);
}
