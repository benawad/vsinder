import React, { Children, ReactNode, useState } from "react";
import Dialog from "react-native-dialog";

interface ReportDialogProps {
  onReportMessage: (t: string) => void;
  children: (
    setData: React.Dispatch<React.SetStateAction<boolean>>
  ) => ReactNode;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  children,
  onReportMessage,
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const close = () => {
    setText("");
    setOpen(false);
  };
  return (
    <>
      <Dialog.Container
        onBackButtonPress={close}
        onBackdropPress={close}
        visible={open}
      >
        <Dialog.Title>Why are you reporting this user?</Dialog.Title>
        <Dialog.Input value={text} onChangeText={(t) => setText(t)} />
        <Dialog.Button onPress={close} label="Cancel" />
        <Dialog.Button
          onPress={() => {
            onReportMessage(text);
            close();
          }}
          label="Report"
        />
      </Dialog.Container>
      {children(setOpen)}
    </>
  );
};
