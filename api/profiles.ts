import { addDoc, collection, getDocs } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export async function getProfiles(): Promise<Profile[]> {
  const querySnapshot = await getDocs(collection(database, "profiles"));
  const profiles = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Profile
  );
  return profiles;
}

export async function addProfile(profileData: Profile): Promise<void> {
  try {
    const docRef = await addDoc(collection(database, "profiles"), profileData);
    console.log("Profile added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding profile: ", error);
    throw error; 
  }
}