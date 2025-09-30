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
    marginBottom: 12,
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
    maxWidth: "80%",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    minWidth: 40,
    flexShrink: 1,
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
    flexShrink: 1,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    paddingHorizontal: 4,
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
