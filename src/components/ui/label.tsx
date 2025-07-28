import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

interface LabelProps extends TextProps {
  disabled?: boolean;
  className?: any; // Eğer ekstra stil geçmek istersen
}

export const Label = React.forwardRef<Text, LabelProps>(
  ({ style, disabled, children, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        style={[styles.label, disabled && styles.disabled, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm karşılığı yaklaşık
    fontWeight: "500", // medium
    lineHeight: 18, // leading-none gibi sıkı satır aralığı
    color: "#000", // default siyah, istersen tema ile değiştirilebilir
  },
  disabled: {
    opacity: 0.7,
  },
});
