import { create } from "zustand";

import { MOCK_USER, UserProfile } from "@/constants/mockData";

type EditableProfileField = "fullName" | "email" | "location" | "avatarUrl";

interface ProfileState {
  profile: UserProfile;
  isAvatarUploading: boolean;
  updateField: (field: EditableProfileField, value: string) => void;
  setAvatarUploading: (isUploading: boolean) => void;
  simulateAvatarUpload: (nextAvatarUrl: string) => void;
  resetProfile: () => void;
}

const createInitialProfile = (): UserProfile => ({
  ...MOCK_USER,
  addresses: MOCK_USER.addresses.map((address) => ({ ...address })),
});

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: createInitialProfile(),
  isAvatarUploading: false,
  updateField: (field, value) =>
    set((state) => ({
      profile: {
        ...state.profile,
        [field]: value,
      },
    })),
  setAvatarUploading: (isUploading) => set({ isAvatarUploading: isUploading }),
  simulateAvatarUpload: (nextAvatarUrl) => {
    const { isAvatarUploading } = get();

    if (isAvatarUploading) {
      return;
    }

    set({ isAvatarUploading: true });

    setTimeout(() => {
      set((state) => ({
        profile: {
          ...state.profile,
          avatarUrl: nextAvatarUrl,
        },
        isAvatarUploading: false,
      }));
    }, 1200);
  },
  resetProfile: () =>
    set({
      profile: createInitialProfile(),
      isAvatarUploading: false,
    }),
}));
