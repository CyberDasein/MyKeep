import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import NoteDetail from "../components/NoteDetail";
import { AppShell, Text, Button, Card, Transition } from "@mantine/core";
import { Header } from "../components/Header";
import { useDeleteNote, useNotes, useUpdateNote } from "../hooks/firebaseHooks";
import AddNoteArea from "../components/AddNoteArea";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import QuickAdd from "../components/QuickAdd";

export default function Notes() {
  const navigate = useNavigate();

  useEffect(() => {
    const noteIdFromHash = location.hash.replace("#", "");
    if (noteIdFromHash) {
      setSelectedNoteId(noteIdFromHash);
    }
  }, [location.hash]);

  const { data: notes } = useNotes();
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

  const [opened, { toggle }] = useDisclosure(false);
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !notes) return;

    const [reorderedItem] = notes.splice(result.source.index, 1);
    notes.splice(result.destination.index, 0, reorderedItem);

    // Обновляем порядок в Firebase
    notes.forEach((note, index) => {
      updateNote({ ...note, order: index });
    });
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: isMobile ? "100%" : 300,
        breakpoint: "sm",
        collapsed: { desktop: false, mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>
      <Transition
        mounted={opened || !isMobile}
        transition="slide-left"
        duration={200}
        timingFunction="ease"
      >
        {(styles) => (
          <AppShell.Navbar
            style={{
              ...styles,
            }}
          >
            <Sidebar
              notes={filteredNotes}
              onSelect={setSelectedNoteId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setNotes={useNotes}
              selectedNote={selectedNote}
            />
          </AppShell.Navbar>
        )}
      </Transition>
      <AppShell.Main>
        <AddNoteArea />

        {selectedNote ? (
          <NoteDetail
            note={selectedNote}
            onEdit={updateNote}
            onDelete={() => removeNote(selectedNote.id)}
            setSelectedNoteId={setSelectedNoteId}
          />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              isDropDisabled={false}
              isCombineEnabled={false}
              ignoreContainerClipping={false}
              droppableId="notes"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {notes &&
                    notes.map((note, index) => (
                      <Draggable
                        key={note.id}
                        draggableId={note.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card
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
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <QuickAdd onSelect={setSelectedNoteId} />
      </AppShell.Main>
    </AppShell>
  );
}
