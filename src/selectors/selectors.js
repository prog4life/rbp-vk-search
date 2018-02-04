const countSearchProgressInPercents = ({ count, processed }) => (
  Number(((processed / count) * 100).toFixed()) || undefined
);

export default countSearchProgressInPercents;