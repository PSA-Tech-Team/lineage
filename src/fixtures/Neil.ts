export const NEIL_LINEAGE = {
  name: 'Neil',
  attributes: { Class: "Crew '22" },
  children: [
    {
      name: 'Renzo',
      attributes: { Class: '23&me' },
      children: ['Alyssa', 'Dre', 'Kurt'].map((name) => ({
        name,
        attributes: { Class: '24K Magic' },
      })),
    },
  ],
};
