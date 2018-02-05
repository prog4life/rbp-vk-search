const countSearchProgressInPercents = ({ total, processed }) => {
  if (Number.isInteger(total) && Number.isInteger(processed)) {
    // return Number(((processed / total) * 100).toFixed());
    return Math.round(((processed / total) * 100));
  }
  return undefined;
};

export default countSearchProgressInPercents;
