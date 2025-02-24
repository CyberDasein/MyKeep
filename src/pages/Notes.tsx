import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";
import Sidebar from "../components/Sidebar";
import NoteView from "../components/NoteView";
import { AppShell, Group, Text, Image, Button, Input, Textarea } from "@mantine/core";
import { NoteType } from "../types";
import logo from "../assets/react.svg";

export default function Notes() {
  const auth = useAuth();
  const logout = () => {
    auth.signout();
  };

  const [notes, { setItem: setNotes }] = useLocalStorage<NoteType[]>("notes", [
    { id: uuidv4(), content: "test", title: `Заметка № 1}` },
  ]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const editNote = (value: string) => {
    if (selectedNote) {
      const updatedNotes = notes.map((note) =>
        note.id === selectedNote.id ? { ...note, content: value } : note
      );
      setNotes(updatedNotes);
    }
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    setSelectedNoteId(null);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" px="md" style={{ height: "100%" }}>
          <Group>
            <Image src={logo} width={50} height={50} alt="Логотип" />
            <Text size="lg">Мои заметки</Text>
          </Group>
          <Group>
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
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Sidebar
          notes={filteredNotes}
          onSelect={setSelectedNoteId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setNotes={setNotes}
          selectedNote={selectedNote}
        />
      </AppShell.Navbar>

      <AppShell.Main >
        {selectedNote && (
          <NoteView
            note={selectedNote}
            onEdit={editNote}
            onDelete={() => removeNote(selectedNote.id)}
          />
        )}
         
      </AppShell.Main>
    </AppShell>
  );
}
