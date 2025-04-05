import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { getDatabase } from "firebase/database";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDX6MhpcOj_mMvGV6NYYsfU4by29TNAYrE",
  authDomain: "admincosmetic-8f098.firebaseapp.com",
  databaseURL:
    "https://admincosmetic-8f098-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admincosmetic-8f098",
  storageBucket: "admincosmetic-8f098.appspot.com",
  messagingSenderId: "218027957302",
  appId: "1:218027957302:web:bbbe2085cee23feee10c97",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Sử dụng AsyncStorage để giữ trạng thái đăng nhập
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Xuất các dịch vụ Firebase để sử dụng trong dự án
export { auth };
export const database = getDatabase(app);
