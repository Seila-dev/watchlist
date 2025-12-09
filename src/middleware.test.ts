import { proxy } from './proxy';
import { NextResponse } from 'next/server';

jest.mock('next/server', () => {
  return {
    NextResponse: {
      redirect: jest.fn((url: any) => ({
        type: 'redirect',
        url,
        cookies: {
          delete: jest.fn(), 
        },
      })),
      next: jest.fn(() => ({ type: 'next' })),
    },
  };
});


const createRequest = (options: {
  url?: string;
  token?: string | null;
}) => {
  const cookies = new Map();
  if (options.token) cookies.set('watchlist.token', { value: options.token });

  const url = new URL(options.url || 'http://localhost/home');

  return {
    cookies: {
      get: (key: string) => cookies.get(key),
      delete: jest.fn(),
    },
    nextUrl: {
        ...url,
        clone: () => new URL(url.toString()),
        pathname: url.pathname,
    },
    url: url.toString(),
  } as any;
};

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('redirects to /login if no token and path starts with /home', async () => {
    const request = createRequest({ url: 'http://localhost/home' });
    const response = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    );
    expect(response.type).toBe('redirect');
  });

  it('redirects to /register if no token and path starts with /register/create-username', async () => {
    const request = createRequest({ url: 'http://localhost/register/create-username' });
    const response = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/register' })
    );
    expect(response.type).toBe('redirect');
  });

  it('redirects to /login if token is invalid (fetch not ok)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    const request = createRequest({ url: 'http://localhost/home', token: 'abc' });
    const response = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/login' })
    );
    expect(response.type).toBe('redirect');
  });

  it('redirects to /register/create-username if user has no username', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { username: '' } }),
    });
    const request = createRequest({ url: 'http://localhost/home', token: 'abc' });
    const response = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/register/create-username' })
    );
    expect(response.type).toBe('redirect');
  });

  it('redirects to /home if user has username and tries to access /login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { username: 'joao' } }),
    });
    const request = createRequest({ url: 'http://localhost/login', token: 'abc' });
    const response = await proxy(request);

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/home' })
    );
    expect(response.type).toBe('redirect');
  });

  it('calls NextResponse.next if everything is fine', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { username: 'joao' } }),
    });
    const request = createRequest({ url: 'http://localhost/home', token: 'abc' });
    const response = await proxy(request);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response.type).toBe('next');
  });
});
