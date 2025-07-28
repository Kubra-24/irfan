import React, { forwardRef } from "react"
import { Switch as RNSwitch, View, StyleSheet, Platform } from "react-native"

interface SwitchProps {
  value: boolean
  onValueChange?: (value: boolean) => void
  disabled?: boolean
  style?: object
}

const Switch = forwardRef<RNSwitch, SwitchProps>(({ value, onValueChange, disabled, style }, ref) => {
  return (
    <View style={[styles.switchContainer, style]}>
      <RNSwitch
        ref={ref}
        trackColor={{ false: "#d1d5db", true: "#2563eb" }} // unchecked: gray-300, checked: blue-600 (örnek)
        thumbColor={Platform.OS === "android" ? (value ? "#3b82f6" : "#f9fafb") : undefined} // iOS otomatik
        ios_backgroundColor="#d1d5db"
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
        style={styles.switch}
      />
    </View>
  )
})

Switch.displayName = "Switch"

const styles = StyleSheet.create({
  switchContainer: {
    // Radix'teki dış container benzeri (boyut ve border-radius)
    width: 44, // 11 * 4 (rem to px approx)
    height: 24, // 6 * 4
    borderRadius: 24 / 2,
    justifyContent: "center",
  },
  switch: {
    // ekstra stil istersen
  },
})

export { Switch }
