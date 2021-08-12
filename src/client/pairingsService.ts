import { CreatePairingResult } from "../pages/api/types/pairings";

const PAIRINGS_ENDPOINT = '/api/pairings';

const addPairing = async (akId: string, adingId: string, semester: string) => {
  const response = await fetch(PAIRINGS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      akId,
      adingId,
      semester,
    }),
  });
  const result: CreatePairingResult = await response.json();
  return result;
};

export { addPairing };
