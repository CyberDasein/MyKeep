export type NoteType = {
  id: string;
  content: string;
  title: string;
};
export type NoteDetailProps = {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete: () => void;
  setSelectedNoteId: (id: string | null) => void;
};
export type User = {
  name: string;
  password?: string;
};
export type AuthContextType = {
  user: User | null;
  signin: (newUser: User, callback: VoidFunction) => void;
  signout: VoidFunction;
};
