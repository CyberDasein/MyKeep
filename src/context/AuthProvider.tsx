import { createContext, useContext, useState, ReactNode } from "react";
import { AuthContextType, User } from "../types";

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
