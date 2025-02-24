import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Button, Stack } from "@mantine/core";

type NoteViewProps = {
  note: { id: string; content: string };
  onEdit: (content: string) => void;
  onDelete: () => void;
};

export default function NoteView({ note, onEdit, onDelete }: NoteViewProps) {

  return (
    <Stack>
      <SimpleMDE value={note.content} onChange={onEdit}/>
      <Button onClick={onDelete} color="red">
        Удалить
      </Button>
    </Stack>
  );
}
