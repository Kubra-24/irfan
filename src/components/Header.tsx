import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, History } from "lucide-react-native";

interface HeaderProps {
  onOpenMenu?: () => void;
  onOpenHistory?: () => void;
}

const irfanLogo = require("../assets/irfan-logo.png");

export const Header = ({ onOpenMenu, onOpenHistory }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image source={irfanLogo} style={styles.logo} />
        <Text style={styles.title}>İrfan</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onOpenHistory} style={styles.iconButton}>
          <History color="#0f172a" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
          <Menu color="#0f172a" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // yarı saydam beyaz
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 120, 120, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  right: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
