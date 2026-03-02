import type { NextApiRequest, NextApiResponse } from 'next';
import {
  addMember,
  deleteMember,
  getAllMembers,
  getMembers,
  updateMember,
} from '../../firebase/member';
import { Member } from '../../fixtures/Members';
import { MemberApiResult } from './types/members';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return await apiGetMembers(req, res);
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

const apiGetMembers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { classOf } = req.query;
    let members: Member[] = [];
    if (typeof classOf === 'string') {
      members = await getMembers(classOf);
    } else {
      members = await getAllMembers();
    }
    return res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return res.status(500).json({ error: 'Failed to fetch members' });
  }
};

const apiCreateMember = async (
  req: NextApiRequest,
  res: NextApiResponse<MemberApiResult>
) => {
  try {
    const values = await req.body;
    const result: MemberApiResult = await addMember(values);
    const status = result.success ? 200 : 500;
    return res.status(status).send(result);
  } catch (error) {
    console.error('Error creating member:', error);
    return res.status(500).json({ success: false, message: 'Failed to create member' } as MemberApiResult);
  }
};

const apiUpdateMember = async (
  req: NextApiRequest,
  res: NextApiResponse<MemberApiResult>
) => {
  try {
    const member: Member = await req.body;
    const result = await updateMember(member.id, member);
    const status = result.success ? 200 : 500;
    return res.status(status).send(result);
  } catch (error) {
    console.error('Error updating member:', error);
    return res.status(500).json({ success: false, message: 'Failed to update member' } as MemberApiResult);
  }
};

const apiDeleteMember = async (
  req: NextApiRequest,
  res: NextApiResponse<MemberApiResult>
) => {
  try {
    // Delete a single member
    const memberId: string = await req.body.id;
    const result: MemberApiResult = await deleteMember(memberId);
    const status = result.success ? 200 : 500;
    // Send response
    return res.status(status).send(result);
  } catch (error) {
    console.error('Error deleting member:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete member' } as MemberApiResult);
  }
};
