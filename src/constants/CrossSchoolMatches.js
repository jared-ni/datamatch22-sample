// A list of pairs of schools that can cross match with each other.
const crossSchoolPairs = [
  ['UCLA', 'Caltech'],
  ['Columbia', 'FIT'],
];

// Returns true if students from that college can opt into cross matches.
export function hasCrossSchoolMatches(collegeName) {
  for (let i = 0; i < crossSchoolPairs.length; i++) {
    for (let j = 0; j < crossSchoolPairs[i].length; j++) {
      if (crossSchoolPairs[i][j] === collegeName) {
        return true;
      }
    }
  }
  return false;
}

// Returns the name of the college that students from the input college can cross match with.
export function getPartnerSchool(collegeName) {
  for (let i = 0; i < crossSchoolPairs.length; i++) {
    for (let j = 0; j < crossSchoolPairs[i].length; j++) {
      if (crossSchoolPairs[i][j] === collegeName) {
        return crossSchoolPairs[i][1 - j];
      }
    }
  }
  return null;
}
