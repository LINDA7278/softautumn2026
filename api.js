const API = 'https://vectorsigma.org/briefer/api/v1';
const CUSTOMER = 3;

async function getJSON(url) {
    for (let attempt = 0; attempt < 3; attempt++) {
        const response = await fetch(url);

        if (response.status === 429) {
            if (attempt === 2) {
                throw new Error('The server is busy. Please try again later.');
            }

            const seconds = Number(
                response.headers.get('Retry-After') || 2
            );

            await new Promise(resolve =>
                setTimeout(resolve, seconds * 1000)
            );

            continue;
        }

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return await response.json();
    }
}

export async function getCustomer() {
    const url = new URL(`${API}/customer`);
    url.searchParams.set('customer', CUSTOMER);

    return getJSON(url);
}

export async function getGigs(cursor = null) {
    const url = new URL(`${API}/items`);
    url.searchParams.set('customer', CUSTOMER);

    if (cursor) {
        url.searchParams.set('cursor', cursor);
    }

    return getJSON(url);
}