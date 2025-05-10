import { Box, Button, Group, Input } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useAddNote } from "../hooks/firebaseHooks";
import { NoteType } from "../types";
import { useMediaQuery } from "@mantine/hooks";

export default function AddNoteArea() {
  const { mutate: addNote } = useAddNote();
  const [title, setTitle] = useState<string>("");
  const isMobile = useMediaQuery(`(max-width: 768px)`);
  const handleAddNote = () => {
    if (!title.trim()) {
      return;
    }
    const newNote: NoteType = {
      id: uuidv4(),
      title: title.trim(),
      content: "",
      order: 100,
    };
    addNote(newNote);
    setTitle("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddNote();
    }
  };

  return (
    <Box
      style={{ borderRadius: "8px", position: "sticky", top: 65, zIndex: 99 }}
      maw={1024}
      p="md"
      mx="auto"
      mb="md"
      bg="var(--mantine-color-orange-2)"
    >
      <Group>
        <Input
          style={{
            width: isMobile ? "100%" : "auto",
          }}
          size="md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
          aria-label="Название новой заметки"
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleAddNote} disabled={!title.trim()}>
          Создать заметку
        </Button>
      </Group>
    </Box>
  );
}
