const seasons = ['Spring', 'Fall'];
const MIN_YEAR = 2020;
const MAX_YEAR = 3000;
export const YEARS = [...Array(MAX_YEAR - MIN_YEAR + 1).keys()].map(
  (year) => year + MIN_YEAR
);

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
