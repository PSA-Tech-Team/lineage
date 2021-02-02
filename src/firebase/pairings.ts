import { MEMBERS_COL } from './member';
import firebase from './config';

const db = firebase.firestore();
const PAIRINGS_COL = 'pairings';

export const addPairing = async (
  akId: string | undefined,
  adingId: string | undefined,
  semesterAssigned: string
) => {
  if (!akId || !adingId) return;

  const membersCollection = db.collection(MEMBERS_COL);

  // Get doc refs to members
  const akRef = membersCollection.doc(akId);
  const akDoc = await akRef.get();
  const adingRef = membersCollection.doc(adingId);
  const adingDoc = await adingRef.get();

  // TODO: better error handling
  if (!akDoc.exists || !adingDoc.exists) {
    return;
  }

  const pairing = {
    ak: akRef,
    ading: adingRef,
    semesterAssigned,
  };

  // Add pairing to db
  const pairingsCollection = db.collection(PAIRINGS_COL);
  await pairingsCollection.add(pairing);
};
