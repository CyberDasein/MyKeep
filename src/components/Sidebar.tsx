import {
  NavLink,
  TextInput,
  Text,
  Stack,
  ScrollArea,
  Group,
  Input,
  Button,
} from "@mantine/core";
import { NoteType } from "../types";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

type SidebarProps = {
  notes: NoteType[];
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setNotes: (note: NoteType[]) => void;
  selectedNote: NoteType | undefined;
};

export default function Sidebar({
  notes,
  onSelect,
  searchQuery,
  setSearchQuery,
  setNotes,
  selectedNote,
}: SidebarProps) {
  const [title, setTitle] = useState<string>("");
  const addNote = () => {
    const id = uuidv4();
    const newNote = { id: id, content: "", title: `${title}` };
    if (title.trim()) {
      setNotes([...notes, newNote]);
      setTitle("");
      onSelect(newNote.id);
    }
  };
  return (
    <Stack p="md">
      <TextInput
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ScrollArea>
        {notes.map((note) => (
          <NavLink
            color="lime.4"
            key={note.id}
            onClick={() => onSelect(note.id)}
            active={selectedNote && selectedNote.id === note.id}
            variant="filled"
            autoContrast
            label={
              <Text lineClamp={1}>{note.title}</Text> // Добавляем обрезку
            }
          >
            <Text lineClamp={1}>{note.content}</Text>
          </NavLink>
        ))}
      </ScrollArea>

      <Group>
        <Input
          size="md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите заметку"
        />
        <Button onClick={addNote}>Создать заметку</Button>
      </Group>
    </Stack>
  );
}
