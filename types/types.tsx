interface Profile {
  id: string;
  name: string;
  avatar: string; // Emoji-karaktär, till exempel 🦊, 🐷, osv.
}

interface Household {
  id: string;
  name: string;
  key: string; // En genererad kod för att gå med i hushållet
  members: string[] //Profile ID sparas här
  chores: string[] //Chore ID sparas här
  ownerID: string; // ID för användaren som skapade hushållet
}

interface Chore {
  id: string;
  name: string;
  description: string;
  frequency: number; // Antal dagar
  energyLevel: number; // 1, 2, 4, 6 eller 8
  lastCompletedDate?: Date; // Datum när sysslan senast slutfördes
  dateCreated: Date; // Datum när sysslan skapades
}

interface ChoreCompletion {
  householdId: string;
  choreId: string;
  profileId: string;
  date: Date; // Datum och tid när sysslan slutfördes
}
