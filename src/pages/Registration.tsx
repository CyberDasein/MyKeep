import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { Button, Input, Title } from "@mantine/core";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, () => navigate(from));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Title mb="md" size="h1">
        Регистрация
      </Title>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: "300px", margin: "auto" }}
      >
        <Input
          mb="xs"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          mb="xs"
        />
        <Button mt="lg" type="submit">
          Зарегистрироваться
        </Button>
      </form>

      <Link
        style={{ display: "block", marginTop: "1rem", color: "blue" }}
        to="/login"
      >
        Вход
      </Link>
    </>
  );
}
