import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ChatBubbleProps {
  message: string;
  type: "user" | "ai";
  timestamp?: string;
}

export const ChatBubble = ({ message, type, timestamp }: ChatBubbleProps) => {
  const isUser = type === "user";

  return (
    <View style={[styles.container, isUser ? styles.justifyEnd : styles.justifyStart]}>
      <View style={styles.bubbleWrapper}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        {timestamp ? <Text style={styles.timestamp}>{timestamp}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
    flexDirection: "row",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  justifyStart: {
    justifyContent: "flex-start",
  },
  bubbleWrapper: {
    flexDirection: "column",

  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: "80%",
  },
  bubbleUser: {
    backgroundColor: "#F2AE30",
    alignSelf: "flex-end",
    borderTopRightRadius: 0,
  },
  bubbleAI: {
    backgroundColor: "#999",
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    paddingHorizontal: 8,
    marginTop: 2,
  },
});
