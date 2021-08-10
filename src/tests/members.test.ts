import { addMember, MEMBERS_COL } from '../firebase/member';
import { db, fb } from '../firebase/config';

describe('addMember()', () => {
  const collection = db.collection(MEMBERS_COL);

  it('should add the passed-in member to the database', async () => {
    const memberCount = (await collection.get()).size;
    expect(memberCount).toBe(0);

    const param = {
      name: 'Renzo',
      classOf: '2023',
      adings: 0,
      aks: 0,
    };

    const resultDoc = await addMember(param);
    expect(resultDoc).not.toBe(undefined);

    const newMemberCount = (await collection.get()).size;
    expect(newMemberCount).toEqual(memberCount + 1);
  });

  afterAll(async () => {
    const result = await collection.where('name', '==', 'Renzo').get();
    await Promise.all(result.docs.map((doc) => collection.doc(doc.id).delete()));
    return await Promise.all(fb.apps.map((app) => app.delete()));
  });
});
