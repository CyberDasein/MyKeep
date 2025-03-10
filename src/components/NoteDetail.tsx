import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Group, Card, Modal } from "@mantine/core";
import VoiceInput from "./VoiceInput";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { NoteDetailProps } from "../types";

export default function NoteDetail({
  note,
  onEdit,
  onDelete,
  setSelectedNoteId,
}: NoteDetailProps) {
  const [opened, { close }] = useDisclosure(true);

  const navigate = useNavigate();

  const closeHandler = () => {
    close();
    setSelectedNoteId(null);
    navigate("/");
  };
  return (
    <Modal opened={opened} onClose={closeHandler} withCloseButton={true}>
      <Card>
        <SimpleMDE value={note.content} onChange={onEdit} />
        <Group>
          <Button onClick={onDelete} color="red">
            Удалить
          </Button>
          <VoiceInput setText={onEdit} />
        </Group>
      </Card>
    </Modal>
  );
}
