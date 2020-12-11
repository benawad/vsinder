import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { MyButton } from "./MyButton";
import { MyText } from "./MyText";
import { MyView } from "./MyView";
import Modal from "react-native-modal";
import { Option } from "../types";

interface SelectModalProps {
  isVisible: boolean;
  onBackButtonPress: () => void;
  onBackdropPress: () => void;
  options: Option[];
  onItem: (o: Option) => void;
}

export const SelectModal: React.FC<SelectModalProps> = ({
  isVisible,
  onBackButtonPress,
  onBackdropPress,
  options,
  onItem,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackdropPress}
      style={{
        justifyContent: "flex-end",
        marginBottom: 50,
        marginHorizontal: 20,
      }}
    >
      <View>
        <MyView
          style={{
            maxHeight: 500,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              paddingBottom: 10,
            }}
            keyboardShouldPersistTaps="always"
          >
            {options.map((item) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  style={{
                    padding: 14,
                  }}
                  onPress={() => {
                    onItem(item);
                  }}
                >
                  <MyText style={{ fontSize: 18 }}>{item.label}</MyText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </MyView>
        <MyButton style={{ marginTop: 10 }} onPress={() => onBackButtonPress()}>
          Cancel
        </MyButton>
      </View>
    </Modal>
  );
};
