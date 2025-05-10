import { Group, Text, Burger } from "@mantine/core";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

interface HeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function Header({ opened, toggle }: HeaderProps) {
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const auth = useAuth();
  const logout = () => {
    auth.signout();
  };
  return (
    <>
      <Group justify="space-between" px="md" style={{ height: "100%" }}>
        <Group>
          {isMobile && (
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              color="gray"
              mr="0"
            />
          )}
          <img src={logo} width={40} height={40} alt="Логотип" />
          <Text size="lg">Мои заметки</Text>
        </Group>

        <Group>
          {auth.user && (
            <>
              {!isMobile && (
                <span className="font-bold">{auth.user.email}</span>
              )}
              <a href="#" onClick={logout}>
                <Text c="red">Logout</Text>
              </a>
            </>
          )}
          {!auth.user && (
            <Link to="/login">
              {" "}
              <Text c="blue">Login</Text>
            </Link>
          )}
        </Group>
      </Group>
    </>
  );
}
