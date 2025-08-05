import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { supabase } from '../lib/supabase';

export const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi giriniz.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp+irfan://reset-password", // deep link şeması, Expo Go ile test mümkün değil
    });

    setLoading(false);

    if (error) {
      Alert.alert("Hata", error.message);
    } else {
      Alert.alert("Başarılı", "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.", [
        {
          text: "Tamam",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#F2AE30" />
          </TouchableOpacity>

          <Text style={styles.title}>Şifremi Unuttum</Text>

          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name="email" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="E-posta adresi"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSendResetEmail}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#2e2e2e" />
            ) : (
              <Text style={styles.buttonText}>Gönder</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    color: "#ccc",
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2e2e2e",
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    height: 45,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    color: "#fff",
    flex: 1,
    height: "100%",
  },
  button: {
    borderRadius: 18,
    backgroundColor: "#F2AE30",
    borderColor: "gray",
    width: "80%",
    alignSelf: "center",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#2e2e2e",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
