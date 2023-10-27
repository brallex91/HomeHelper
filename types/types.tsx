interface Profile {
  id: string;
  name: string;
  avatar: string; 
  userId: string;
}

interface ChoreCompletion {
  householdId: string;
  choreId: string;
  profileId: string;
  date: Date; // Datum och tid när sysslan slutfördes
}
