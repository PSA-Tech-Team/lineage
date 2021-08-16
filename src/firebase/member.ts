import { Member } from '../fixtures/Members';
import { deletePairing, PAIRINGS_COL } from './pairings';
import { db, fb } from './config';

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
  let result;

  const duplicateMemberQuery = collection
    .where('name', '==', member.name)
    .where('classOf', '==', member.classOf);
  const duplicateMemberResult = await duplicateMemberQuery.get();

  // Prevent duplicate members from being created
  if (!duplicateMemberResult.empty) {
    return {
      success: false,
      message: `A member of name: "${member.name}" and class: ${member.classOf} already exists.`,
    };
  }

  // Add member to database
  try {
    result = await collection.add(member);
  } catch (e) {
    return {
      success: false,
      message:
        'A server error occurred while trying to add member to database.',
    };
  }

  const resultData: any = (await result.get()).data();
  const memberResponse: Member = {
    id: result.id,
    name: resultData.name,
    classOf: resultData.classOf,
    aks: resultData.aks,
    adings: resultData.adings,
  };

  return {
    success: true,
    message: `Successfully added "${member.name}"`,
    member: memberResponse,
  };
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

interface UpdateMemberFields {
  name?: string;
  classOf?: string;
}

/**
 * Updates member's data
 * @param member member to update
 */
export const updateMember = async (id: string, param: UpdateMemberFields) => {
  const memberRef = db.collection(MEMBERS_COL).doc(id);
  const memberSnap = await memberRef.get();

  if (!memberSnap.exists) {
    return {
      success: false,
      message: `Member of id ${id} does not exist`,
    };
  }

  try {
    await memberRef.update(param);
  } catch (e) {
    return {
      success: false,
      message: 'An error occurred while trying to update member',
    };
  }

  const memberData: any = memberSnap.data();
  const memberResponse: Member = {
    id: memberRef.id,
    name: param.name ? param.name : memberData.name,
    classOf: param.classOf ? param.classOf : memberData.classOf,
    aks: memberData.aks,
    adings: memberData.adings,
  };

  return {
    success: true,
    message: `Member "${memberResponse.name}" was successfully updated`,
    member: memberResponse,
  };
};

/**
 * Deletes member and any associated pairings
 * @param memberId id of member to delete
 */
export const deleteMember = async (memberId: string) => {
  const memberRef = db.collection(MEMBERS_COL).doc(memberId);
  const memberSnap = await memberRef.get();

  if (!memberSnap.exists) {
    return {
      success: false,
      message: `Member with id ${memberId} does not exist.`,
    };
  }

  const { name, classOf, adings, aks }: any = memberSnap.data();
  const memberResponse: Member = {
    id: memberSnap.id,
    name,
    classOf,
    adings,
    aks,
  };

  // Get all pairings associated with that member
  const pairingsCol = db.collection(PAIRINGS_COL);
  const deletedMemberWasAk = await pairingsCol
    .where('ak', '==', memberRef)
    .get();

  const deletedMemberWasAding = await pairingsCol
    .where('ading', '==', memberRef)
    .get();

  // Update `ak` field in member documents who had the deleted member as an ak
  await Promise.all(
    deletedMemberWasAk.docs.map(async (doc) => {
      const adingRef = doc.data().ading;
      return adingRef.update({
        aks: fb.firestore.FieldValue.increment(-1),
      });
    })
  );

  // Update `ading` field in member documents who had the deleted member as an ading
  await Promise.all(
    deletedMemberWasAding.docs.map(async (doc) => {
      const akRef = doc.data().ak;
      return akRef.update({
        adings: fb.firestore.FieldValue.increment(-1),
      });
    })
  );

  // Delete the pairings
  deletedMemberWasAk.forEach(
    async (pairing) => await deletePairing(pairing.id)
  );
  deletedMemberWasAding.forEach(
    async (pairing) => await deletePairing(pairing.id)
  );

  // Delete member from database
  await memberRef.delete();

  return {
    success: true,
    message: 'Member was successfully deleted',
    member: memberResponse,
  };
};
