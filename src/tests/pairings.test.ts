import { db, fb } from '../firebase/config';
import { addMember, MEMBERS_COL } from '../firebase/member';
import { addPairing, deletePairing, PAIRINGS_COL } from '../firebase/pairings';
import { Member } from '../fixtures/Members';

const pairingsCollection = db.collection(PAIRINGS_COL);
const membersCollection = db.collection(MEMBERS_COL);

const INITIAL_COUNT = 0;
const CLASS_OF = '2021';
const SEMESTER_ASSIGNED = '2020';

const createMemberFromName = (name: string) => ({
  name,
  classOf: CLASS_OF,
  adings: INITIAL_COUNT,
  aks: INITIAL_COUNT,
});

describe('addPairing()', () => {
  const testMembers = ['Ate', 'Kuya', 'Ading1', 'Ading2', 'Ading3'].map(
    createMemberFromName
  );
  let testMemberDocs: any[] = []; // array of Firestore documents
  let testPairingIds: (string | undefined)[] = [];

  beforeAll(async () => {
    // Add 4 members
    const addedMembers = (
      await Promise.all(testMembers.map((member) => addMember(member)))
    ).map((result) => result.member);

    testMemberDocs = addedMembers;
  });

  it('should return unsuccessful if ading or AK id is not included', async () => {
    const missingBothResult = await addPairing(
      undefined,
      undefined,
      SEMESTER_ASSIGNED
    );
    const missingAdingResult = await addPairing(
      '1',
      undefined,
      SEMESTER_ASSIGNED
    );
    const missingAkResult = await addPairing(undefined, '1', SEMESTER_ASSIGNED);

    expect(missingBothResult.success).toBe(false);
    expect(missingAdingResult.success).toBe(false);
    expect(missingAkResult.success).toBe(false);
  });

  it('should return unsuccessful if ading or AK does not exist', async () => {
    const invalidId = '';
    const [ateId, , ading1Id] = testMemberDocs.map((doc) => doc?.id);
    const [missingAdingResult, missingAkResult, missingBothResult] =
      await Promise.all([
        addPairing(ateId, invalidId, SEMESTER_ASSIGNED),
        addPairing(invalidId, ading1Id, SEMESTER_ASSIGNED),
        addPairing(invalidId, invalidId, SEMESTER_ASSIGNED),
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
      SEMESTER_ASSIGNED
    );
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();

    testPairingIds.push(pairing?.id);

    expect(pairing?.semesterAssigned).toEqual(SEMESTER_ASSIGNED);
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
      SEMESTER_ASSIGNED
    );

    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();

    testPairingIds.push(pairing?.id);

    expect(pairing?.ak.id).toEqual(kuyaId);
    expect(pairing?.ading.id).toEqual(ading2Id);
    expect(pairing?.semesterAssigned).toEqual(SEMESTER_ASSIGNED);

    // Try adding pairing again
    const { success: repeatSuccess, pairing: repeatPairing } = await addPairing(
      kuyaId,
      ading2Id,
      SEMESTER_ASSIGNED
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
      SEMESTER_ASSIGNED
    );

    // Ensure pairing was added successfully
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();

    testPairingIds.push(pairing?.id);

    expect(pairing?.ak.id).toEqual(ateId);
    expect(pairing?.ading.id).toEqual(ading3Id);
    expect(pairing?.semesterAssigned).toEqual(SEMESTER_ASSIGNED);

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
    await Promise.all(
      testPairingIds.map((id) => pairingsCollection.doc(id).delete())
    );
  });
});

describe('deletePairing()', () => {
  const testMemberNames = ['foo', 'bar'].map(createMemberFromName);
  let testMemberDocs: Member[] = [];
  let testPairingId: string;

  beforeAll(async () => {
    // Create members
    const testMemberResults = await Promise.all(
      testMemberNames.map((param) => addMember(param))
    );
    const testMembers = testMemberResults.map((result) => result.member!);
    testMemberDocs = testMembers;
    const [fooDoc, barDoc] = testMembers;

    // Add pairing, where `foo` is AK and `bar` is ading
    const testPairingResult = await addPairing(
      fooDoc.id,
      barDoc.id,
      SEMESTER_ASSIGNED
    );
    testPairingId = testPairingResult.pairing!.id;
  });

  it('should return unsuccessful if specified pairing is not found', async () => {
    const pairingCountBefore = (await pairingsCollection.get()).size;

    // Add invalid pairing
    const invalidId = 'invalid id';
    const result = await deletePairing(invalidId);
    expect(result).not.toBeUndefined();
    expect(result.success).toBe(false);

    const pairingCountAfter = (await pairingsCollection.get()).size;
    expect(pairingCountBefore).toEqual(pairingCountAfter);
  });

  it('should return successful when pairing is deleted and update docs accordingly', async () => {
    const pairingCountBefore = (await pairingsCollection.get()).size;
    const [ fooDoc, barDoc ] = testMemberDocs;

    const fooQuery = membersCollection.doc(fooDoc.id);
    const barQuery = membersCollection.doc(barDoc.id);

    const fooDataBefore: any = (await fooQuery.get()).data();
    const barDataBefore: any = (await barQuery.get()).data();

    // Delete pairing
    const result = await deletePairing(testPairingId);
    expect(result).not.toBeUndefined();

    // Ensure response is correct
    const { success, pairing } = result;
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();
    expect(pairing!.id).toEqual(testPairingId);

    const pairingCountAfter = (await pairingsCollection.get()).size;
    expect(pairingCountAfter).toEqual(pairingCountBefore - 1);

    // Ensure member document fields are decremented properly
    const fooDataAfter: any = (await fooQuery.get()).data();
    const barDataAfter: any = (await barQuery.get()).data();

    expect(fooDataAfter.adings).toEqual(fooDataBefore.adings - 1);
    expect(fooDataAfter.aks).toEqual(fooDataBefore.aks);

    expect(barDataAfter.adings).toEqual(barDataBefore.adings);
    expect(barDataAfter.aks).toEqual(barDataBefore.aks - 1);
  });

  afterAll(async () => {
    // Delete test members
    const testMemberIds = testMemberDocs.map((doc) => doc?.id);
    await Promise.all(
      testMemberIds.map((id) => membersCollection.doc(id).delete())
    );
  });
});

afterAll(async () => {
  // Cleanup Firebase
  return await Promise.all(fb.apps.map((app) => app.delete()));
});
