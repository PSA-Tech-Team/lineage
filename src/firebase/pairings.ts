import { MEMBERS_COL } from './member';
import { db } from './config';
import { Pairing } from '../fixtures/Pairings';
import { Member } from '../fixtures/Members';

export const PAIRINGS_COL = 'pairings';

const deletedMember: Member = {
  id: '',
  name: '[deleted]',
  classOf: '[deleted]',
  adings: 0,
  aks: 0,
};

/**
 * Returns all pairings from database
 */
export const getPairings = async () => {
  const pairingsCollection = db.collection(PAIRINGS_COL);

  const pairingsColRef = await pairingsCollection.get();
  const pairings: Pairing[] = [];

  for (let pairingSnapshot of pairingsColRef.docs) {
    const pairingData: any = pairingSnapshot.data();
    const akDoc = await pairingData.ak.get();
    const adingDoc = await pairingData.ading.get();

    // Add ids to members if they exist
    const ak = akDoc.exists
      ? { ...(await akDoc.data()), id: akDoc.id }
      : deletedMember;
    const ading = adingDoc.exists
      ? { ...(await adingDoc.data()), id: adingDoc.id }
      : deletedMember;

    // Fetch AK/ading data from document ref fields
    const pairing: any = {
      id: pairingSnapshot.id,
      semesterAssigned: pairingData.semesterAssigned,
      ak,
      ading,
    };

    pairings.push(pairing);
  }

  return pairings;
};

/**
 * Adds a pairing to the database
 * @param akId id of AK in database
 * @param adingId id of ading in database
 * @param semesterAssigned semester pairing was assigned
 */
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

  // Check that members do exist; if not, TODO: throw error
  if (!akDoc.exists || !adingDoc.exists) {
    return;
  }

  // Check that pairing does not already exist; if so, TODO: throw error
  const pairingsCollection = db.collection(PAIRINGS_COL);
  const pairingRef = pairingsCollection
    .where('ak', '==', akRef)
    .where('ading', '==', adingRef);

  const existingPairingResult = await pairingRef.get();
  if (!existingPairingResult.empty) {
    return;
  }

  // Update members to have additional AK/ading
  await akRef.update({ adings: akDoc.data()?.adings + 1 });
  await adingRef.update({ aks: adingDoc.data()?.aks + 1 });

  const pairing = {
    ak: akRef,
    ading: adingRef,
    semesterAssigned,
  };

  // Add pairing to db
  await pairingsCollection.add(pairing);
};

/**
 * Updates pairing with new assigned semester
 * @param pairing pairing to update
 */
export const updatePairing = async (pairing: Pairing) => {
  const doc = db.collection(PAIRINGS_COL).doc(pairing.id);
  const { semesterAssigned } = pairing;

  const docSnap = await doc.get();
  if (docSnap.exists) {
    const idRemoved: any = { ...docSnap.data(), semesterAssigned };
    delete idRemoved.id;

    await doc.update(idRemoved);
  }
};

/**
 * Deletes pairing from database and updates fields of members
 * @param pairingId id of pairing
 */
export const deletePairing = async (pairingId: string) => {
  const doc = db.collection(PAIRINGS_COL).doc(pairingId);

  const docSnap = await doc.get();
  if (!docSnap.exists) return;

  // Delete document from database
  await doc.delete();

  // Update members in pairing
  const akRef = await docSnap.data()?.ak;
  const adingRef = await docSnap.data()?.ading;
  const akSnap = await akRef.get();
  const adingSnap = await adingRef.get();

  if (akSnap.exists) {
    await akRef.update({ adings: akSnap.data().adings - 1 });
  }
  if (adingSnap.exists) {
    await adingRef.update({ aks: adingSnap.data().aks - 1 });
  }
};
