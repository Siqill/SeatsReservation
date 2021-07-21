export function request(url, method = "GET", body = null) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body
    });
}