import type { NextApiRequest, NextApiResponse } from 'next';
import { addMember, deleteMember, getMembers, updateMember } from '../../firebase/member';
import { Member } from '../../fixtures/Members';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return await apiGetMembers(res);
    case 'POST':
      return await apiCreateMember(req, res);
    case 'PUT':
      return await apiUpdateMember(req, res);
    case 'DELETE':
      return await apiDeleteMember(req, res);
    default:
      return res.status(501).send({});
  }
};

const apiGetMembers = async (res: NextApiResponse) => {
  const members = await getMembers();
  return res.status(200).json(members);
};

const apiCreateMember = async (req: NextApiRequest, res: NextApiResponse) => {
  const values = await req.body;
  await addMember(values);
  return res.status(200).send({});
}

const apiUpdateMember = async (req: NextApiRequest, res: NextApiResponse) => {
  const member: Member = await req.body;
  await updateMember(member);
  return res.status(200).send({});
}

const apiDeleteMember = async (req: NextApiRequest, res: NextApiResponse) => {
  // Delete a single member
  const memberId: string = await req.body.id;
  let status: number;

  if (memberId) {
    await deleteMember(memberId);
    status = 200;
  } else {
    status = 500;
  }

  // Send response
  return res.status(status).send({});
};
