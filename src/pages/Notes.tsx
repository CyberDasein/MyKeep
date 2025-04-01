import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "../hooks/useLocalStorage";
import Sidebar from "../components/Sidebar";
import NoteDetail from "../components/NoteDetail";
import { AppShell, Text, Button, SimpleGrid, Card } from "@mantine/core";
import { NoteType } from "../types";
import { Header } from "../components/Header";
import {
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from "../hooks/firebaseHooks";

export default function Notes() {
  const navigate = useNavigate();

  useEffect(() => {
    const noteIdFromHash = location.hash.replace("#", "");
    if (noteIdFromHash) {
      setSelectedNoteId(noteIdFromHash);
    }
  }, [location.hash]);

  const { data: notes, isLoading, error } = useNotes();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes?.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedNote = notes?.find((note) => note.id === selectedNoteId);

  const removeNote = (id: string) => {
    deleteNote(id);
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
        <Header />
      </AppShell.Header>
      <AppShell.Navbar>
        <Sidebar
          notes={filteredNotes}
          onSelect={setSelectedNoteId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setNotes={useNotes}
          selectedNote={selectedNote}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {selectedNote ? (
          <NoteDetail
            note={selectedNote}
            onEdit={updateNote}
            onDelete={() => removeNote(selectedNote.id)}
            setSelectedNoteId={setSelectedNoteId}
          />
        ) : (
          <SimpleGrid cols={3} spacing="md">
            {isLoading ? (
              <span>Загрузка заметок...</span>
            ) : (
              notes &&
              notes.map((note) => (
                <Card
                  key={note.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                >
                  <Text fw={500} truncate>
                    {note.title}
                  </Text>
                  <Text size="sm" lineClamp={2}>
                    {note.content}
                  </Text>
                  <Button
                    mt="md"
                    fullWidth
                    variant="light"
                    onClick={() => navigate(`#${note.id}`)}
                  >
                    Открыть
                  </Button>
                </Card>
              ))
            )}
          </SimpleGrid>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
