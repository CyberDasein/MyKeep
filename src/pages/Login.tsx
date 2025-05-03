import { useState } from "react";
import { Input, Button, Text, Title } from "@mantine/core";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const [authErrorText, setAuthErrorText] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.email.trim()) {
      newErrors.email = "Имя обязательно для заполнения";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен для заполнения";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await auth.signin(formData.email, formData.password, () => {
          navigate(from);
        });
      } catch (error) {
        setAuthErrorText("Ошибка входа");
      }
    }
  };

  return (
    <>
      <Title mb="md" size="h1">
        Вход
      </Title>
      {authErrorText && <Text>{authErrorText}</Text>}
      <form
        style={{ maxWidth: "300px", margin: "auto" }}
        onSubmit={handleSubmit}
      >
        <Input
          mb="xs"
          type="email"
          name="email"
          placeholder="введите email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        {errors.email && <Text mb="xs">{errors.email}</Text>}

        <Input
          mb="xs"
          type="password"
          name="password"
          placeholder="введите пароль"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        {errors.password && <Text>{errors.password}</Text>}

        <Button mt="lg" type="submit">
          Войти
        </Button>
      </form>

      <Link
        style={{ display: "block", marginTop: "1rem", color: "blue" }}
        to="/register"
      >
        Зарегистрироваться
      </Link>
    </>
  );
};
