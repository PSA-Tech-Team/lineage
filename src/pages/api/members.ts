import type { NextApiRequest, NextApiResponse } from 'next';
import {
  addMember,
  deleteMember,
  getMembers,
  updateMember,
} from '../../firebase/member';
import { Member } from '../../fixtures/Members';
import { MemberApiResult } from './types/members';

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

const apiCreateMember = async (
  req: NextApiRequest,
  res: NextApiResponse<MemberApiResult>
) => {
  const values = await req.body;
  const result: MemberApiResult = await addMember(values);
  const status = result.success ? 200 : 500;

  return res.status(status).send(result);
};

const apiUpdateMember = async (req: NextApiRequest, res: NextApiResponse) => {
  const member: Member = await req.body;
  await updateMember(member);
  return res.status(200).send({});
};

const apiDeleteMember = async (
  req: NextApiRequest,
  res: NextApiResponse<MemberApiResult>
) => {
  // Delete a single member
  const memberId: string = await req.body.id;

  const result: MemberApiResult = await deleteMember(memberId);
  const status = result.success ? 200 : 500;

  // Send response
  return res.status(status).send(result);
};
