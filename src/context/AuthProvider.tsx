import { createContext, useContext, useState, ReactNode } from "react";

type User = {
  name: string;
  password?: string;
};

type AuthContextType = {
  user: User | null;
  signin: (newUser: User, callback: VoidFunction) => void;
  signout: VoidFunction;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signin = (newUser: User, callback: VoidFunction) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    signin,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
