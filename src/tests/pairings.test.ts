import { db, fb } from '../firebase/config';
import { addMember, MEMBERS_COL } from '../firebase/member';
import { addPairing, PAIRINGS_COL } from '../firebase/pairings';

const MEMBERS = ['Ate', 'Kuya', 'Ading1', 'Ading2'].map((name) => {
  return {
    name,
    classOf: '2021',
    adings: 0,
    aks: 0,
  };
});

describe('addPairing()', () => {
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
    const missingBothResult = await addPairing(undefined, undefined, '2020');
    const missingAdingResult = await addPairing('1', undefined, '2020');
    const missingAkResult = await addPairing(undefined, '1', '2020');

    expect(missingBothResult.success).toBe(false);
    expect(missingAdingResult.success).toBe(false);
    expect(missingAkResult.success).toBe(false);
  });

  it('should return unsuccessful if ading or AK does not exist', async () => {
    expect(true).toBe(false);
  });

  it('should return unsuccessful if pairing already exists', async () => {
    expect(true).toBe(false);
  });

  it('should return added pairing if successful', async () => {
    const [ateId, , ading1Id] = testMemberDocs.map((doc) => doc?.id);
    const initialPairingCount = (await pairingsCollection.get()).docs.length;

    const semesterAssigned = '2021';
    const { success, pairing } = await addPairing(
      ateId,
      ading1Id,
      semesterAssigned
    );
    expect(success).toBe(true);
    expect(pairing).not.toBeUndefined();
    expect(pairing?.semesterAssigned).toEqual(semesterAssigned);
    expect(pairing?.ak.id).toEqual(ateId);
    expect(pairing?.ading.id).toEqual(ading1Id);

    const newPairingCount = (await pairingsCollection.get()).docs.length;
    expect(newPairingCount).toBe(initialPairingCount + 1);
  });

  it('should update associated Member documents if successful', async () => {
    expect(true).toBe(false);
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
