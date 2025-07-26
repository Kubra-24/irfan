import React from "react";
import { Text, StyleSheet, View, ViewStyle, TextStyle } from "react-native";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
}

const colors = {
  default: {
    backgroundColor: "#3b82f6", // primary bg
    borderColor: "transparent",
    textColor: "#ffffff", // primary foreground
    hoverBg: "#2563eb", // primary/80 hover color (not used in RN)
  },
  secondary: {
    backgroundColor: "#64748b", // secondary bg
    borderColor: "transparent",
    textColor: "#f1f5f9", // secondary fg
    hoverBg: "#475569",
  },
  destructive: {
    backgroundColor: "#ef4444", // destructive bg
    borderColor: "transparent",
    textColor: "#ffffff", // destructive fg
    hoverBg: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: "#000000", // or use theme
    textColor: "#000000",
  },
};

export function Badge({
  variant = "default",
  style,
  textStyle,
  children,
}: BadgeProps) {
  const variantColors = colors[variant];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantColors.backgroundColor,
          borderColor: variantColors.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: variantColors.textColor }, textStyle]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 10, // approx px-2.5
    paddingVertical: 2, // approx py-0.5
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 12, // text-xs
    fontWeight: "600", // font-semibold
  },
});
