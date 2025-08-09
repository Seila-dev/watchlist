import { createContext, useState, useEffect, useCallback } from "react";
import { setCookie, destroyCookie } from "nookies";
import { User } from "@/types/userData";
import { useRouter } from "next/navigation";
import { getClientToken } from "@/hooks/useApi";
import { toast } from "sonner";

type FormData = {
  email: string;
  password: string;
};

type FormDataRegister = {
  email: string;
  password: string;
  username: string;
};

type EmailVerificationState = {
  email: string;
  isVerifying: boolean;
  counter: number;
  code: string;
};

type authContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  emailVerification: EmailVerificationState;
  signIn: (data: FormData) => Promise<void>;
  registerAccount: (data: FormDataRegister) => Promise<void>;
  signOut: () => void;
  reloadUser: () => Promise<void>;
  // Email verification methods
  sendVerificationCode: (email: string) => Promise<void>;
  validateVerificationCode: (email: string, code: string) => Promise<void>;
  setVerificationCode: (code: string) => void;
  resetVerification: () => void;
  resendVerificationCode: () => Promise<void>;
};

export const AuthContext = createContext({} as authContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [emailVerification, setEmailVerification] = useState<EmailVerificationState>({
    email: "",
    isVerifying: false,
    counter: 0,
    code: ""
  });

  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const redirectURL = process.env.NEXT_PUBLIC_REDIRECT_URL;
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'watchlist.token';
  const API_BASE_URL = (baseURL || "").replace(/\/+$/, "");
  const router = useRouter();

  const isAuthenticated = !!user;

  const validateVerificationCode = useCallback(async (email: string, code: string) => {
    setEmailVerification(prev => ({
      ...prev,
      isVerifying: true
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-verification-code`, {
        method: "POST",
        body: JSON.stringify({ email, code }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        toast.error("Código fornecido inválido.");
        setEmailVerification(prev => ({
          ...prev,
          code: "",
          isVerifying: false
        }));
        return;
      }

      const pathname = window.location.pathname;

      if (pathname.startsWith("/register/validate-code")) {
        router.push("/login");
        toast.success("Código confirmado, realize seu login!");
      } else if (pathname.startsWith("/reset-password")) {
        router.push("/reset-password/new-password");
        toast.success("Código confirmado, altere sua senha!");
      } else {
        router.push("/");
        toast.success("Email verificado com sucesso!");
      }

      // Clear verification state on success
      resetVerification();

    } catch (err) {
      console.error(err);
      toast.warning("Código inválido. Tente novamente.");
      setEmailVerification(prev => ({
        ...prev,
        code: ""
      }));
    } finally {
      setEmailVerification(prev => ({
        ...prev,
        isVerifying: false
      }));
    }
  }, [API_BASE_URL, router]);

  // Timer effect for verification countdown
  useEffect(() => {
    if (emailVerification.counter === 0) return;

    const timer = setInterval(() => {
      setEmailVerification(prev => ({
        ...prev,
        counter: prev.counter - 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [emailVerification.counter]);

  // Auto-validate when code reaches 6 digits
  useEffect(() => {
    if (emailVerification.code.length === 6 && !emailVerification.isVerifying && emailVerification.email) {
      validateVerificationCode(emailVerification.email, emailVerification.code);
    }
  }, [emailVerification.code, emailVerification.email, emailVerification.isVerifying, validateVerificationCode]);

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
      const redirectTo = urlParams.get('redirect') || redirectURL;

      if (redirectTo) {
        router.push(redirectTo);
      }

    } catch (error: any) {
      console.error('Something went wrong on sign in', error);
      throw error;
    }
  };

  const registerAccount = async ({ email, password, username}: FormDataRegister) => {
    const url = `${baseURL}/users/`;

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error);
      }

      const response = await request.json();

      // After successful registration, initiate email verification
      setEmailVerification(prev => ({
        ...prev,
        email: email
      }));

      // Auto-send verification code after registration
      await sendVerificationCode(email);

      toast.success("Conta criada com sucesso! Verifique seu email para continuar.");

    } catch (error: any) {
      console.error('Error on sign up', error);
      throw error;
    }
  };

  const signOut = useCallback(() => {
    destroyCookie(null, cookieName);
    setUser(null);
    resetVerification();
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

  // Email verification methods
  const sendVerificationCode = async (email: string) => {
    setEmailVerification(prev => ({
      ...prev,
      isVerifying: true,
      email: email
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`.replace(/([^:]\/)\/+/g, "$1"), {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar código");
      }

      toast.success("Código enviado para o e-mail!");

      setEmailVerification(prev => ({
        ...prev,
        counter: 30,
        code: ""
      }));

      // Store in sessionStorage to prevent duplicate sends
      if (typeof window !== 'undefined') {
        const storageKey = `codeSentFor_${email}`;
        sessionStorage.setItem(storageKey, "true");
      }

    } catch (err) {
      console.error(err);
      toast.error("Não foi possível enviar o código. Tente novamente.");
      setEmailVerification(prev => ({
        ...prev,
        code: ""
      }));
    } finally {
      setEmailVerification(prev => ({
        ...prev,
        isVerifying: false
      }));
    }
  };



  const resendVerificationCode = async () => {
    if (emailVerification.counter > 0 || !emailVerification.email) return;
    await sendVerificationCode(emailVerification.email);
  };

  const setVerificationCode = (code: string) => {
    setEmailVerification(prev => ({
      ...prev,
      code: code
    }));
  };

  const resetVerification = () => {
    setEmailVerification({
      email: "",
      isVerifying: false,
      counter: 0,
      code: ""
    });
  };

  useEffect(() => {
    loadUserFromCookies();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      emailVerification,
      signIn,
      registerAccount,
      signOut,
      reloadUser: loadUserFromCookies,
      sendVerificationCode,
      validateVerificationCode,
      setVerificationCode,
      resetVerification,
      resendVerificationCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};