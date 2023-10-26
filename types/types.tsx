interface Profile {
  id: string;
  name: string;
  avatar: string; // Emoji-karaktär, till exempel 🦊, 🐷, osv.
}

interface Household {
  id: string;
  name: string;
  key: string; // En genererad kod för att gå med i hushållet
  members: string[]; //Profile ID sparas här
  chores: string[]; //Chore ID sparas här
  ownerID: string; // ID för användaren som skapade hushållet
  userId: string[];
}

interface ChoreCompletion {
  householdId: string;
  choreId: string;
  profileId: string;
  date: Date; // Datum och tid när sysslan slutfördes
}
