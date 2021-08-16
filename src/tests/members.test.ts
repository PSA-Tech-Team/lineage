import { addMember, deleteMember, MEMBERS_COL } from '../firebase/member';
import { db, fb } from '../firebase/config';

const MEMBER_1 = 'Member1';
const MEMBER_2 = 'Member2';
const MEMBER_3 = 'Member3';
const INITIAL_COUNT = 0;
const CLASS_OF = '2023';
const collection = db.collection(MEMBERS_COL);

describe('addMember()', () => {
  it('should add the passed-in member to the database', async () => {
    const memberCount = (await collection.get()).size;

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

    const newMemberCount = (await collection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);

    // Ensure that the member is correctly added into the database
    expect(member).not.toBeUndefined();
    expect(member?.name).toEqual(MEMBER_1);
    expect(member?.classOf).toEqual(CLASS_OF);
    expect(member?.aks).toEqual(INITIAL_COUNT);
    expect(member?.adings).toEqual(INITIAL_COUNT);
  });

  it('should prevent members of duplicate names to be added', async () => {
    const memberCount = (await collection.get()).size;

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

    const newMemberCount = (await collection.get()).size;
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
    const memberCountAfterDuplicate = (await collection.get()).size;
    expect(memberCountAfterDuplicate).toEqual(memberCount + 1);
  });

  afterAll(async () => {
    // Delete all test members
    const deleteMemberQuery = await collection
      .where('name', 'in', [MEMBER_1, MEMBER_2])
      .get();
    await Promise.all(
      deleteMemberQuery.docs.map((doc) => collection.doc(doc.id).delete())
    );
    return await Promise.all(fb.apps.map((app) => app.delete()));
  });
});

describe('deleteMember()', () => {
  it('should successfully delete a member of valid ID', async () => {
    // Add member to database
    const initialMemberCount = (await collection.get()).size;

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

    const memberCountAfterAdd = (await collection.get()).size;
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

    const memberCountAfterDeletion = (await collection.get()).size;
    expect(memberCountAfterDeletion).toEqual(initialMemberCount);
    
    // Ensure member was successfully deleted
    expect(deletedMember).not.toBeUndefined();
    expect(deletedMember?.name).toEqual(MEMBER_1);
    expect(deletedMember?.classOf).toEqual(CLASS_OF);
    expect(deletedMember?.aks).toEqual(INITIAL_COUNT);
    expect(deletedMember?.adings).toEqual(INITIAL_COUNT);
  });
});
