import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Toast from "react-native-toast-message";
import FontAwesome from "react-native-vector-icons/FontAwesome";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  // Xử lý đăng nhập bằng Email & Password
  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "⚠️ Vui lòng nhập đầy đủ thông tin!",
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({ type: "success", text1: "🎉 Đăng nhập thành công!" });
      setTimeout(() => navigation.replace("Home"), 1200);
    } catch (error) {
      let errorMessage = "❌ Đăng nhập thất bại!";
      if (error.code === "auth/invalid-email")
        errorMessage = "⚠️ Email không hợp lệ!";
      if (error.code === "auth/wrong-password")
        errorMessage = "⚠️ Mật khẩu sai!";
      if (error.code === "auth/user-not-found")
        errorMessage = "⚠️ Tài khoản không tồn tại!";

      Toast.show({ type: "error", text1: errorMessage });
    }
  };

  // Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "218027957302-o7co3ik6e42l4je5mom4794obbsqkifc.apps.googleusercontent.com",
    iosClientId:
      "218027957302-1dajlj214el9mfk9292i9mae8gb6ehhj.apps.googleusercontent.com",
    expoClientId:
      "218027957302-0701f4nltsji54gdknpn9j2uljg52qs7.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          Toast.show({
            type: "success",
            text1: "🎉 Đăng nhập Google thành công!",
          });
          setTimeout(() => navigation.replace("Home"), 1500);
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "❌ Đăng nhập Google thất bại!",
            text2: error.message,
          });
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
      </View>

      {/* Form đăng nhập */}
      <View style={styles.box}>
        <Text style={styles.title}>Đăng nhập</Text>

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

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <Text style={styles.separator}>Hoặc</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialIcon}
            onPress={() => promptAsync()}
          >
            <FontAwesome name="google" size={30} color="red" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="facebook" size={30} color="#1877F2" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="apple" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.btnLogin} onPress={handleLogin}>
          <Text style={styles.btnText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.text}>
          Chưa có tài khoản?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            Đăng ký ngay
          </Text>
        </Text>
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
  },
  logoContainer: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 300,
    marginTop: 60,
    resizeMode: "contain",
  },
  box: {
    backgroundColor: "white",
    width: "100%",
    height: "54%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  forgotPassword: {
    textAlign: "right",
    color: "black",
    marginBottom: 10,
  },
  separator: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  btnLogin: {
    backgroundColor: "#FF6699",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
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
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  socialIcon: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
});

export default LoginScreen;
