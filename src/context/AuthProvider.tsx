import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { AuthContextType, User } from "../types";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Подписка на изменения состояния аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Преобразуем Firebase User в наш тип User
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Очистка подписки
  }, []);

  // Вход через email/пароль
  const signin = async (
    email: string,
    password: string,
    callback: VoidFunction
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
      };
      setUser(userData);
      callback();
    } catch (error) {
      console.error("Ошибка входа:", error);
      throw error;
    }
  };

  // Регистрация через email/пароль
  const signup = async (
    email: string,
    password: string,
    callback: VoidFunction
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData: User = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
      };
      setUser(userData);
      callback();
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  };

  // Выход
  const signout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Ошибка выхода:", error);
      throw error;
    }
  };

  const value = {
    user,
    signin,
    signout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Ожидайте загрузки аутентификации */}
    </AuthContext.Provider>
  );
}
