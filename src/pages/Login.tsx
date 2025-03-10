import { useState } from "react";
import { Input, Button, Text } from "@mantine/core";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

export const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [formData, setFormData] = useState({
    password: "",
    name: "alexey",
  });

  const [errors, setErrors] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Пароль обязателен для заполнения";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      auth.signin(formData, () => {
        navigate(from);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        placeholder="введите имя"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      {errors.name && <Text>{errors.name}</Text>}

      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      {errors.password && <Text>{errors.password}</Text>}

      <Button type="submit">Войти</Button>
    </form>
  );
};
