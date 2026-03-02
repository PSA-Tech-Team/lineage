import { MEMBERS_COL } from './member';
import { db } from './config';
import { Pairing } from '../fixtures/Pairings';
import { Member } from '../fixtures/Members';
import { updateDoc, getDocs, doc, query, where, collection as getCollection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const PAIRINGS_COL =
  process.env.NODE_ENV === 'test' ? 'pairingsTest' : 'pairings';

const convertFirestoreDocsToPairing = (memberRef: any, memberData: any) => ({
  id: memberRef.id,
  ...memberData,
});

/**
 * Returns all pairings from database
 */
export const getPairings = async (semester: string | null | undefined) => {
  const pairingsCollection = getCollection(db, PAIRINGS_COL);

  const pairingsColRef = await getDocs(semester
    ? query(pairingsCollection,
      where('semesterAssigned', '==', semester)
    )
    : pairingsCollection
  );

  const pairings: Pairing[] = [];
  const memberRefs = new Map<string, Promise<any>>();

  // First pass: collect all unique member references and batch fetch them
  const memberFetchPromises: Promise<any>[] = [];
  
  for (const pairingSnapshot of pairingsColRef.docs) {
    const pairingData = pairingSnapshot.data();
    const rawAk = pairingData.ak;
    const rawAding = pairingData.ading;

    // Normalize: if stored as string id, convert to DocumentReference
    const akRef = typeof rawAk === 'string' ? doc(db, MEMBERS_COL, rawAk) : rawAk;
    const adingRef = typeof rawAding === 'string' ? doc(db, MEMBERS_COL, rawAding) : rawAding;

    // Use refs as cache keys
    const akId = typeof rawAk === 'string' ? rawAk : akRef.id;
    const adingId = typeof rawAding === 'string' ? rawAding : adingRef.id;

    if (!memberRefs.has(akId)) {
      memberRefs.set(akId, getDoc(akRef));
      memberFetchPromises.push(memberRefs.get(akId)!);
    }
    if (!memberRefs.has(adingId)) {
      memberRefs.set(adingId, getDoc(adingRef));
      memberFetchPromises.push(memberRefs.get(adingId)!);
    }
  }

  // Wait for all member fetches in parallel
  await Promise.all(memberFetchPromises);

  // Second pass: build pairings with cached data
  for (const pairingSnapshot of pairingsColRef.docs) {
    const pairingData = pairingSnapshot.data();
    const semesterAssigned = pairingData.semesterAssigned;

    const rawAk = pairingData.ak;
    const rawAding = pairingData.ading;

    const akRef = typeof rawAk === 'string' ? doc(db, MEMBERS_COL, rawAk) : rawAk;
    const adingRef = typeof rawAding === 'string' ? doc(db, MEMBERS_COL, rawAding) : rawAding;

    const akId = typeof rawAk === 'string' ? rawAk : akRef.id;
    const adingId = typeof rawAding === 'string' ? rawAding : adingRef.id;

    const akSnap = await memberRefs.get(akId)!;
    const adingSnap = await memberRefs.get(adingId)!;

    const ak: Member = convertFirestoreDocsToPairing(akRef, akSnap.data());
    const ading: Member = convertFirestoreDocsToPairing(adingRef, adingSnap.data());

    pairings.push({
      id: pairingSnapshot.id,
      ak,
      ading,
      semesterAssigned,
    });
  }

  return pairings;
};

export const getAllPairings = async () => {
  return await getPairings(null);
}

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


  const membersCollection = getCollection(db, MEMBERS_COL);

  const akRef = doc(membersCollection, akId);
  const adingRef = doc(membersCollection, adingId);
  
  // Fetch both members in parallel
  const [akDocSnap, adingDocSnap] = await Promise.all([
    getDoc(akRef),
    getDoc(adingRef)
  ]);

  // // Check that members do exist
  if (!akDocSnap.exists() || !adingDocSnap.exists()) {
    return {
      success: false,
      message: 'AK or Ading document of specified ID does not exist.',
    };
  }

  // Check that pairing does not already exist
  // const pairingsCollection = db.collection(PAIRINGS_COL);
  const pairingsCollection = getCollection(db, PAIRINGS_COL);
  // const pairingRef = pairingsCollection
  //   .where('ak', '==', akRef)
  const pairingQuery = query(pairingsCollection,
    where('ak', '==', akRef),
    where('ading', '==', adingRef)
  );
  const existingPairingResult = await getDocs(pairingQuery);
  if (!existingPairingResult.empty) {
    return {
      success: false,
      message: 'Pairing with specified AK and ading already exists',
    };
  }

  // Add pairing to database
  const newPairing = {
    ak: akRef,
    ading: adingRef,
    semesterAssigned,
  };

  // const pairingDocRef = await pairingsCollection.add(newPairing);
  const pairingDocRef = await addDoc(pairingsCollection, newPairing);

  // Update members' pairing counts
  await updateDoc(akRef, { adings: akDocSnap.data().adings + 1 });
  await updateDoc(adingRef, { aks: adingDocSnap.data().aks + 1 });

  const pairingResponse: Pairing = {
    id: pairingDocRef.id,
    ak: convertFirestoreDocsToPairing(akRef, akDocSnap.data()),
    ading: convertFirestoreDocsToPairing(adingRef, adingDocSnap.data()),
    semesterAssigned,
  };

  return {
    success: true,
    message: 'Pairing successfully added to database.',
    pairing: pairingResponse,
  };
};

interface UpdatePairingFields {
  semesterAssigned?: string;
}

/**
 * Updates pairing with new assigned semester
 * @param pairing pairing to update
 */
export const updatePairing = async (id: string, param: UpdatePairingFields) => {
  const pairingRef = doc(db, PAIRINGS_COL, id);
  const pairingSnap = await getDoc(pairingRef);

  if (!pairingSnap.exists()) {
    return {
      success: false,
      message: `Pairing of id ${id} does not exist`,
    };
  }

  const fieldsToUpdate = {
    semesterAssigned: param.semesterAssigned,
  };

  try {
    await updateDoc(pairingRef, fieldsToUpdate);
  } catch (e) {
    return {
      success: false,
      message: 'An error occurred while trying to update pairing',
    };
  }

  const pairingData: any = pairingSnap.data();
  const { ak: akRef, ading: adingRef } = pairingData;
  
  // Fetch both members in parallel
  const [akSnap, adingSnap] = await Promise.all([
    getDoc(akRef),
    getDoc(adingRef)
  ]);
  const akData: any = akSnap.data();
  const adingData: any = adingSnap.data();

  const pairingResponse: Pairing = {
    id: pairingRef.id,
    ak: convertFirestoreDocsToPairing(akRef, akData),
    ading: convertFirestoreDocsToPairing(adingRef, adingData),
    semesterAssigned: param.semesterAssigned,
  };

  return {
    success: true,
    message: 'Pairing successfully updated.',
    pairing: pairingResponse,
  };
};

/**
 * Deletes pairing from database and updates fields of members
 * @param pairingId id of pairing
 */
export const deletePairing = async (pairingId: string) => {
  const pairingsDoc = doc(db, PAIRINGS_COL, pairingId);
  const docSnap = await getDoc(pairingsDoc);

  if (!docSnap.exists()) {
    return {
      success: false,
      message: `Pairing of id ${pairingId} does not exist.`,
    };
  }


  // Delete document from database
  await deleteDoc(pairingsDoc);

  // Update members in pairing
  const akRef = docSnap.data()?.ak;
  const adingRef = docSnap.data()?.ading;
  
  // Fetch both members in parallel
  const [akSnap, adingSnap] = await Promise.all([
    getDoc(akRef),
    getDoc(adingRef)
  ]);

  const pairingResponse: Pairing = {
    // id: docSnap.id,
    id: pairingId,
    ak: convertFirestoreDocsToPairing(akRef, akSnap.data()),
    ading: convertFirestoreDocsToPairing(adingRef, adingSnap.data()),
  };

  // Update both members in parallel
  const updatePromises = [];
  if (akSnap.exists()) {
    updatePromises.push(
      updateDoc(akRef, { adings: akSnap.data().adings - 1 })
    );
  }
  if (adingSnap.exists()) {
    updatePromises.push(
      updateDoc(adingRef, { aks: adingSnap.data().aks - 1 })
    );
  }
  await Promise.all(updatePromises);

  return {
    success: true,
    message: 'Pairing successfully deleted',
    pairing: pairingResponse,
  };
};
