
import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";

interface NumberSelectionModalProps {
  isVisible: boolean;
  closeModal: () => void;
  selectNumber: (number: number) => void;
}

const NumberSelectionModal = ({
  isVisible,
  closeModal,
  selectNumber,
}: NumberSelectionModalProps) => {
  return (
    <Portal>
      <Dialog visible={isVisible} onDismiss={closeModal}>
        <Dialog.Title>Select a Number</Dialog.Title>
        <Dialog.Content>
          <View style={styles.numberSelectionContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <Button
                key={number}
                mode="contained"
                style={styles.numberSelectionButton}
                onPress={() => {
                  selectNumber(number); 
                  closeModal(); 
                }}
                
              >
                {number}
              </Button>
            ))}
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  numberSelectionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  numberSelectionButton: {
    marginVertical: 10,
    width: "20%",
  },
});

export default NumberSelectionModal;