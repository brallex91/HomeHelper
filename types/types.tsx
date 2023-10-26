interface Profile {
  id: string;
  name: string;
  avatar: string; // Emoji-karaktär, till exempel 🦊, 🐷, osv.
}

interface ChoreCompletion {
  householdId: string;
  choreId: string;
  profileId: string;
  date: Date; // Datum och tid när sysslan slutfördes
}
