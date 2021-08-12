import { db, fb } from '../firebase/config';
import { addMember, MEMBERS_COL } from '../firebase/member';
import { addPairing, PAIRINGS_COL } from '../firebase/pairings';

const MEMBERS = ['Ate', 'Kuya', 'Ading1', 'Ading2', 'Ading3'].map((name) => {
  return {
    name,
    classOf: '2021',
    adings: 0,
    aks: 0,
  };
});

describe('addPairing()', () => {
  const semesterAssigned = '2020';
  const pairingsCollection = db.collection(PAIRINGS_COL);
  const membersCollection = db.collection(MEMBERS_COL);
  let testMemberDocs: any[] = []; // array of Firestore documents

  beforeAll(async () => {
    // Add 4 members
    const addedMembers = await Promise.all(
      MEMBERS.map((member) => addMember(member))
    );

    testMemberDocs = addedMembers;
  });

  it('should return unsuccessful if ading or AK id is not included', async () => {
    const missingBothResult = await addPairing(
      undefined,
      undefined,
      semesterAssigned
    );
    const missingAdingResult = await addPairing(
      '1',
      undefined,
      semesterAssigned
    );
    const missingAkResult = await addPairing(undefined, '1', semesterAssigned);

    expect(missingBothResult.success).toBe(false);
    expect(missingAdingResult.success).toBe(false);
    expect(missingAkResult.success).toBe(false);
  });

  it('should return unsuccessful if ading or AK does not exist', async () => {
    const invalidId = '';
    const [ateId, , ading1Id] = testMemberDocs.map((doc) => doc?.id);
    const [missingAdingResult, missingAkResult, missingBothResult] =
      await Promise.all([
        addPairing(ateId, invalidId, semesterAssigned),
        addPairing(invalidId, ading1Id, semesterAssigned),
        addPairing(invalidId, invalidId, semesterAssigned),
      ]);

    expect(missingAdingResult.success).toBe(false);
    expect(missingAdingResult.pairing).toBeUndefined();

    expect(missingAkResult.success).toBe(false);
    expect(missingAkResult.pairing).toBeUndefined();

    expect(missingBothResult.success).toBe(false);
    expect(missingBothResult.pairing).toBeUndefined();
  });

  it('should return added pairing if successful', async () => {
    const [, kuyaId, ading1Id] = testMemberDocs.map((doc) => doc?.id);
    const initialPairingCount = (await pairingsCollection.get()).docs.length;

    const { success, pairing } = await addPairing(
      kuyaId,
      ading1Id,
      semesterAssigned
    );
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();
    expect(pairing?.semesterAssigned).toEqual(semesterAssigned);
    expect(pairing?.ak.id).toEqual(kuyaId);
    expect(pairing?.ading.id).toEqual(ading1Id);

    const newPairingCount = (await pairingsCollection.get()).docs.length;
    expect(newPairingCount).toBe(initialPairingCount + 1);
  });

  it('should return unsuccessful if pairing already exists', async () => {
    const [, kuyaId, , ading2Id] = testMemberDocs.map((doc) => doc?.id);

    // Add pairing
    const { success, pairing } = await addPairing(
      kuyaId,
      ading2Id,
      semesterAssigned
    );

    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();

    expect(pairing?.ak.id).toEqual(kuyaId);
    expect(pairing?.ading.id).toEqual(ading2Id);
    expect(pairing?.semesterAssigned).toEqual(semesterAssigned);

    // Try adding pairing again
    const { success: repeatSuccess, pairing: repeatPairing } = await addPairing(
      kuyaId,
      ading2Id,
      semesterAssigned
    );
    
    expect(repeatSuccess).toBe(false);
    expect(repeatPairing).toBeUndefined();
  });

  it('should update associated Member documents if successful', async () => {
    const initialCount = 0;

    // Make pairing between Ate and Ading3
    const [ateId, , , , ading3Id] = testMemberDocs.map((doc) => doc?.id);
    const { success, pairing } = await addPairing(
      ateId,
      ading3Id,
      semesterAssigned
    );

    // Ensure pairing was added successfully
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();
    expect(pairing?.ak.id).toEqual(ateId);
    expect(pairing?.ading.id).toEqual(ading3Id);
    expect(pairing?.semesterAssigned).toEqual(semesterAssigned);

    // Fetch member documents
    const ateDocData: any = (await membersCollection.doc(ateId).get()).data();
    const ading3DocData: any = (
      await membersCollection.doc(ading3Id).get()
    ).data();

    const { adings } = ateDocData;
    const { aks } = ading3DocData;

    // Check that # of ading/AKs is updated correctly
    expect(adings).toEqual(initialCount + 1);
    expect(aks).toEqual(initialCount + 1);
  });

  afterAll(async () => {
    // Delete test members
    const testMemberIds = testMemberDocs.map((doc) => doc?.id);
    await Promise.all(
      testMemberIds.map((id) => membersCollection.doc(id).delete())
    );

    // Delete test pairings
    const testPairingIds = (await pairingsCollection.get()).docs.map(
      (doc) => doc?.id
    );
    await Promise.all(
      testPairingIds.map((id) => pairingsCollection.doc(id).delete())
    );

    // Cleanup Firebase
    return await Promise.all(fb.apps.map((app) => app.delete()));
  });
});

export {};
