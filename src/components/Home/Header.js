import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabViewMenu from "../TabViewMenu/TabViewMenu";

const Header = ({ search, setSearch, handleSearchSubmit }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <View style={styles.header}>
      {/* 🏠 Icon mở menu */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsMenuVisible(true)}
      >
        <Ionicons name="menu-outline" size={28} color="black" />
      </TouchableOpacity>

      {/* 🔍 Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
        />
      </View>

      {/* 🔔 Thông báo */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>

      {/* 🛒 Giỏ hàng */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="cart-outline" size={24} color="black" />
      </TouchableOpacity>

      {/* 🚀 Menu trượt từ trái vào */}
      <TabViewMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F08080",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 50,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  iconButton: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 8,
    marginHorizontal: 10,
    marginTop: 50,
    marginLeft: -2,
  },
});

export default Header;
