import { Group, Text, Image } from "@mantine/core";
import logo from "../assets/react.svg";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";

export function Header() {
  const auth = useAuth();
  const logout = () => {
    auth.signout();
  };
  return (
    <>
      <Group justify="space-between" px="md" style={{ height: "100%" }}>
        <Group>
          <Image src={logo} width={50} height={50} alt="Логотип" />
          <Text size="lg">Мои заметки</Text>
        </Group>
        <Group>
          {auth.user && (
            <>
              <span className="font-bold">{auth.user.email}</span>
              <a href="#" onClick={logout} className="hover:text-[#ff9800]">
                Logout
              </a>
            </>
          )}
          {!auth.user && (
            <Link to="/login" className="hover:text-[#ff9800]">
              Login
            </Link>
          )}
        </Group>
      </Group>
    </>
  );
}
