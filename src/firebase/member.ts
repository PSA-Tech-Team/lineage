import { Member } from '../fixtures/Members';
import firebase from './config';

export const addMember = async (member: Member) => {
  const db = firebase.firestore();
  const collection = db.collection('members');
  const result = await collection.add(member);
  return result;
};

export const getMembers = async () => {
  let collection = firebase.firestore().collection('members');
  let members: Member[] = [];

  await collection.get().then((snapshot) => {
    let docs = snapshot.docs;

    for (let member of docs) {
      const { name, classOf, hasAdings, hasAks } = member.data();

      members.push({
        id: member.id,
        name,
        classOf,
        hasAdings,
        hasAks,
      });
    }
  });

  return members;
};
