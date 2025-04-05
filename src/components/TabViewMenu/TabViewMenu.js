import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TabViewMenu = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          {/* ❌ Nút đóng menu */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>

          {/* 🏠 Các mục trong menu */}
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="home-outline" size={24} color="black" />
            <Text style={styles.menuText}>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="black" />
            <Text style={styles.menuText}>Tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="black" />
            <Text style={styles.menuText}>Cài đặt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },
  menu: {
    width: "75%",
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    paddingTop: 50,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
  },
});

export default TabViewMenu;
