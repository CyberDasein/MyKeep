import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useEffect, useState } from "react";
import { Input, Button, Group } from "@mantine/core";

export default function Notes() {
  const auth = useAuth();
  const [notes, setNotes] = useState<string[]>([]);
  const [text, setText] = useState<string>("");

  const logout = () => {
    auth.signout();
  };
  useEffect(() => {
    const savedNotes = JSON.parse(
      localStorage.getItem("notes") || "[]"
    ) as string[];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (text.trim()) {
      setNotes([...notes, text]);
      setText("");
    }
  };

  const removeNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Заметки</h1>
      <Group>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите заметку"
        />
        <Button onClick={addNote}>Добавить</Button>
      </Group>
      <ul>
        {notes.map((note, index) => (
          <li key={index} className="flex justify-between border-b p-2">
            {note}
            <Button color="red" onClick={() => removeNote(index)}>
              Удалить
            </Button>
          </li>
        ))}
      </ul>
      <div className="ml-auto flex items-center space-x-4">
        {auth.user && (
          <>
            <span className="font-bold">{auth.user.name}</span>
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
      </div>
    </div>
  );
}
