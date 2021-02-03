import { MEMBERS_COL } from './member';
import firebase from './config';
import { Pairing } from '../fixtures/Pairings';

const db = firebase.firestore();
const PAIRINGS_COL = 'pairings';

export const getPairings = async () => {
  const pairingsCollection = db.collection(PAIRINGS_COL);

  const pairingsColRef = await pairingsCollection.get();
  const pairings: Pairing[] = [];

  for (let pairingSnapshot of pairingsColRef.docs) {
    const pairingData: any = pairingSnapshot.data();
    const akDoc = await pairingData.ak.get();
    const adingDoc = await pairingData.ading.get();

    // Fetch AK/ading data from document ref fields
    const pairing: any = {
      id: pairingSnapshot.id,
      semesterAssigned: pairingData.semesterAssigned,
      ak: await akDoc.data(),
      ading: await adingDoc.data(),
    };

    pairings.push(pairing);
  }

  return pairings;
}

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

  // Update members to have AKs/adings
  await akRef.update({ hasAdings: true });
  await adingRef.update({ hasAks: true });

  // TODO: migrate Members schema for the aks/adings to be numbers instead of booleans

  const pairing = {
    ak: akRef,
    ading: adingRef,
    semesterAssigned,
  };

  // Add pairing to db
  const pairingsCollection = db.collection(PAIRINGS_COL);
  await pairingsCollection.add(pairing);
};
