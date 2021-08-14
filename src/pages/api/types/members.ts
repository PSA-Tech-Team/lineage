import { Member } from '../../../fixtures/Members';

export type CreateMemberResult = {
  success: boolean;
  message: string;
  member?: Member | undefined;
};
