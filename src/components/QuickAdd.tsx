import { Button } from "@mantine/core";
import { useAddNote } from "../hooks/firebaseHooks";
import { NoteType } from "../types";
import { v4 as uuidv4 } from "uuid";

type qickAddProps = {
  onSelect: (id: string) => void;
};
export default function QuickAdd({ onSelect }: qickAddProps) {
  const { mutate: addNote } = useAddNote();
  const handleAddNote = () => {
    const id = uuidv4();
    const newNote: NoteType = {
      id: id,
      title: `Заметка от ${new Date().toLocaleString()} `,
      content: "",
      order: 100,
    };
    onSelect(id);
    addNote(newNote);
  };
  return (
    <Button
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
      }}
      variant="filled"
      radius="xl"
      size="lg"
      onClick={handleAddNote}
      color="rgba(0, 0, 0, 1)"
    >
      Quick add 🎤
    </Button>
  );
}
