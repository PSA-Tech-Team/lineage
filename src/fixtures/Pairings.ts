import { Member } from './Members';

/**
 * Represents a pairing between an Ate/Kuya and Ading
 */
export interface Pairing {
  id: string;
  ak: Member;
  ading: Member;
  semesterAssigned?: string | undefined;
}

/**
 * Structure to represent node in `react-d3-tree`
 */
export interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string>;
  children?: RawNodeDatum[];
}

/**
 * Map from a member's id to their information
 * https://stackoverflow.com/questions/36467469/is-key-value-pair-available-in-typescript
 */
interface MemberMap {
  [key: string]: Member;
}

/**
 * Converts the `Member[]` to a map (`Object`) of `Member` indexed by their `id`
 * @param members array of Members from Firebase
 */
export function getMembersMap(members: Member[]) {
  const membersMap: MemberMap = {};

  for (const member of members) {
    membersMap[member.id] = member;
  }

  return membersMap;
}

/**
 * Constructs the lineage tree of a Member
 * @param id id of Member to construct lineage for
 * @param members array of Members from Firebase
 * @param pairings array of Pairings from Firebase
 * @param searchAdings true to search for adings, false to search for AKs
 */
export function getLineage(
  id: string,
  members: Member[],
  pairings: Pairing[],
  searchAdings: boolean
): RawNodeDatum {
  const memberMap: MemberMap = getMembersMap(members);
  const root = memberMap[id];
  const lineage = convertMemberToNode(root, pairings, searchAdings);
  return lineage;
}

/**
 * Constructs a `RawNodeDatum` from a given `Member` and the pairings
 * @param member member to convert
 * @param pairings array of pairings from Firebase
 * @param searchDown true to search for adings, false to search for AKs
 */
export function convertMemberToNode(
  member: Member,
  pairings: Pairing[],
  searchDown: boolean
): RawNodeDatum {
  const children: RawNodeDatum[] = [];

  const hasAdings = Boolean(member.adings);
  const hasAks = Boolean(member.aks);
  
  // Find all adings/AKs of member if they have any
  const shouldSearch = Boolean(searchDown ? hasAdings : hasAks);
  if (shouldSearch) {
    for (const { ak, ading } of pairings) {
      // Check if the member is an AK / ading, depending on search direction
      const inPairing = searchDown ? member.id === ak.id : member.id === ading.id;

      // If member is in pair, add their ading / AK
      if (inPairing) {
        const memberToSearch = searchDown ? ading : ak;
        children.push(convertMemberToNode(memberToSearch, pairings, searchDown));
      }
    }
  }

  // Turn Member into data for Tree
  const node: RawNodeDatum = {
    name: member.name,
    attributes: {
      Class: member.classOf,
    },
    // Only add `children` (adings) array if there are any adings
    children: children.length ? children : undefined,
  };

  return node;
}
