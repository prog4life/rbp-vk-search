// export {parse as parseHash};
export default function handleHash(hash) {
    if (!hash) {
        return false;
        // throw new Error('Hash is empty');
    }

    const parsedHash = parse(hash);

    if (!parsedHash.access_token) {
        handleNoToken(parsedHash);
    }
    // TODO: try pushState or replaceState
    window.location.hash = '';
    // testHash = '';
    return parsedHash;
}

// var testHash = 'access-token=0&error=value&=kedi&414&blabla=&fal=false';

function handleNoToken(parsedHash) {
    const errorFromHash = parsedHash.error;

    const errorMessage = errorFromHash
        ? `Token request error: ${errorFromHash}. ${parsedHash.errorDesc}.`
        : 'Failed to extract token data from hash';
// TODO: hidded for testing
    // alert('Authorization failed. Try to reload page later');
    console.error('Authorization failed. Try to reload page later');
    throw new Error(errorMessage);
}

// let parsedTestHash = handleHash(testHash);

// if (parsedTestHash) {
//     Object.keys(parsedTestHash).forEach((item) => {
//         console.log('parsedTestHash key: ', item, 'parsedTestHash value: ',
//             parsedTestHash[item]);
//     });
//     console.table(parsedTestHash);
//     console.log('testHash: ', testHash);
// } else {
//     console.log('parsedTestHash value: ', parsedTestHash);
// }

function parse(hash) {
    if (!hash || typeof hash !== 'string') {
        throw new Error('Failed to parse hash, not empty string is required');
    }
// TODO: consider need to use decodeUriComponent
    const hashChunks = hash.split('&');
    const result = {};

    hashChunks.forEach((chunk) => {
        /* eslint consistent-return: "off" */
        const [key, value] = chunk.split('=');

// TODO: consider saving empty string value
        if (!key || !value) {
            return false;
        }
        result[key] = value;
    });

    return result;
}