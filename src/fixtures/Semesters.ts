const seasons = ['Spring', 'Fall'];
export const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const makeSemesters = () => {
  const semesters = [];
  for (const year of YEARS) {
    for (const season of seasons) {
      semesters.push(`${season} ${year}`);
    }
  }
  return semesters;
};

export const SEMESTERS = makeSemesters();
