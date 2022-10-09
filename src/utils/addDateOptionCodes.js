// Returns a function that updates the corresponding profile fields in the database given data
export const addDateOptionCodes = update => {
  return ({ dateOptionId, codes }) => {
    // Create node for each code
    let code_nodes = {};
    codes.forEach(code => {
      code_nodes[code] = false;
    });

    // Push updates to database
    let updates = {};
    updates[`code/${dateOptionId}`] = JSON.stringify(code_nodes);
    update('/', updates);
  };
};
