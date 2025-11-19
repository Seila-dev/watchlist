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
  name: string;
  password: string;
  username?: string;
};

type EmailVerificationState = {
  email: string;
  isVerifying: boolean;
  counter: number;
  code: string;
};

type CreateUsernameParams = {
  username: string;
}

export type authContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  emailVerification: EmailVerificationState;
  signIn: (data: FormData) => Promise<void>;
  registerAccount: (data: FormDataRegister) => Promise<void>;
  createUsername: (data: CreateUsernameParams) => Promise<void>;
  signOut: () => void;
  reloadUser: () => Promise<void>;
  // Email verification methods
  sendVerificationCode: (email: string) => Promise<void>;
  validateVerificationCode: (email: string, code: string) => Promise<void>;
  setVerificationCode: (code: string) => void;
  resetVerification: () => void;
  resendVerificationCode: () => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
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
    setEmailVerification(p => ({ ...p, isVerifying: true }));

    try {
      const pathname = window.location.pathname;
      const isResetFlow = pathname.startsWith("/reset-password") || pathname.startsWith("/reset-code");

      const endpoint = `${API_BASE_URL}${isResetFlow ? "/auth/validate-password-reset-code" : "/auth/validate-verification-code"
        }`;

      const payload = { email: email.trim().toLowerCase(), code: code.trim() };
      console.log("VALIDATE endpoint:", endpoint, "payload:", payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error("Código fornecido inválido.");
        setEmailVerification(p => ({ ...p, code: "", isVerifying: false }));
        return;
      }

      if (isResetFlow) {
        router.push(`/reset-password/new-password?email=${encodeURIComponent(payload.email)}&code=${encodeURIComponent(payload.code)}`);
        toast.success("Código confirmado, altere sua senha!");
      } else if (pathname.startsWith("/register/validate-code")) {
        router.push("/register/create-username");
        toast.success("Código confirmado, crie seu username.");
      } else {
        router.push("/");
        toast.success("Email verificado com sucesso!");
      }

      resetVerification();
    } catch (err) {
      console.error(err);
      toast.warning("Código inválido. Tente novamente.");
      setEmailVerification(p => ({ ...p, code: "" }));
    } finally {
      setEmailVerification(p => ({ ...p, isVerifying: false }));
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

      await loadUserFromCookies()

      await new Promise(resolve => setTimeout(resolve, 100));

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || redirectURL || '/home'; // ANALYSYS

      // if (redirectTo) {
      //   router.push(redirectTo);
      // }

      window.location.href = redirectTo;

    } catch (error: any) {
      console.error('Something went wrong on sign in', error);
      throw error;
    }
  };

  const registerAccount = async ({ email, password, name }: FormDataRegister) => {
    const url = `${baseURL}/users/`;

    try {
      const request = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error.message);
      }

      const response = await request.json();

      setCookie(null, cookieName, response.token, {
        maxAge: 60 * 60 * 12, // 12h
        path: '/',
        sameSite: 'lax',
      });

      setUser(response.user);

      toast.success("Conta criada com sucesso! Confirme seu email!");

    } catch (error: any) {
      throw error;
    }
  };

  const createUsername = async ({ username }: CreateUsernameParams): Promise<void> => {
    const url = `${baseURL}/users/update-username`;
    const token = getClientToken();

    try {
      const request = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ username }),
      });

      if (!request.ok) {
        const error = await request.json();
        throw new Error(error.message || "Erro ao criar username");
      }

      toast.success("Username criado com sucesso, realizando acesso.");

      // const response = await request.json();
      await loadUserFromCookies();
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/home';

    } catch (error: any) {
      toast.error(error.message || "Erro desconhecido");
      throw error;
    }
  }

  const signOut = useCallback(() => {
    destroyCookie(null, cookieName);
    setUser(null);
    resetVerification();
    window.location.href = '/login';
    // router.push("/login");
    // router.refresh()
  // }, [router]);
  }, []);

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


        // if (window.location.pathname === '/login') {
        //   const urlParams = new URLSearchParams(window.location.search);
        //   const redirectTo = urlParams.get('redirect');
        //   if (redirectTo && redirectTo !== '/login') {
        //     router.replace(redirectTo);
        //   }
        // }
      } else {
        destroyCookie(null, cookieName);
        setUser(null);
      }
    } catch (err) {
      console.error('Error trying to load user', err);
      destroyCookie(null, cookieName);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Email verification methods
  const sendVerificationCode = async (rawEmail: string) => {
    const email = rawEmail.trim().toLowerCase();

    setEmailVerification(prev => ({
      ...prev,
      isVerifying: true,
      email,
    }));

    try {
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const isResetFlow = pathname.startsWith("/reset-password") || pathname.startsWith("/reset-code");

      const endpointPath = isResetFlow
        ? "/auth/send-password-reset-code"
        : "/auth/send-verification-code";   

      const url = `${API_BASE_URL}${endpointPath}`.replace(/([^:]\/)\/+/g, "$1");

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.status === 204) {
        toast.success("Código enviado para o e-mail!");
        setEmailVerification(p => ({ ...p, counter: 30, code: "" }));
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`codeSentFor_${isResetFlow ? "reset" : "verify"}_${email}`, "true");
        }
        return;
      }

      const isJson = (res.headers.get("content-type") || "").includes("application/json");
      const body = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");

      if (!res.ok) {
        let message =
          (isJson && (body as any)?.message) ||
          (typeof body === "string" && body) ||
          "Não foi possível enviar o código. Tente novamente.";

        if (res.status === 404) {
          message = "Se existir uma conta com esse e-mail, enviaremos um código.";
        } else if (res.status === 429) {
          message = "Muitas tentativas. Aguarde um pouco antes de tentar novamente.";
        } else if (res.status >= 500) {
          message = "Serviço indisponível no momento. Tente novamente em instantes.";
        }

        toast.error(message);
        setEmailVerification(p => ({ ...p, code: "" }));
        return;
      }

      toast.success("Código enviado para o e-mail!");
      setEmailVerification(p => ({ ...p, counter: 30, code: "" }));

      if (typeof window !== "undefined") {
        sessionStorage.setItem(`codeSentFor_${isResetFlow ? "reset" : "verify"}_${email}`, "true");
      }
    } catch (err: any) {
      console.error(err);
      const isAbort = err?.name === "AbortError";
      toast.error(isAbort ? "Tempo de requisição excedido. Tente novamente." : "Falha de rede. Verifique sua conexão.");
      setEmailVerification(p => ({ ...p, code: "" }));
    } finally {
      setEmailVerification(p => ({ ...p, isVerifying: false }));
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

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
    const url = `${API_BASE_URL}/auth/reset-password`;

    const req = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
      }),
    });

    if (req.status === 204) return;

    let body: any = {};
    const isJson = (req.headers.get("content-type") || "").includes("application/json");
    if (isJson) body = await req.json().catch(() => ({}));

    if (!req.ok) {
      const message = body?.message || "Não foi possível alterar a senha.";
      const err: any = new Error(message);
      err.status = req.status;
      throw err;
    }
  };


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      emailVerification,
      signIn,
      registerAccount,
      signOut,
      createUsername,
      reloadUser: loadUserFromCookies,
      sendVerificationCode,
      validateVerificationCode,
      setVerificationCode,
      resetVerification,
      resendVerificationCode,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};