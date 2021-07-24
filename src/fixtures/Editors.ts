export const EDITORS = [
  'renzol2@illinois.edu',
];

export const isEditor = (email: string) => {
  return EDITORS.some((e: string) => e === email);
};

export const isBoardMember = (email: string) => {
  return email.endsWith('@psauiuc.org');
}
