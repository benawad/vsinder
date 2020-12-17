import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { vscodeThemes } from "./themes";

const defaultDarkThemeName = "Solarized (dark)";
const defaultLightThemeName = "Solarized (dark)";

const defaultThemeLight = vscodeThemes.find(
  (t) => t.name === defaultLightThemeName
)!.colors!;
const defaultThemeDark = vscodeThemes.find(
  (t) => t.name === defaultDarkThemeName
)!.colors!;

type Theme = typeof defaultThemeLight;

export const ThemeContext = createContext<[Theme, (t: string) => void]>([
  defaultThemeLight,
  () => {},
] as any);

interface ThemeProviderProps {}

const themeKey = "@vsinder/theme-key";

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const _colorScheme = useColorScheme();
  const colorScheme = _colorScheme || "light";
  const [themePref, setThemePref] = useState({});
  const [colors, setColors] = useState(
    colorScheme === "dark" ? defaultThemeDark : defaultThemeLight
  );

  useEffect(() => {
    AsyncStorage.getItem(themeKey).then((x) => {
      if (x) {
        const themeOfChoice = JSON.parse(x);
        setThemePref(x);
        const name =
          themeOfChoice[colorScheme] ||
          (colorScheme === "dark"
            ? defaultDarkThemeName
            : defaultLightThemeName);
        const c = vscodeThemes.find((t) => t.name === name)?.colors;
        if (c) {
          setColors(c);
        }
      }
    });
  }, [colorScheme]);

  return (
    <ThemeContext.Provider
      value={useMemo(
        () => [
          colors,
          (name) => {
            const c = vscodeThemes.find((t) => t.name === name)?.colors;
            if (c) {
              setColors(c);
              const newThemePref = {
                ...themePref,
                [colorScheme]: name,
              };
              setThemePref(newThemePref);
              AsyncStorage.setItem(themeKey, JSON.stringify(newThemePref));
            }
          },
        ],
        [colors, colorScheme, themePref]
      )}
    >
      <StatusBar
        barStyle={
          colors.editorBackground === "#002B36"
            ? "light-content"
            : colorScheme === "dark"
            ? "light-content"
            : "dark-content"
        }
      />
      {children}
    </ThemeContext.Provider>
  );
};
