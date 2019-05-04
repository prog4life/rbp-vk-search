export const delay = ms => (
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  })
);

export const delayedReturn = time => value => (
  delay(time).then(() => value)
);
