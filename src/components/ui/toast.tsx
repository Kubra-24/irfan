// components/Toast.tsx
import React from "react"
import Toast, { BaseToast, ErrorToast, ToastConfig } from "react-native-toast-message"
import { StyleSheet } from "react-native"

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.success}
      contentContainerStyle={styles.content}
      text1Style={styles.successText1}
      text2Style={styles.successText2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.error}
      text1Style={styles.errorText1}
      text2Style={styles.errorText2}
    />
  ),
}

export default function AppToast() {
  return <Toast config={toastConfig} />
}

const styles = StyleSheet.create({
  success: {
    borderLeftColor: "#22c55e", // Tailwind green-500
    backgroundColor: "#ecfdf5", // green-50
  },
  error: {
    borderLeftColor: "#ef4444", // Tailwind red-500
    backgroundColor: "#fef2f2", // red-50
  },
  content: {
    paddingHorizontal: 15,
  },
  successText1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#166534", // green-800
  },
  successText2: {
    fontSize: 13,
    color: "#166534",
  },
  errorText1: {
    fontSize: 15,
    fontWeight: "600",
    color: "#991b1b", // red-800
  },
  errorText2: {
    fontSize: 13,
    color: "#991b1b",
  },
})
