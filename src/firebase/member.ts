import { Member } from '../fixtures/Members';
import { deletePairing, PAIRINGS_COL } from './pairings';
import { db } from './config';

export const MEMBERS_COL = 'members';

/**
 * Add member to database
 * @param member member to add
 */
export const addMember = async (member: {
  name: string;
  classOf: string;
  aks: number;
  adings: number;
}) => {
  const collection = db.collection(MEMBERS_COL);
  const result = await collection.add(member);
  return result;
};

/**
 * Returns all members from database
 */
export const getMembers = async () => {
  let collection = db.collection(MEMBERS_COL);
  let members: Member[] = [];

  await collection.get().then((snapshot) => {
    let docs = snapshot.docs;

    for (let member of docs) {
      const { name, classOf, adings, aks } = member.data();

      members.push({
        id: member.id,
        name,
        classOf,
        adings,
        aks,
      });
    }
  });

  return members;
};

/**
 * Updates member's data
 * @param member member to update
 */
export const updateMember = async (member: Member) => {
  const doc = db.collection(MEMBERS_COL).doc(member.id);

  await doc.get().then(async (d) => {
    if (d.exists) {
      // Member Objects are given their `id` as a property when fetched
      // from database. We don't need the id when updating Members, so
      // we remove them before updating their values.
      const idRemoved: any = { ...member };
      delete idRemoved.id;

      await doc.update(idRemoved);
    }
  });
};

/**
 * Deletes member and any associated pairings
 * @param memberId id of member to delete
 */
export const deleteMember = async (memberId: string) => {
  const memberRef = db.collection(MEMBERS_COL).doc(memberId);

  const memberSnap = await memberRef.get();

  if (!memberSnap.exists) return;

  // Get all pairings associated with that member
  const pairingsCol = db.collection(PAIRINGS_COL);
  const deletedWasAk = await pairingsCol.where('ak', '==', memberRef).get();

  const deletedWasAding = await pairingsCol
    .where('ading', '==', memberRef)
    .get();

  // Delete the pairings
  deletedWasAk.forEach(async (pairing) => await deletePairing(pairing.id));
  deletedWasAding.forEach(async (pairing) => await deletePairing(pairing.id));

  // Delete member from database
  await memberRef.delete();
};
