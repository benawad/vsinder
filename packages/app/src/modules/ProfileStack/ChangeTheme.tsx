import React, { useContext } from "react";
import { FlatList } from "react-native";
import { ThemeContext } from "../../ThemeProvider";
import { vscodeThemes } from "../../themes";
import { Cell } from "../../ui/Cell";
import { ScreenWrapper } from "../../ui/ScreenWrapper";

interface ChangeThemeProps {}

export const ChangeTheme: React.FC<ChangeThemeProps> = ({}) => {
  const [, setTheme] = useContext(ThemeContext);
  return (
    <ScreenWrapper noPadding>
      <FlatList
        data={vscodeThemes}
        keyExtractor={({ name }) => name}
        renderItem={({ item }) => {
          return <Cell onPress={() => setTheme(item.name)}>{item.name}</Cell>;
        }}
      />
    </ScreenWrapper>
  );
};
