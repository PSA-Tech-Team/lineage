import { MemberApiResult } from '../pages/api/types/members';

const MEMBERS_ENDPOINT = '/api/members';

const addMember = async (
  name: string,
  classOf: string,
  adings: number = 0,
  aks: number = 0
) => {
  const response = await fetch(MEMBERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      name,
      classOf,
      adings,
      aks,
    }),
  });
  const result: MemberApiResult = await response.json();
  return result;
};

const deleteMember = async (memberId: string) => {
  const response = await fetch(`/api/members`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ id: memberId }),
  });

  const result: MemberApiResult = await response.json();
  return result;
};

export { addMember, deleteMember };
