import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
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
    } catch (error) {
      // Hata yönetimi auth hook'ta
    }
  };

  return (
    <View style={styles.container}>
      <Image source={irfanLogo} style={styles.logo} />

      <Text style={styles.arabicTitle}>بسم الله الرحمن الرحيم</Text>
      <Text style={styles.title}>İrfan'a Giriş</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Yeni hesap oluşturun' : 'Hesabınıza giriş yapın'}</Text>

      <Text style={styles.label}>E-posta Adresi</Text>
      <TextInput
        style={styles.input}
        placeholder="ornek@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isSignUp && <Text style={styles.note}>En az 6 karakter olmalıdır</Text>}

      <TouchableOpacity
        style={[styles.button, (loading || !email.trim() || !password.trim()) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !email.trim() || !password.trim()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
        </Text>
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#444",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#336699",
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 16,
    alignItems: "center",
  },
  toggleText: {
    color: "#336699",
    fontSize: 14,
  },
});
