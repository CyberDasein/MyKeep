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
import { useAddNote } from "../hooks/firebaseHooks";

type SidebarProps = {
  notes: NoteType[] | undefined;
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
  selectedNote,
}: SidebarProps) {
  const [title, setTitle] = useState<string>("");

  const handleAddNote = () => {
    if(!title) {
      return
    }
    const newNote: NoteType = {
      id: uuidv4(),
      title: title,
      content: "", 
    };
    addNote(newNote); 
    setTitle(""); 
  };

  const { mutate: addNote } = useAddNote();
  return (
    <Stack p="md">
      <TextInput
        placeholder="Поиск..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ScrollArea>
        {notes &&
          notes.map((note) => (
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
          placeholder="Введите название"
        />
        <Button onClick={handleAddNote}>Создать заметку</Button>
      </Group>
    </Stack>
  );
}
