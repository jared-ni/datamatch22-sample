// Retrieves JSON given a file URL
export const getJSON = async url => {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (e) {
    throw e;
  }
};

export const getCSV = async url => {
  try {
    const res = await fetch(url);
    return await res.text();
  } catch (e) {
    throw e;
  }
};
