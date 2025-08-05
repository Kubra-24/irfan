import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Menu, History, ArrowLeft } from "lucide-react-native";

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  onOpenMenu?: () => void;
  onOpenHistory?: () => void;
  onBack?: () => void;
  showMenu?: boolean;
  showHistory?: boolean;
  rightComponent?: React.ReactNode;  // Yeni prop
}

const irfanLogo = require("../assets/irfan-logo.png");

export const Header = ({
  title = "İrfan",
  showLogo = true,
  onOpenMenu,
  onOpenHistory,
  onBack,
  showMenu,
  showHistory,
  rightComponent,  // Yeni prop
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft color="#CCCCCC" size={22} />
          </TouchableOpacity>
        )}
        {showLogo && <Image source={irfanLogo} style={styles.logo} />}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        {showHistory && (
          <TouchableOpacity onPress={onOpenHistory} style={styles.iconButton}>
            <History color="#CCCCCC" size={20} />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
            <Menu color="#CCCCCC" size={20} />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1e1e1e",
    borderBottomColor: "rgba(120, 120, 120, 0.2)",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    color: "#CCCCCC",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
});
