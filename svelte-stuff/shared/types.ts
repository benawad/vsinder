export interface User {
  id: string;
  username: string;
  global: boolean;
  flair: string;
  bio: string;
  goal: string;
  genderToShow: string;
  gender: string | null;
  displayName: string;
  ageRangeMin: number;
  ageRangeMax: number;
  birthday: string;
  location: string;
  profileUrl: string;
  photoUrl: string;
  codeImgIds: string[];
  numLikes: number;
  unreadMatchUserIds: Array<{ userId1: string; userId2: string }>;
}

export type CodeImgIdItem = {
  value: string;
  tmpId: string;
};

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: number;
}

export interface MessagesResponse {
  hasMore: boolean;
  messages: Message[];
}

export interface Profile {
  id: string;
  flair: string;
  displayName: string;
  age: number;
  bio: string;
  codeImgIds: string[];
  photoUrl: string;
  imgShowingIdx?: number;
}

export interface Match {
  matchId: string;
  userId: string;
  photoUrl: string;
  displayName: string;
  createdAt: string;
  flair: string;
  read: boolean;
  message: {
    text: string;
    createdAt: number;
  } | null;
}

export interface MatchesResponse {
  matches: Match[];
}

export interface FeedResponse {
  profiles: Profile[];
}

export interface OneUserResponse {
  user: Profile;
}

export interface MeResponse {
  user: User;
}

export type CodeSnippet = {
  text: string;
  theme: string;
  languageId: string;
};

export type ProfileFormData = {
  displayName: string;
  bio: string;
  gender: string;
  genderToShow: string;
  goal: string;
  ageRangeMin: number;
  ageRangeMax: number;
  month: string;
  day: string;
  year: string;
  flair: string;
  location: string;
  global: boolean;
};
export type Page = "login" | "profile-form" | "code-snippet";
export type CodeSnippetState = {
  page: "code-snippet";
  data: SnippetData;
  codeImgIds: CodeImgIdItem[];
};
export type ReviewCodeImgsState = {
  page: "review-code-imgs";
  codeImgIds: CodeImgIdItem[];
};
export type MatchState = {
  page: "matches";
  user?: {
    id: string;
    photoUrl: string;
    flair: string;
    displayName: string;
    matchId: string;
  };
};
export type State =
  | { page: "view-profile" }
  | { page: "login" }
  | { page: "loading" }
  | MatchState
  | {
      page: "profile-form";
      data: ProfileFormData;
    }
  | ReviewCodeImgsState
  | CodeSnippetState;

export type NavigateFn = (ns: State) => void;
export type SnippetData = {
  theme: string;
  language: string;
  fontFamily: string;
  code: string;
};

export type WebsocketMessages =
  | { type: "new-message"; message: Message }
  | { type: "unmatch"; userId: string }
  | { type: "new-match"; userId1: string; userId2: string }
  | { type: "new-like" };
