import { DocumentData, addDoc, collection, getDocs } from "firebase/firestore";
import { database } from "../database/firebaseConfig";
import { Profile, ProfileCreate } from "../store/profileSlice";

export async function getProfiles(): Promise<Profile[]> {
  const querySnapshot = await getDocs(collection(database, "profiles"));
  const profiles = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as Profile
  );
  return profiles;
}

export async function addProfile(profileData: ProfileCreate): Promise<DocumentData> {
  try {
    const docRef = await addDoc(collection(database, "profiles"), profileData);
    console.log("Profile added with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding profile: ", error);
    throw error; 
  }
}