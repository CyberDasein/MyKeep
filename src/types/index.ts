export type NoteType = {
  id: string;
  content: string;
  title: string;
  order?: number;
};
export type NoteDetailProps = {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete: () => void;
  setSelectedNoteId: (id: string | null) => void;
};
export type User = {
  id: string;
  name?: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  signin: (
    email: string,
    password: string,
    callback: VoidFunction
  ) => Promise<void>;
  signout: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    callback: VoidFunction
  ) => Promise<void>;
};
