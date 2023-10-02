import { create } from "zustand";
import { User } from "firebase/auth";
interface AuthState {
  user: User | null;
  loading: boolean;
  logOut: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  logOut: () => set({ user: null }),
  setUser: (user: User | null) => set({ user }),
}));
