import { addMember, MEMBERS_COL } from '../firebase/member';
import { db, fb } from '../firebase/config';

const MEMBER_1 = 'Member1';
const MEMBER_2 = 'Member2';
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

    const resultDoc = await addMember(param);
    expect(resultDoc).not.toBeUndefined();
    const resultId = resultDoc?.id;
    expect(resultId).not.toBeUndefined();

    const newMemberCount = (await collection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);

    // Ensure that the member is correctly added into the database
    const addedMemberSnapshot = await collection.doc(resultId).get();
    expect(addedMemberSnapshot.exists).toBe(true);
    expect(addedMemberSnapshot.id).toEqual(resultId);

    const addedMemberData: any = addedMemberSnapshot.data();
    expect(addedMemberData.name).toEqual(MEMBER_1);
    expect(addedMemberData.classOf).toEqual(CLASS_OF);
    expect(addedMemberData.aks).toEqual(INITIAL_COUNT);
    expect(addedMemberData.adings).toEqual(INITIAL_COUNT);
  });

  it('should prevent members of duplicate names to be added', async () => {
    // const memberCount = (await collection.get()).size;
    // const param = {
    //   name: MEMBER_2,
    //   classOf: CLASS_OF,
    //   adings: INITIAL_COUNT,
    //   aks: INITIAL_COUNT,
    // };
    expect(false).toBe(true);
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
