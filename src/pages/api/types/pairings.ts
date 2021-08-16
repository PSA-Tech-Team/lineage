import { Pairing } from '../../../fixtures/Pairings';

export type PairingApiResult = {
  success: boolean;
  message: string;
  pairing?: Pairing | undefined;
};
