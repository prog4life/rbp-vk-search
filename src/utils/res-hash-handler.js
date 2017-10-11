export function parseHash(hash) {
  if (!hash) {
    return false;
  }
  if (typeof hash !== 'string') {
    console.error('Expected hash value to be string');
    return false;
  }
  // TODO: consider using decodeUriComponent
  const hashChunks = hash.split('&');
  const result = {};

  hashChunks.forEach((chunk) => {
    /* eslint consistent-return: "off" */
    const [key, value] = chunk.split('=');

    // TODO: consider saving empty string value
    if (!key || value.length < 1) {
      return;
    }
    result[key] = value;
  });

  return result;
}

// var testHash = 'access-token=0&error=value&=kedi&414&blabla=&fal=false';
/* eslint camelcase: "off" */
export function handleErrorHash({error, error_description}) {
  const errorMessage = `Token request error: ${error}. ${error_description}.`;

  console.error(errorMessage);
}
