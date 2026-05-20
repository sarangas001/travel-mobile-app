import { create } from "zustand";

import { MOCK_USER, UserProfile } from "@/constants/mockData";

type EditableProfileField = "fullName" | "email" | "location" | "avatarUrl";

type BackendAccount = {
  _id?: string;
  username?: string;
  email?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  createdAt?: string;
};

interface ProfileState {
  profile: UserProfile;
  isAvatarUploading: boolean;
  updateField: (field: EditableProfileField, value: string) => void;
  setAvatarUploading: (isUploading: boolean) => void;
  simulateAvatarUpload: (nextAvatarUrl: string) => void;
  hydrateFromAccount: (account: BackendAccount) => void;
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
  hydrateFromAccount: (account) => {
    const fullName =
      [account.profile?.firstName, account.profile?.lastName]
        .filter(Boolean)
        .join(" ") || account.username || MOCK_USER.fullName;

    set((state) => ({
      profile: {
        ...state.profile,
        fullName,
        email: account.email || state.profile.email,
        avatarUrl: account.profile?.avatarUrl || state.profile.avatarUrl,
        joinedAt: account.createdAt
          ? new Date(account.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })
          : state.profile.joinedAt,
      },
    }));
  },
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
