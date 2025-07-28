import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const irfanLogo = require("../assets/irfan-logo.png");

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignUp, setIsSignUp] = React.useState(false);
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
      } else {
        Alert.alert("Hata", error.message || "Bir hata oluştu");
      }
    } catch (err: any) {
      Alert.alert("Hata", err.message || "Bir hata oluştu");
    }
  };

  const isDisabled = loading || !email.trim() || !password.trim();

  const handleGooglePress = () => {
    Alert.alert("Google simgesi tıklandı!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Animated.Image
              source={irfanLogo}
              style={[
                styles.glowImage,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.1, 0.5],
                  }),
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                      }),
                    },
                  ],
                },
              ]}
              blurRadius={10}
              resizeMode="contain"
            />

            <Image source={irfanLogo} style={styles.logo} resizeMode="contain" />
          </View>

          <Label style={styles.arabicTitle}>بسم الله الرحمن الرحيم</Label>
          <Label style={styles.title}>İrfan'a Hoş Geldiniz</Label>
          <Label style={styles.subtitle}>
            {isSignUp ? "Yeni hesap oluşturun" : "Hesabınıza giriş yapın"}
          </Label>

          <Input
            placeholder="E-posta adresi"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={{
              backgroundColor: "#000",
              borderColor: "#2e2e2e",
              borderWidth: 1,
              color: "#fff",
              marginBottom: 12,
              borderRadius: 16,
            }}
          />

          <Input
            placeholder="Şifre"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{
              backgroundColor: "#000",
              borderColor: "#2e2e2e",
              borderWidth: 1,
              color: "#fff",
              marginBottom: 12,
              borderRadius: 16,
            }}
          />

          <Button
            variant="default"
            size="lg"
            onPress={handleSubmit}
            disabled={isDisabled}
            style={isDisabled ? [styles.button, styles.buttonDisabled] : [styles.button]}
            textStyle={styles.buttonText}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : isSignUp ? (
              "Hesap Oluştur"
            ) : (
              "Giriş Yap"
            )}
          </Button>

          <View style={styles.linkContainer}>
            {!isSignUp && (
              <Button
                variant="link"
                size="default"
                onPress={() => console.log("Şifremi unuttum tıklandı")}
                style={styles.forgotButton}
                textStyle={styles.forgotText}
              >
                Şifremi Unuttum?
              </Button>
            )}

            <View style={styles.dividerWithText}>
              <View style={styles.line} />
              <Label style={styles.orText}>veya</Label>
              <View style={styles.line} />
            </View>

            <Button
              variant="link"
              size="default"
              onPress={() => setIsSignUp(!isSignUp)}
              style={styles.toggleButton}
              textStyle={styles.toggleText}
            >
              {isSignUp
                ? "Zaten hesabınız var mı? Giriş yapın"
                : "Hesabınız yok mu? Kayıt olun"}
            </Button>
          </View>
        </ScrollView>

        <View style={styles.googleButtonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGooglePress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="google" size={28} color="#4285F4" />
            <Label style={styles.googleText}>
              {isSignUp ? "ile kayıt ol" : "ile giriş yap"}
            </Label>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  logoContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  glowImage: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 18,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 18,
  },
  arabicTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#F2AE30",
    fontFamily: "Arial",
    marginBottom: 20,
  },
  title: {
    lineHeight: 28,
    color: "#fff",
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
  button: {
    marginTop: 10,
    borderColor: "gray",
    borderRadius: 18,
    backgroundColor: "#F2AE30",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 4,
  },
  forgotText: {
    color: "#bec9d3ff",
    fontSize: 12,
    textDecorationLine: "none",
  },
  dividerWithText: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#555",
  },
  orText: {
    marginHorizontal: 8,
    color: "#bec9d3ff",
    fontSize: 12,
    fontWeight: "500",
  },
  toggleButton: {
    alignSelf: "center",
  },
  toggleText: {
    color: "#bec9d3ff",
    fontSize: 14,
  },
  googleButtonContainer: {
    padding: 16,
    backgroundColor: "#000",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  googleText: {
    color: "#4285F4",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
});
