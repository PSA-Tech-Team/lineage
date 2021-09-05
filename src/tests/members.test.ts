import {
  addMember,
  deleteMember,
  getMembers,
  MEMBERS_COL,
  updateMember,
} from '../firebase/member';
import { db, fb } from '../firebase/config';
import { addPairing, PAIRINGS_COL } from '../firebase/pairings';

// Names for `getMembers()` tests
const NAMES_2023 = ['foo', 'bar', 'xyz'];
const NAMES_2024 = ['abc', 'ijk', 'woo'];

// Names for `addMember()` tests
const [MEMBER_1, MEMBER_2, MEMBER_3] = ['member1', 'member2', 'member3'];

// Names for `updateMember()` tests
const MEMBER_TO_UPDATE = 'memberToUpdate';
const UPDATED_MEMBER = 'updatedMember';

// Names for `deleteMember()` tests
const [AK, ADING_1, ADING_2] = ['ak', 'ading1', 'ading2'];

const INITIAL_COUNT = 0;
const CLASS_OF = '2023';
const memberCollection = db.collection(MEMBERS_COL);
const pairingCollection = db.collection(PAIRINGS_COL);

describe('getMembers()', () => {
  it('should return the correct members for a semester', async () => {
    // Add all members to database
    await Promise.all(
      [...NAMES_2023, ...NAMES_2024].map((name) =>
        addMember({ name, classOf: CLASS_OF, aks: 0, adings: 0 })
      )
    );

    // Fetch members for specific class
    const expectedMemberDocs = (
      await memberCollection.where('classOf', '==', CLASS_OF).get()
    ).docs;

    const actualMemberDocs = await getMembers(CLASS_OF);
    
    // Ensure same length
    expect(actualMemberDocs.length).toBe(expectedMemberDocs.length);

    // Sort IDs
    const sortId = (id1: string, id2: string) => {
      if (id1 < id2) {
        return -1;
      } else if (id1 > id2) {
        return 1;
      } else {
        return 0;
      }
    };

    // Sort each result by ID
    expectedMemberDocs.sort((m1, m2) => sortId(m1.id, m2.id));
    actualMemberDocs.sort((m1, m2) => sortId(m1.id, m2.id));

    // Ensure that sorted members are the same
    for (let i = 0; i < actualMemberDocs.length; i++) {
      const expected = expectedMemberDocs[i];
      const actual = actualMemberDocs[i];

      expect(expected.id).toEqual(actual.id);
      expect(expected.data().name).toEqual(actual.name);
      expect(expected.data().aks).toEqual(actual.aks);
      expect(expected.data().adings).toEqual(actual.adings);
    }
  });
});

describe('addMember()', () => {
  it('should add the passed-in member to the database', async () => {
    const memberCount = (await memberCollection.get()).size;

    const param = {
      name: MEMBER_1,
      classOf: CLASS_OF,
      adings: INITIAL_COUNT,
      aks: INITIAL_COUNT,
    };

    const result = await addMember(param);
    expect(result).not.toBeUndefined();
    const { success, member } = result;
    expect(success).toBe(true);

    const newMemberCount = (await memberCollection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);

    // Ensure that the member is correctly added into the database
    expect(member).not.toBeUndefined();
    expect(member?.name).toEqual(MEMBER_1);
    expect(member?.classOf).toEqual(CLASS_OF);
    expect(member?.aks).toEqual(INITIAL_COUNT);
    expect(member?.adings).toEqual(INITIAL_COUNT);
  });

  it('should prevent members of duplicate names to be added', async () => {
    const memberCount = (await memberCollection.get()).size;

    const param = {
      name: MEMBER_2,
      classOf: CLASS_OF,
      adings: INITIAL_COUNT,
      aks: INITIAL_COUNT,
    };

    const result = await addMember(param);
    expect(result).not.toBeUndefined();
    const { success, member } = result;
    expect(success).toBe(true);

    const newMemberCount = (await memberCollection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);

    // Check that the member was added correctly
    expect(member).not.toBeUndefined();
    expect(member?.name).toEqual(MEMBER_2);
    expect(member?.classOf).toEqual(CLASS_OF);
    expect(member?.aks).toEqual(INITIAL_COUNT);
    expect(member?.adings).toEqual(INITIAL_COUNT);

    // Try adding duplicate member
    const duplicateResult = await addMember(param);
    expect(duplicateResult).not.toBeUndefined();
    const { success: duplicateSuccess, member: duplicateMember } =
      duplicateResult;

    expect(duplicateSuccess).toBe(false);
    expect(duplicateMember).toBeUndefined();
    const memberCountAfterDuplicate = (await memberCollection.get()).size;
    expect(memberCountAfterDuplicate).toEqual(memberCount + 1);
  });
});

describe('updateMember()', () => {
  let memberToUpdateId: string = '';

  beforeAll(async () => {
    const result = await addMember({
      name: MEMBER_TO_UPDATE,
      classOf: CLASS_OF,
      aks: INITIAL_COUNT,
      adings: INITIAL_COUNT,
    });

    memberToUpdateId = result.member!.id;
  });

  it('should return unsuccessful if member with ID does not exist', async () => {
    // Try updating member of invalid ID
    const invalidId = 'an invalid id';
    const result = await updateMember(invalidId, {
      name: 'a new name',
      classOf: `${CLASS_OF}1`,
    });
    expect(result).not.toBeUndefined();

    // Ensure correct response
    const { success } = result;
    expect(success).toBe(false);

    // Check that member is still the same
    const memberToUpdateData: any = (
      await memberCollection.doc(memberToUpdateId).get()
    ).data();
    const { name, classOf } = memberToUpdateData;
    expect(name).toEqual(MEMBER_TO_UPDATE);
    expect(classOf).toEqual(CLASS_OF);
  });

  it('should allow editing of name and class', async () => {
    const updatedName = UPDATED_MEMBER;
    const updatedClass = 'updatedClass';
    const param = {
      name: updatedName,
      classOf: updatedClass,
    };

    // Update member with new fields
    const result = await updateMember(memberToUpdateId, param);
    expect(result).not.toBeUndefined();

    // Ensure response is correct
    const { success, member } = result;
    expect(success).toBe(true);

    expect(member).not.toBeUndefined();
    expect(member!.name).toEqual(updatedName);
    expect(member!.classOf).toEqual(updatedClass);

    // Ensure that the document in database is updated
    const updatedMemberData: any = (
      await memberCollection.doc(memberToUpdateId).get()
    ).data();
    expect(updatedMemberData.name).toEqual(updatedName);
    expect(updatedMemberData.classOf).toEqual(updatedClass);
  });
});

describe('deleteMember()', () => {
  it('should successfully delete a member of valid ID', async () => {
    // Add member to database
    const initialMemberCount = (await memberCollection.get()).size;

    const param = {
      name: MEMBER_3,
      classOf: CLASS_OF,
      adings: INITIAL_COUNT,
      aks: INITIAL_COUNT,
    };

    const addResult = await addMember(param);
    expect(addResult).not.toBeUndefined();
    const { success, member } = addResult;
    expect(success).toBe(true);

    const memberCountAfterAdd = (await memberCollection.get()).size;
    expect(memberCountAfterAdd).toEqual(initialMemberCount + 1);

    // Ensure that the member is correctly added into the database
    expect(member).not.toBeUndefined();
    expect(member?.name).toEqual(MEMBER_3);
    expect(member?.classOf).toEqual(CLASS_OF);
    expect(member?.aks).toEqual(INITIAL_COUNT);
    expect(member?.adings).toEqual(INITIAL_COUNT);

    // Delete member from database
    const deleteResult = await deleteMember(member!.id);
    expect(deleteResult).not.toBeUndefined();

    const { success: deleteSuccess, member: deletedMember } = deleteResult;
    expect(deleteSuccess).toBe(true);

    const memberCountAfterDeletion = (await memberCollection.get()).size;
    expect(memberCountAfterDeletion).toEqual(initialMemberCount);

    // Ensure member was successfully deleted
    expect(deletedMember).not.toBeUndefined();
    expect(deletedMember?.name).toEqual(MEMBER_3);
    expect(deletedMember?.classOf).toEqual(CLASS_OF);
    expect(deletedMember?.aks).toEqual(INITIAL_COUNT);
    expect(deletedMember?.adings).toEqual(INITIAL_COUNT);
  });

  it('should correctly update ak/ading fields of associated adings and delete pairing documents after deletion', async () => {
    const SEMESTER_ASSIGNED = '2021';

    // Add members to database
    const memberNamesToAdd = [AK, ADING_1, ADING_2];
    const memberstoAdd = memberNamesToAdd.map((name) => ({
      name,
      aks: INITIAL_COUNT,
      adings: INITIAL_COUNT,
      classOf: CLASS_OF,
    }));

    const addMembersResults = await Promise.all(
      memberstoAdd.map((member) => addMember(member))
    );

    // Ensure all members are added correctly
    expect(addMembersResults.some((result) => result.success === false)).toBe(
      false
    );
    const memberIds = addMembersResults.map((result) => result.member?.id);
    const [akId, ading1Id, ading2Id] = memberIds;

    // Create pairings
    const addPairingResults = await Promise.all(
      [ading1Id, ading2Id].map((adingId) =>
        addPairing(akId, adingId, SEMESTER_ASSIGNED)
      )
    );

    // Ensure pairings are added correctly
    expect(addPairingResults.some((result) => result.success === false)).toBe(
      false
    );
    const pairingIds = addPairingResults.map((result) => result.pairing?.id);

    // Ensure ak/ading fields have been updated correctly
    const [akData, ading1Data, ading2Data]: any[] = (
      await Promise.all(memberIds.map((id) => memberCollection.doc(id).get()))
    ).map((doc) => doc.data());

    expect(akData.adings).toEqual(INITIAL_COUNT + 2);
    expect(ading1Data.aks).toEqual(INITIAL_COUNT + 1);
    expect(ading2Data.aks).toEqual(INITIAL_COUNT + 1);

    // Delete AK and ensure correct deletion
    const deleteAkResult = await deleteMember(akId!);
    expect(deleteAkResult).not.toBeUndefined();

    const { success } = deleteAkResult;
    expect(success).toBe(true);

    // Ensure ading documents are updated correctly
    const [updatedAding1Data, updatedAding2Data] = (
      await Promise.all(
        [ading1Id, ading2Id].map((id) => memberCollection.doc(id).get())
      )
    ).map((doc) => doc.data());

    expect(updatedAding1Data!.aks).toEqual(INITIAL_COUNT);
    expect(updatedAding2Data!.aks).toEqual(INITIAL_COUNT);

    // Ensure pairing documents are deleted
    const [pairingDoc1, pairingDoc2] = await Promise.all(
      pairingIds.map((id) => pairingCollection.doc(id).get())
    );
    expect(pairingDoc1.exists).toBe(false);
    expect(pairingDoc2.exists).toBe(false);
  });
});

afterAll(async () => {
  const testMembers = [
    MEMBER_1,
    MEMBER_2,
    MEMBER_3,
    UPDATED_MEMBER,
    AK,
    ADING_1,
    ADING_2,
  ];

  // Delete all test members
  const deleteMemberQuery = await memberCollection
    .where('name', 'in', testMembers)
    .get();
  await Promise.all(
    deleteMemberQuery.docs.map((doc) => memberCollection.doc(doc.id).delete())
  );

  // Clear Firebase
  return await Promise.all(fb.apps.map((app) => app.delete()));
});
