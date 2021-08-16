import { addMember, deleteMember, MEMBERS_COL } from '../firebase/member';
import { db, fb } from '../firebase/config';
import { addPairing, PAIRINGS_COL } from '../firebase/pairings';

const MEMBER_1 = 'Member1';
const MEMBER_2 = 'Member2';
const MEMBER_3 = 'Member3';
const [AK, ADING_1, ADING_2] = ['ak', 'ading1', 'ading2'];
const INITIAL_COUNT = 0;
const CLASS_OF = '2023';
const memberCollection = db.collection(MEMBERS_COL);
const pairingCollection = db.collection(PAIRINGS_COL);

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
    expect(member?.name).toEqual(MEMBER_1);
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
    expect(deletedMember?.name).toEqual(MEMBER_1);
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
  // Delete all test members
  const deleteMemberQuery = await memberCollection
    .where('name', 'in', [MEMBER_1, MEMBER_2, MEMBER_3, AK, ADING_1, ADING_2])
    .get();
  await Promise.all(
    deleteMemberQuery.docs.map((doc) => memberCollection.doc(doc.id).delete())
  );

  // Clear Firebase
  return await Promise.all(fb.apps.map((app) => app.delete()));
});
