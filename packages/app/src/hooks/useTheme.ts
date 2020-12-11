import React from "react";
import { ThemeContext } from "../ThemeProvider";

export const useTheme = () => React.useContext(ThemeContext)[0];
