import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getPairings,
  addPairing,
  updatePairing,
  deletePairing,
} from '../../firebase/pairings';
import { Pairing } from '../../fixtures/Pairings';
import { PairingApiResult } from './types/pairings';

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
};

const apiCreatePairing = async (
  req: NextApiRequest,
  res: NextApiResponse<PairingApiResult>
) => {
  const { akId, adingId, semester } = req.body;
  const result: PairingApiResult = await addPairing(akId, adingId, semester);
  const status = result.success ? 200 : 400;

  return res.status(status).send(result);
};

const apiUpdatePairing = async (
  req: NextApiRequest,
  res: NextApiResponse<PairingApiResult>
) => {
  const updatedPairing: Pairing = req.body;
  const result = await updatePairing(updatedPairing.id, updatedPairing);
  const status = result.success ? 200 : 500;
  return res.status(status).send(result);
};

const apiDeletePairing = async (
  req: NextApiRequest,
  res: NextApiResponse<PairingApiResult>
) => {
  const { id: pairingId } = req.body;
  const result = await deletePairing(pairingId);
  const status = result.success ? 200 : 500;
  return res.status(status).send(result);
};
