import create, { SetState } from "zustand";
import { CodeImgIdItem } from "../../types";

export const useCodeImgs = create<{
  codeImgs: CodeImgIdItem[];
  set: SetState<{
    codeImgs: CodeImgIdItem[];
  }>;
}>((set) => ({
  codeImgs: [],
  set,
}));
