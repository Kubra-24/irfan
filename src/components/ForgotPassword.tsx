import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const ForgotPassword = ({ navigation }: any) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (step === 2) {
      setTimer(120);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSend = () => {
    if (!email.trim() && !phone.trim()) {
      Alert.alert("Hata", "Lütfen e-posta adresi veya telefon numarası girin.", [{ text: "Tamam" }]);
      return;
    }
    if (email.trim() && phone.trim()) {
      Alert.alert("Hata", "E-posta veya telefon numarasından sadece birini giriniz.", [{ text: "Tamam" }]);
      return;
    }
    if (phone.trim() && phone.trim().length < 11) {
      Alert.alert("Hata", "Lütfen telefon numaranızı en az 11 hane olacak şekilde doğru giriniz.", [{ text: "Tamam" }]);
      return;
    }

    Alert.alert(
      "Başarılı",
      email.trim()
        ? "E-posta adresinize şifre yenileme kodu gönderildi."
        : "Telefonunuza şifre yenileme kodu SMS olarak gönderildi.",
      [{ text: "Tamam", onPress: () => setStep(2) }]
    );
  };

  const handleReset = () => {
    const fullCode = code.join("");
    if (fullCode.length !== 4 || code.some((c) => c === "")) {
      Alert.alert("Hata", "Lütfen 4 haneli kodu eksiksiz giriniz.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi.", [
      { text: "Tamam", onPress: () => navigation.goBack() },
    ]);
  };

  const handleCodeChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
    if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current?.focus();
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

         
          <TouchableOpacity
            onPress={() => {
              if (step === 2) {
                setStep(1);
              } else {
                navigation.goBack();
              }
            }}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#F2AE30" />
          </TouchableOpacity>

          <Text style={styles.title}>{step === 1 ? "Şifremi Unuttum" : "Şifre Yenile"}</Text>

          {step === 1 && (
            <>
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
                />
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>veya</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="phone" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon numarası"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSend}>
                <Text style={styles.buttonText}>Gönder</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              {/* Sağ Üst Kapatma Butonu */}
              <TouchableOpacity onPress={() => navigation.navigate("Auth")} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#F2AE30" />
              </TouchableOpacity>

              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={inputRefs[index]}
                    style={styles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    placeholder=" "
                    placeholderTextColor="#999"
                    textAlign="center"
                  />
                ))}
              </View>

              <Text style={styles.infoText}>Lütfen gönderilen kodu giriniz</Text>
              <Text style={styles.timerText}>Kalan süre: {formatTime(timer)}</Text>

              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons name="lock" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni şifre"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialCommunityIcons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <MaterialCommunityIcons
                  name="lock-check"
                  size={20}
                  color="#999"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre (Tekrar)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
              </TouchableOpacity>
            </>
          )}
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
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
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
    marginBottom: 16,
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
  eyeButton: {
    paddingHorizontal: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  line: {
    width: 50,
    height: 1,
    backgroundColor: "#2e2e2e",
  },
  orText: {
    marginHorizontal: 12,
    color: "#CCCCCC",
    fontWeight: "600",
    fontSize: 14,
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
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    width: "60%",
    alignSelf: "center",
  },
  codeInput: {
    borderWidth: 1,
    borderColor: "#2e2e2e",
    borderRadius: 8,
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: 50,
    height: 50,
    backgroundColor: "#000",
  },
  infoText: {
    color: "#CCCCCC",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  timerText: {
    color: "#F2AE30",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
});
