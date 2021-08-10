import { addMember, MEMBERS_COL } from '../firebase/member';
import { db, fb } from '../firebase/config';

const TEST_MEMBER = 'Member1';

describe('addMember()', () => {
  const collection = db.collection(MEMBERS_COL);

  it('should add the passed-in member to the database', async () => {
    const memberCount = (await collection.get()).size;

    const param = {
      name: TEST_MEMBER,
      classOf: '2023',
      adings: 0,
      aks: 0,
    };

    const resultDoc = await addMember(param);
    expect(resultDoc).not.toBe(undefined);

    const newMemberCount = (await collection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);

    // TODO: ensure that the member is actually in the database
  });

  afterAll(async () => {
    // Delete all test members
    const result = await collection.where('name', '==', TEST_MEMBER).get();
    await Promise.all(result.docs.map((doc) => collection.doc(doc.id).delete()));
    return await Promise.all(fb.apps.map((app) => app.delete()));
  });
});
