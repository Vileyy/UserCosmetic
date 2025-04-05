import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const SearchScreen = ({ route, navigation }) => {
  const { initialSearch = "" } = route.params || {};
  const [search, setSearch] = useState(initialSearch);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setProducts(productsArray);
      }
    });
  }, []);

  const filterProducts = useCallback(
    (keyword, data) => {
      if (!keyword) {
        setFilteredProducts([]);
        return;
      }

      const filtered = data.filter((product) => {
        const name = product.name ? product.name.toLowerCase() : "";
        const category = product.category ? product.category.toLowerCase() : "";
        const brand = product.brand ? product.brand.toLowerCase() : "";

        return (
          name.includes(keyword.toLowerCase()) ||
          category.includes(keyword.toLowerCase()) ||
          brand.includes(keyword.toLowerCase())
        );
      });

      setFilteredProducts(filtered);
    },
    [setFilteredProducts]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (products.length > 0) {
        filterProducts(search, products);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, products]);

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm sản phẩm..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Danh sách kết quả tìm kiếm */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("ProductDetailScreen", { product: item })
            }
          >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>💰 {item.price} VND</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResult}>Không tìm thấy sản phẩm nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 40,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#d9534f",
  },
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
});

export default SearchScreen;
