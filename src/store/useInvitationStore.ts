import { create } from "zustand";

// State global inti undangan. Pakai Zustand + React state — bukan localStorage.
interface InvitationState {
  /** Undangan sudah dibuka lewat tombol "Buka Undangan" di Cover. */
  isOpened: boolean;
  /** Status pemutaran lagu latar. */
  audioPlaying: boolean;
  /** Id foto galeri yang sedang di-morph fullscreen (null = modal tertutup). */
  activeGalleryId: string | null;

  /** Buka undangan → picu curtain reveal & mulai audio (setelah interaksi user). */
  open: () => void;
  setAudioPlaying: (value: boolean) => void;
  toggleAudio: () => void;
  openGallery: (id: string) => void;
  closeGallery: () => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  isOpened: false,
  audioPlaying: false,
  activeGalleryId: null,

  open: () => set({ isOpened: true, audioPlaying: true }),
  setAudioPlaying: (value) => set({ audioPlaying: value }),
  toggleAudio: () => set((state) => ({ audioPlaying: !state.audioPlaying })),
  openGallery: (id) => set({ activeGalleryId: id }),
  closeGallery: () => set({ activeGalleryId: null }),
}));
