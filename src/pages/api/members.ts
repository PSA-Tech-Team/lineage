import type { NextApiRequest, NextApiResponse } from 'next';
import { getMembers } from '../../firebase/member';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const members = await getMembers();
    res.status(200).json(members);
  } else {
    res.status(501);
  }
};
