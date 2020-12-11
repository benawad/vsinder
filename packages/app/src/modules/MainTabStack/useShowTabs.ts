import create, { SetState } from "zustand";

export const useShowTabs = create<{
  show: boolean;
  set: SetState<{
    show: boolean;
  }>;
}>((set) => ({
  show: true,
  set,
}));
