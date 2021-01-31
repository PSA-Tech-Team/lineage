/**
 * Represents a single PSA member
 */
export interface Member {
  id?: number;
  name: string;
  classOf: string;
  hasAdings: boolean;
  hasAks?: boolean;
}

/**
 * Array of all PSA members
 */
export const PSA_MEMBERS: Member[] = [
  { name: 'Neil', classOf: '2022', hasAdings: true },
  { name: 'Charles', classOf: '2022', hasAdings: true },
  { name: 'Renzo', classOf: '2023', hasAdings: true },
  { name: 'Alyssa', classOf: '2024', hasAdings: false },
  { name: 'Dre', classOf: '2024', hasAdings: false },
  { name: 'Kurt', classOf: '2024', hasAdings: false },
  { name: 'Marielle', classOf: '2023', hasAdings: true },
  { name: 'Sabrina', classOf: '2024', hasAdings: false },
  { name: 'Kaitlin', classOf: '2024', hasAdings: false },
  { name: 'Adrian', classOf: '2024', hasAdings: false },
  { name: 'Danielle', classOf: '2023', hasAdings: true },
  { name: 'Jericho', classOf: '2024', hasAdings: false },
  { name: 'Adrian', classOf: '2024', hasAdings: false },
  { name: 'Arienne', classOf: '2024', hasAdings: false },
  { name: 'Tina', classOf: '2023', hasAdings: true },
  { name: 'Matthew', classOf: '2024', hasAdings: false },
  { name: 'Andreen', classOf: '2024', hasAdings: false },
  { name: 'Jamie', classOf: '2024', hasAdings: false },
  { name: 'Erica', classOf: '2021', hasAdings: true },
  { name: 'Ronell', classOf: '2021', hasAdings: true },
  { name: 'Joey', classOf: '2021', hasAdings: true },
  { name: 'Inhoo', classOf: '2023', hasAdings: true },
  { name: 'Rachel', classOf: '2024', hasAdings: false },
  { name: 'Gary', classOf: '2024', hasAdings: false },
  { name: 'Abbie', classOf: '2024', hasAdings: false },
  { name: 'Kim', classOf: '2023', hasAdings: false },
  { name: 'Angela', classOf: '2023', hasAdings: false },
  { name: 'Emil', classOf: '2023', hasAdings: false },
  { name: 'Michael', classOf: '2021', hasAdings: true },
];

/**
 * All PSA members with unique IDs
 */
export const PSA_MEMBERS_WITH_IDS: Member[] = PSA_MEMBERS.map((member, id) => ({
  id,
  ...member,
  // FIXME: temporary: '21 folks won't have Aks for now
  hasAks: member.classOf !== '2021'
}));
