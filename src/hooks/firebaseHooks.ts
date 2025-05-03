import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../../firebase";
import { NoteType } from "../types";
import { useAuth } from "../context/AuthProvider";

// Получение всех заметок
export function useNotes() {
  const { user } = useAuth();

  return useQuery<NoteType[], Error>({
    queryKey: ["notes", user?.id],
    queryFn: async () => {
      if (!user) throw new Error("Пользователь не авторизован");

      const notesRef = collection(db, "users", user.id, "notes");
      const q = query(notesRef, orderBy("order"));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<NoteType, "id">),
      }));
    },
    enabled: !!user, // Запрос выполняется только если пользователь залогинен
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<void, Error, NoteType>({
    mutationFn: async (updatedNote) => {
      if (!user || !user.id) throw new Error("Пользователь не авторизован");
      if (!updatedNote.id) throw new Error("ID заметки не указан");

      const noteRef = doc(db, "users", user.id, "notes", updatedNote.id);
      await updateDoc(noteRef, {
        title: updatedNote.title,
        content: updatedNote.content,
        order: updatedNote.order,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Ошибка при обновлении заметки:", error);
      throw error;
    },
  });
}

// Хук для удаления заметки
export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<void, Error, string>({
    mutationFn: async (noteId) => {
      if (!user) throw new Error("Пользователь не авторизован");
      if (!noteId) throw new Error("ID заметки не указан");

      const noteRef = doc(db, "users", user.id, "notes", noteId);
      await deleteDoc(noteRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Ошибка при удалении заметки:", error);
      throw error;
    },
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<void, Error, Omit<NoteType, "id">>({
    mutationFn: async (newNote) => {
      if (!user) throw new Error("Пользователь не авторизован");

      await setDoc(doc(db, "users", user.id, "notes", newNote.id), newNote);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
