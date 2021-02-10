import type { NextApiRequest, NextApiResponse } from 'next';
import { getPairings, addPairing, updatePairing, deletePairing } from '../../firebase/pairings';
import { Pairing } from '../../fixtures/Pairings';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return await apiGetPairings(res);
    case 'POST':
      return await apiCreatePairing(req, res);
    case 'PUT':
      return await apiUpdatePairing(req, res);
    case 'DELETE':
      return await apiDeletePairing(req, res);
    default:
      return res.status(501).send({});
  }
};

const apiGetPairings = async (res: NextApiResponse) => {
  const pairings = await getPairings();
  return res.status(200).json(pairings);
}

const apiCreatePairing = async (req: NextApiRequest, res: NextApiResponse) => {
  const { akId, adingId, semester } = req.body;
  await addPairing(akId, adingId, semester);
  return res.status(200).send({});
}

const apiUpdatePairing = async (req: NextApiRequest, res: NextApiResponse) => {
  const updatedPairing: Pairing = req.body;
  await updatePairing(updatedPairing);
  return res.status(200).send({});
}

const apiDeletePairing = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: pairingId } = req.body;
  await deletePairing(pairingId);
  return res.status(200).send({});
}
