import { Pairing } from '../fixtures/Pairings';
import { PairingApiResult } from '../pages/api/types/pairings';

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
  const result: PairingApiResult = await response.json();
  return result;
};

const updatePairing = async (updatedPairing: Pairing) => {
  const response = await fetch(`/api/pairings`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(updatedPairing),
  });
  const result: PairingApiResult = await response.json();
  return result;
};

const deletePairing = async (pairingId: string) => {
  const response = await fetch(`/api/pairings`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ id: pairingId }),
  });
  const result: PairingApiResult = await response.json();
  return result;
};

export { addPairing, updatePairing, deletePairing };
