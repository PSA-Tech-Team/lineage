import { Member } from '../fixtures/Members';
import firebase from './config';

const db = firebase.firestore();

export const addMember = async (member: Member) => {
  const collection = db.collection('members');
  const result = await collection.add(member);
  return result;
};

export const getMembers = async () => {
  let collection = db.collection('members');
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

export const updateMember = async (member: Member) => {
  const doc = db.collection('members').doc(member.id);

  await doc.get().then((d) => {
    if (d.exists) {
      doc.update(member);
    }
  });
};
