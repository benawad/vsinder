export interface Profile {
  id: string;
  flair: string;
  displayName: string;
  age: number;
  bio: string;
  codeImgIds: string[];
  photoUrl: string;
  imgShowingIdx?: number;
  numLikes: number;
}
