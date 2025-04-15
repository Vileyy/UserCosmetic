import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { registerUser } from "../services/authService";
import Toast from "react-native-toast-message";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ thông tin!",
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu phải từ 6 ký tự trở lên!",
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu không khớp!",
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đăng ký thành công!",
      });
      setTimeout(() => navigation.navigate("Login"), 1500);
    } catch (error) {
      Toast.show({ type: "error", text1: "Lỗi", text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/logo.png")} style={styles.image} />

      {/* Khung chứa form */}
      <View style={styles.box}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Nút đăng ký */}
        <TouchableOpacity
          style={styles.btn_register}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btn_text}>Đăng ký</Text>
          )}
        </TouchableOpacity>

        {/* Chuyển sang màn hình đăng nhập */}
        <Text style={styles.text}>
          Đã có tài khoản?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Đăng nhập ngay
          </Text>
        </Text>
      </View>

      {/* Hiển thị Toast */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 350,
  },
  box: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: "100%",
    height: "55%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    bottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  btn_register: {
    backgroundColor: "#FF6699",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btn_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    textAlign: "center",
    marginTop: 15,
    color: "black",
  },
  link: {
    color: "#FF6699",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
