const seasons = ['Spring', 'Fall'];
const years = [2017, 2018, 2019, 2020, 2021];

const makeSemesters = () => {
  const semesters = [];
  for (const year of years) {
    for (const season of seasons) {
      semesters.push(`${season} ${year}`);
    }
  }
  return semesters;
};

export const SEMESTERS = makeSemesters();
