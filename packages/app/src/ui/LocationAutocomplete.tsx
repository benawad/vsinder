import React, { useContext, useEffect, useRef, useState } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import { placesApiKey } from "../places-api-key";
import { ThemeContext } from "../ThemeProvider";
import { MyTextInput } from "./MyTextInput";

interface LocationAutocompleteProps {
  defaultValue: string;
  onFocus: () => void;
  onLocation: (s: string) => void;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onFocus,
  defaultValue,
  onLocation,
}) => {
  const [
    {
      buttonBackground,
      buttonForeground,
      inputBackground,
      inputOptionActiveBorder,
      inputForeground,
    },
  ] = useContext(ThemeContext);
  const [showBorder, setShowBorder] = useState(false);
  const r = useRef<GooglePlacesAutocompleteRef>(null);
  useEffect(() => {
    if (defaultValue) {
      r.current?.setAddressText(defaultValue);
    }
  }, []);
  return (
    <GooglePlacesAutocomplete
      ref={r}
      placeholder=""
      textInputProps={{
        onFocus: () => {
          onFocus();
          setShowBorder(true);
        },
        onChangeText: (t) => onLocation(t),
        onBlur: () => setShowBorder(false),
        style: {
          paddingVertical: 8,
          paddingHorizontal: 6,
          fontSize: 16,
          width: "100%",
          color: inputForeground,
          backgroundColor: inputBackground,
          borderColor: showBorder ? inputOptionActiveBorder : "transparent",
          borderWidth: 1,
        },
      }}
      listUnderlayColor={buttonBackground}
      styles={{
        row: {
          backgroundColor: buttonBackground,
        },
        poweredContainer: {
          backgroundColor: buttonBackground,
        },
        description: {
          color: buttonForeground,
        },
      }}
      onPress={(data) => {
        if (data?.description) {
          onLocation(data.description);
        }
      }}
      query={{
        key: placesApiKey,
        type: "(cities)",
        language: "en",
      }}
    />
  );
};
