import { Member } from '../../../fixtures/Members';

export type MemberApiResult = {
  success: boolean;
  message: string;
  member?: Member | undefined;
};
