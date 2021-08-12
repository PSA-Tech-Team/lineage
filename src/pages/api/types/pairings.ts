import { Pairing } from '../../../fixtures/Pairings';

export type CreatePairingResult = {
  success: boolean;
  message: string;
  pairing?: Pairing | undefined;
};
