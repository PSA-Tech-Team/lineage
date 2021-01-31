import { Member, PSA_MEMBERS_WITH_IDS as members } from './Members';

/**
 * Represents a pairing between an Ate/Kuya and Ading
 */
export interface Pairing {
  akId: string;
  adingId: string;
}

/**
 * All AKA pairings
 */
export const PAIRINGS: Pairing[] = [
  [0, 2], // Neil -> Renzo
  [1, 2], // Charles's adings
  [1, 6],
  [1, 10],
  [1, 14],
  [1, 21],
  [1, 25],
  [1, 26],
  [1, 27],
  [2, 3], // Renzo's adings
  [2, 4],
  [2, 5],
  [6, 4], // Marielle's adings
  [6, 7],
  [6, 8],
  [6, 9],
  [10, 11], // Danielle's adings
  [10, 12],
  [10, 13],
  [14, 15], // Tina's adings
  [14, 16],
  [14, 17],
  [21, 22], // Inhoo's adings
  [21, 23],
  [21, 24],
  [18, 1], // Erica -> Charles
  [19, 1], // Ronell -> Charles
  [20, 1], // Joey -> Charles
  [19, 0], // Ronell -> Neil
  [28, 0], // Michael -> Neil
].map((pair) => ({ akId: pair[0].toString(), adingId: pair[1].toString() }));

export interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string>;
  children?: RawNodeDatum[];
}

export function getLineage(id: number, searchAdings: boolean): RawNodeDatum {
  const root = members[id];
  return memberToNode(root, searchAdings);
}

export function memberToNode(
  member: Member,
  searchDown: boolean
): RawNodeDatum {
  const children: RawNodeDatum[] = [];

  // Find all adings/AKs of member if they have any
  const shouldSearch = Boolean(searchDown ? member.hasAdings : member.hasAks);
  if (shouldSearch) {
    for (const { akId, adingId } of PAIRINGS) {
      // Check if the member is an AK / ading, depending on search direction
      const inPairing = searchDown ? member.id === akId : member.id === adingId;

      // If member is in pair, add their ading / AK
      if (inPairing) {
        const searchId = searchDown ? adingId : akId;
        // FIXME: fix this probably
        children.push(memberToNode(members[parseInt(searchId)], searchDown));
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
