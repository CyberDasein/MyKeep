import { useMemo } from "react";
import {
  NavLink,
  TextInput,
  Text,
  Stack,
  ScrollArea,
  Center,
  Title,
} from "@mantine/core";
import { NoteType } from "../types";


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

  return (
    <Stack p="md">
      <TextInput
        placeholder="Поиск заметок..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Поиск заметок"
      />

      <ScrollArea>
        <Title style={{ textAlign: "left" }} mb="md" size="h5">
          Список заметок
        </Title>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <NavLink
              color="lime.4"
              key={note.id}
              onClick={() => onSelect(note.id)}
              active={selectedNote && selectedNote.id === note.id}
              variant="subtle"
              label={<Text lineClamp={1}>{note.title}</Text>}
            >
              <Text lineClamp={1}>{note.content}</Text>
            </NavLink>
          ))
        ) : (
          <Center>
            <Text color="dimmed">Нет заметок</Text>
          </Center>
        )}
      </ScrollArea>
    </Stack>
  );
}
