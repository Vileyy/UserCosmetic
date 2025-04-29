import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabViewMenu from "../TabViewMenu/TabViewMenu";
import { useCart } from "../../context/CartContext"; 
import { useNavigation } from "@react-navigation/native";

const Header = ({ search, setSearch, handleSearchSubmit }) => {
  const navigation = useNavigation(); // Lấy navigation từ hook
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { cart } = useCart(); 

  // Tính tổng số sản phẩm trong giỏ hàng
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsMenuVisible(true)}
      >
        <Ionicons name="menu-outline" size={28} color="black" />
      </TouchableOpacity>

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

      {/*Thông báo */}
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </TouchableOpacity>

      {/*Giỏ hàng */}
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={() => navigation.navigate("Cart")} // Chuyển hướng sang giỏ hàng
      >
        <Ionicons name="cart-outline" size={24} color="black" />
        {/* Hiển thị số lượng sản phẩm trong giỏ hàng nếu có */}
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/*Menu trượt từ trái vào */}
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
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
