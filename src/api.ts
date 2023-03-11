const BASE_API = 'https://dummyjson.com';

export const searchUsers = async (query: string) => {
    const url = new URL(`${BASE_API}/users/search`);
    url.searchParams.append('q', query);
    const response = await fetch(url);
    return (await response.json()) as { users: { id: string; firstName: string; lastName: string }[] };
 };
