import "easymde/dist/easymde.min.css";
import {
  Button,
  Group,
  Card,
  Modal,
  Textarea,
  TextInput,
  Text,
} from "@mantine/core";
import VoiceInput from "./VoiceInput";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { NoteDetailProps } from "../types";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

export default function NoteDetail({
  note,
  onEdit,
  onDelete,
  setSelectedNoteId,
}: NoteDetailProps) {
  const [opened, { close }] = useDisclosure(true);
  const navigate = useNavigate();

  const [localNote, setLocalNote] = useState(note);
  const debouncedNote = useDebounce(localNote, 500);

  useEffect(() => {
    onEdit(debouncedNote);
  }, [debouncedNote, note]);

  const handleEdit = (field: "title" | "content", value: string) => {
    setLocalNote({ ...localNote, [field]: value });
  };

  const closeHandler = () => {
    close();
    setSelectedNoteId(null);
    navigate("/");
  };

  return (
    <Modal opened={opened} onClose={closeHandler} withCloseButton={true}>
      <Card p={"xs"}>
        <Text size="sm">Название заметки</Text>
        <TextInput
          size="lg"
          variant="filled"
          mb="md"
          value={localNote.title}
          placeholder="Название"
          onChange={(event) => handleEdit("title", event.currentTarget.value)}
        />
        <Textarea
          mb="xl"
          autosize
          minRows={7}
          value={localNote.content}
          placeholder="Введите текст"
          size="md"
          onChange={(event) => handleEdit("content", event.currentTarget.value)}
        />
        <Group>
          <Button onClick={onDelete} color="red">
            Удалить
          </Button>
          <VoiceInput setText={(text) => handleEdit("content", text)} />
        </Group>
      </Card>
    </Modal>
  );
}
