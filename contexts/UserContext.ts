import { create } from "zustand";

export interface UserModel {
  id: number;
  email: string;
  name?: string | null;
  profileImage?: string | null;
  activityArea?: string | null;
  birthDate?: string | null;
  favoritePlayer?: string | null;
  foot?: string | null;
  gender?: string | null;
  mainPosition?: string | null;
  phone?: string | null;
  preferredNumber?: number | null;
  provider?: string | null;
  subPositions?: string[] | null;
  [key: string]: unknown;
}

interface UserState {
  user: UserModel | null;
  setUser: (user: UserModel | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
