import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, off } from "firebase/database";

const ExploreScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("name");

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    const fetchData = () => {
      onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((item) => item?.image && item?.name); // Lọc chỉ lấy sản phẩm có ảnh & tên

          setProducts(productsArray);
          setFilteredProducts(productsArray);
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        setLoading(false);
      });
    };

    fetchData();
    return () => {
      off(productsRef);
    };
  }, []);

  // 🔎 Xử lý tìm kiếm
  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);
      if (text.trim() === "") {
        setFilteredProducts(products);
      } else {
        const results = products.filter((item) =>
          item?.name?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(results);
      }
    },
    [products]
  );

  // 🔽 Sắp xếp sản phẩm
  const sortProducts = useCallback(
    (type) => {
      let sorted = [...filteredProducts];

      if (type === "name") {
        sorted.sort((a, b) => a?.name?.localeCompare(b?.name));
      } else if (type === "price_asc") {
        sorted.sort((a, b) => (parseFloat(a?.price) || 0) - (parseFloat(b?.price) || 0));
      } else if (type === "price_desc") {
        sorted.sort((a, b) => (parseFloat(b?.price) || 0) - (parseFloat(a?.price) || 0));
      }

      setSortType(type);
      setFilteredProducts(sorted);
    },
    [filteredProducts]
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        {[
          { label: "Tên", type: "name" },
          { label: "Giá ↑", type: "price_asc" },
          { label: "Giá ↓", type: "price_desc" },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.type}
            style={[
              styles.filterButton,
              sortType === filter.type && styles.activeFilter,
            ]}
            onPress={() => sortProducts(filter.type)}
          >
            <Text
              style={[
                styles.filterText,
                sortType === filter.type && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hiển thị loading */}
      {loading ? (
        <ActivityIndicator size="large" color="#ff6f61" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            if (!item?.image || !item?.name) return null;

            return (
              <TouchableOpacity
                style={styles.productItem}
                onPress={() => {
                  navigation.navigate("ProductDetailScreen", { product: item });
                }}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {parseInt(item.price || 0).toLocaleString()}đ
                  </Text>
                  {item.description && (
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.productDescription}>
                      {item.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
    marginBottom: 65,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeFilter: {
    backgroundColor: "#ff6f61",
  },
  activeFilterText: {
    color: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productItem: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    alignItems: "center",
  },
  productImage: {
    width: 170,
    height: 180,
    resizeMode: "cover",
    marginBottom: 8,
  },
  productInfo: {
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#ff6f61",
    fontWeight: "bold",
    marginVertical: 4,
  },
  productDescription: {
    fontSize: 13,
    color: "#666",
    textAlign: "left",
    marginHorizontal: 8,
    marginBottom: 10,
    lineHeight: 18,
  },
});

export default ExploreScreen;
