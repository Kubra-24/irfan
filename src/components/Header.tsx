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
  rightComponent?: React.ReactNode;
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
  rightComponent,
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Sol kısım */}
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <ArrowLeft color="#CCC" size={22} />
          </TouchableOpacity>
        )}
        {showLogo && <Image source={irfanLogo} style={styles.logo} />}
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Sağ kısım */}
      <View style={styles.right}>
        {showHistory && (
          <TouchableOpacity onPress={onOpenHistory} style={styles.iconButton}>
            <History color="#CCC" size={20} />
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity onPress={onOpenMenu} style={styles.iconButton}>
            <Menu color="#CCC" size={20} />
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
  
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 50,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#CCC",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    marginLeft: -4,
  },
});
