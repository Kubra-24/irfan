import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="İslami bir konu hakkında soru sorun..."
        value={message}
        onChangeText={setMessage}
        editable={!disabled}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (!disabled) handleSubmit();
        }}
        blurOnSubmit={false} // multiline’da enter ile yeni satır ekler
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={!message.trim() || disabled}
        style={[
          styles.sendButton,
          (disabled || !message.trim()) && styles.sendButtonDisabled,
        ]}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "rgba(255,255,255,0.9)", 
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    minHeight: 52,
    maxHeight: 128,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#336699",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#999",
  },
});
