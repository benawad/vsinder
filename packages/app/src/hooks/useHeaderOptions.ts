import { useContext } from "react";
import { ThemeContext } from "../ThemeProvider";

export const useHeaderOptions = () => {
  const [{ editorBackground, editorForeground }] = useContext(ThemeContext);

  return {
    headerBackTitle: "",
    headerStyle: { backgroundColor: editorBackground },
    headerTitleAlign: "center" as "center",
    headerTintColor: editorForeground,
    headerTitleStyle: {
      color: editorForeground,
    },
  };
};
