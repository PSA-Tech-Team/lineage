import type { NextApiRequest, NextApiResponse } from 'next';
import { getPairings } from '../../firebase/pairings';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const pairings = await getPairings();
    res.status(200).json(pairings);
  } else {
    res.status(501);
  }
};
