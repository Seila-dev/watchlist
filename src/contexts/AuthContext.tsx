import { createContext, useState, useEffect, useCallback } from "react";
import { setCookie, destroyCookie } from "nookies";
import { User } from "@/types/userData";
import { useRouter } from "next/navigation";
import { getClientToken } from "@/hooks/useApi";

type FormData = {
  email: string;
  password: string;
};

type FormDataRegister = {
  email: string;
  password: string;
  username: string;
  lastname?: string;
};

type authContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (data: FormData) => Promise<void>;
  registerAccount: (data: FormDataRegister) => Promise<void>;
  signOut: () => void;
  reloadUser: () => Promise<void>;
};

export const AuthContext = createContext({} as authContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const redirectURL = process.env.NEXT_PUBLIC_REDIRECT_URL;
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'watchlist.token';
  const router = useRouter();

  const isAuthenticated = !!user;

  const signIn = async ({ email, password }: FormData) => {
    const url = `${baseURL}/users/login`;

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const response = await request.json();

      if (!request.ok) {
        throw new Error(response.message || "Invalid email or password");
      }

      setCookie(null, cookieName, response.token, {
        maxAge: 60 * 60 * 12, // 12h
        path: '/',
        sameSite: 'lax',
      });

      setUser(response.user);

      const urlParams = new URLSearchParams(window.location.search);

      urlParams.get('redirect') || redirectURL;

    } catch (error: any) {
      console.error('Something went wrong on sign in', error);
      throw error;
    }
  };

  const registerAccount = async ({ email, password, username, lastname }: FormDataRegister) => {
    const url = `${baseURL}/users/`;

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, lastname }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error);
      }

      const response = await request.json();

      setCookie(null, `${cookieName}`, response.token, {
        maxAge: 60 * 60 * 4,
        path: '/',
        sameSite: 'lax',
      });

      setUser(response.user);

      router.push('/login');
    } catch (error: any) {
      console.error('Error on sign up', error);
    }
  };

  const signOut = useCallback(() => {
    destroyCookie(null, cookieName);
    setUser(null);
    router.push("/login");
  }, [router]);

  const loadUserFromCookies = async () => {
    const token = getClientToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);

        if (window.location.pathname === '/login') {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirect');
          if (redirectTo && redirectTo !== '/login') {
            router.replace(redirectTo);
          }
        }
      } else {
        destroyCookie(null, cookieName);
      }
    } catch (err) {
      console.error('Error trying to load user', err);
      destroyCookie(null, cookieName);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromCookies();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      signIn,
      registerAccount,
      signOut,
      reloadUser: loadUserFromCookies
    }}>
      {children}
    </AuthContext.Provider>
  );
};