import { MEMBERS_COL } from './member';
import { db } from './config';
import { Pairing } from '../fixtures/Pairings';
import { Member } from '../fixtures/Members';

export const PAIRINGS_COL = 'pairings';

/**
 * Returns all pairings from database
 */
export const getPairings = async () => {
  const pairingsCollection = db.collection(PAIRINGS_COL);

  const pairingsColRef = await pairingsCollection.get();
  const pairings: Pairing[] = [];

  for (const pairingSnapshot of pairingsColRef.docs) {
    const pairingData = pairingSnapshot.data();
    const { semesterAssigned, ak: akRef, ading: adingRef } = pairingData;

    const akData = (await akRef.get()).data();
    const adingData = (await adingRef.get()).data();

    // Turn Firestore references into JSON
    const ak: Member = { id: akRef.id, ...akData };
    const ading: Member = { id: adingRef.id, ...adingData };

    const pairing: Pairing = {
      id: pairingSnapshot.id,
      ak,
      ading,
      semesterAssigned,
    };

    pairings.push(pairing);
  };

  return pairings;
};

/**
 * Adds a pairing to the database
 * @param akId id of AK in database
 * @param adingId id of ading in database
 * @param semesterAssigned semester pairing was assigned
 * @returns status of operation and, if successful, the added pairing
 */
export const addPairing = async (
  akId: string | undefined,
  adingId: string | undefined,
  semesterAssigned: string
) => {
  if (!akId || !adingId) {
    return {
      success: false,
      message: 'AK or Ading ID is missing from arguments.',
    };
  }

  const membersCollection = db.collection(MEMBERS_COL);

  // Get doc refs to members
  const akRef = membersCollection.doc(akId);
  const akDoc = await akRef.get();
  const adingRef = membersCollection.doc(adingId);
  const adingDoc = await adingRef.get();

  // Check that members do exist
  if (!akDoc.exists || !adingDoc.exists) {
    return {
      success: false,
      message: 'AK or Ading document of specified ID does not exist.',
    };
  }

  // Check that pairing does not already exist
  const pairingsCollection = db.collection(PAIRINGS_COL);
  const pairingRef = pairingsCollection
    .where('ak', '==', akRef)
    .where('ading', '==', adingRef);

  const existingPairingResult = await pairingRef.get();
  if (!existingPairingResult.empty) {
    return {
      success: false,
      message: 'Pairing with specified AK and ading already exists',
    };
  }

  // Update members to have additional AK/ading
  await akRef.update({ adings: akDoc.data()?.adings + 1 });
  await adingRef.update({ aks: adingDoc.data()?.aks + 1 });

  const akData: any = (await akRef.get()).data();
  const adingData: any = (await adingRef.get()).data();

  // Get response data from documents
  const ak: Member = {
    id: akRef.id,
    name: akData.name,
    adings: akData.adings,
    aks: akData.aks,
    classOf: akData.classOf,
  };

  const ading: Member = {
    id: adingRef.id,
    name: adingData.name,
    adings: adingData.adings,
    aks: adingData.aks,
    classOf: adingData.classOf,
  };

  const pairingResponse: Pairing = {
    id: '',
    ak: ak,
    ading: ading,
    semesterAssigned,
  };

  // Add pairing to db
  const result = await pairingsCollection.add({
    ak: akRef,
    ading: adingRef,
    semesterAssigned
  });
  pairingResponse.id = result.id;

  return {
    success: true,
    message: 'Successfully added pairing.',
    pairing: pairingResponse,
  };
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
