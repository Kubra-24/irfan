import React, { useState } from "react";
import { View, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const irfanLogo = require("../assets/irfan-logo.png");

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;

    if (isSignUp && password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (!error) {
        onSuccess();
      }
    } catch {
      // Hata yönetimi useAuth içinde yapılır
    }
  };

  const isDisabled = loading || !email.trim() || !password.trim();

  return (
    <View style={styles.container}>
      <Image source={irfanLogo} style={styles.logo} />

      <Label style={styles.arabicTitle}>بسم الله الرحمن الرحيم</Label>
      <Label style={styles.title}>İrfan'a Giriş</Label>
      <Label style={styles.subtitle}>
        {isSignUp ? "Yeni hesap oluşturun" : "Hesabınıza giriş yapın"}
      </Label>

      <Label>E-posta Adresi</Label>
      <Input
        placeholder="ornek@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Label>Şifre</Label>
      <Input
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isSignUp && <Label style={styles.note}>En az 6 karakter olmalıdır</Label>}

      <Button
        variant="default"
        size="lg"
        onPress={handleSubmit}
        disabled={isDisabled}
        style={isDisabled ? [styles.button, styles.buttonDisabled] : [styles.button]}
        textStyle={styles.buttonText}
      >
        {loading ? <ActivityIndicator color="#fff" /> : isSignUp ? "Hesap Oluştur" : "Giriş Yap"}
      </Button>

      <Button
        variant="link"
        size="default"
        onPress={() => setIsSignUp(!isSignUp)}
        style={styles.toggleButton}
        textStyle={styles.toggleText}
      >
        {isSignUp ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    borderRadius: 16,
  },
  arabicTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#336699",
    fontFamily: "Arial",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  toggleText: {
    color: "#336699",
    fontSize: 14,
  },
});
