import { DocumentData, addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
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

export async function getProfileById(docId: string) {
  try {

    const docRef = doc(database, 'profiles', docId);

    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.error('No such profile found!');
      return null;
    }

    return { id: docSnapshot.id, ...docSnapshot.data() } as Profile;
  } catch (error) {
    console.error('Error fetching profile by id:', error);
    throw error;
  }
}