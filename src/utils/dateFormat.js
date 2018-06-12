const monthTable = {
  0: ['January', 'Jan'],
  1: ['February', 'Feb'],
  2: ['March', 'Mar'],
  3: ['April', 'Apr'],
  4: ['May', 'May'],
  5: ['June', 'Jun'],
  6: ['July', 'Jul'],
  7: ['August', 'Aug'],
  8: ['September', 'Sep'],
  9: ['October', 'Oct'],
  10: ['November', 'Nov'],
  11: ['December', 'Dec'],
};

export const makeTextualMonth = (dateObj, fullLength = true) => {
  const rawMonth = dateObj.getMonth();

  return fullLength ? monthTable[rawMonth][0] : monthTable[rawMonth][1];
};

export const makeZeroedHours = (dateObj) => {
  const rawHours = dateObj.getHours();

  return rawHours < 10 ? `0${rawHours}` : rawHours;
};

export const makeZeroedMinutes = (dateObj) => {
  const rawMinutes = dateObj.getMinutes();

  return rawMinutes < 10 ? `0${rawMinutes}` : rawMinutes;
};
