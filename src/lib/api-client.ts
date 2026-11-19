export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function request<T>(path: string, init?: RequestInit): Promise<{
  data: T; headers: Headers }> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiError('Can\'t reach the server. Is the mock API running (npm run api)?', 0);
  }
  if (!res.ok) {
    const message = res.status === 404 ? 'We couldn\'t find that task.' : `Request failed (${res.status}).`;
    throw new ApiError(message, res.status);
  }
  const data = (res.status === 204 ? undefined : await res.json()) as T;
  return { data, headers: res.headers };
}