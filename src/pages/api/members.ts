import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteMember, getMembers } from '../../firebase/member';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // Return all members
    const members = await getMembers();
    return res.status(200).json(members);
  } else if (req.method === 'DELETE') {
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
  } else {
    // Not a valid request
    return res.status(501);
  }
};
