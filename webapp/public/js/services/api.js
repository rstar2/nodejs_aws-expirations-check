// eslint-disable-next-line
const api = (url, data) => {
    // if sending data as JSON body must be JSON encoded string
    // AND !!! 'Content-Type' header must be valid JSON one
    const opts = data && {
        method: 'POST',
        body: JSON.stringify(data),

        // !!! this is obligatory for JSON encoded data so that the Express 'body-parser' to parse it properly
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(url, opts)
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => Promise.reject(err));
            }
            return res;
        })
        .then(res => res.json());
};
