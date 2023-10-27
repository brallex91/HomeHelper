import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

export interface CompletedChore {
  id: string;
  householdId: string;
  choreId: string;
  profileId: string;
  date: Date;
}

export async function getCompletedChoresByHousehold(
  householdId: string
): Promise<CompletedChore[]> {
  const completedChoresCollection = collection(database, "completedChores");

  const choreQuery = query(
    completedChoresCollection,
    where("householdId", "==", householdId)
  );

  const querySnapshot = await getDocs(choreQuery);
  const completedChores: CompletedChore[] = [];

  querySnapshot.forEach((doc) => {
    const choreData = doc.data();
    const choreId = doc.id;
    completedChores.push({ id: choreId, ...choreData } as CompletedChore);
  });

  return completedChores;
}
