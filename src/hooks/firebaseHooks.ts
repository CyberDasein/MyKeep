import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../../firebase";
import { NoteType } from "../types";

const notesRef = collection(db, "notes");

// Получение всех заметок
export function useNotes() {
  return useQuery<NoteType[], Error>({
    queryKey: ["notes"],
    queryFn: async () => {
      const snapshot = await getDocs(notesRef);
      return snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<NoteType, "id">; // Исключаем id из типа
        return { id: doc.id, ...data }; // Теперь id добавляется без конфликта
      });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedNote: NoteType) => {
      try {
        const noteRef = doc(db, "notes", updatedNote.id);
        await updateDoc(noteRef, { ...updatedNote });
      } catch (error) {
        console.error("Ошибка при обновлении заметки:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Хук для удаления заметки
export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteDoc(doc(db, "notes", id));
      } catch (error) {
        console.error("Ошибка при удалении заметки:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Добавление заметки
export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, NoteType>({
    mutationFn: async (newNote) => {
      try {
        await setDoc(doc(db, "notes", newNote.id), newNote);
      } catch (error) {
        console.error("Ошибка при добавлении заметки:", error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
