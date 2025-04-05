import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Home/Header";
import Banner from "../../components/Home/Banner";
import FlashDeals from "../../components/Home/FlashDeals";
import Categories from "../../components/Home/Categories";
import Brands from "../../components/Home/Brands";
import NewProducts from "../../components/Home/NewProducts";

const HomeScreen = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]); // Danh sách sản phẩm từ Firebase
  const [suggestions, setSuggestions] = useState([]); // Gợi ý sản phẩm khi nhập
  const navigation = useNavigation();

  useEffect(() => {
    // Kết nối với Firebase để lấy danh sách sản phẩm
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

  // 📌 Tạo danh sách gợi ý khi nhập
  const handleSearchChange = (text) => {
    setSearch(text);

    if (!text.trim()) {
      setSuggestions([]); // Xóa gợi ý nếu không có nội dung
      return;
    }

    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5)); // Giới hạn hiển thị 5 gợi ý
  };

  // 📌 Xử lý khi nhấn Enter
  const handleSearchSubmit = () => {
    if (search.trim()) {
      setSuggestions([]); // Ẩn danh sách gợi ý khi tìm kiếm
      navigation.navigate("SearchScreen", { initialSearch: search });
    }
  };

  // 📌 Xử lý khi nhấn vào sản phẩm trong danh sách gợi ý
  const handleProductSelect = (product) => {
    setSuggestions([]); // Ẩn gợi ý
    navigation.navigate("ProductDetailScreen", { product }); // Chuyển sang trang chi tiết sản phẩm
  };

  // 📌 Hàm xử lý tiền VND
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh Header */}
      <Header
        search={search}
        setSearch={handleSearchChange} // Gọi hàm mới để cập nhật gợi ý
        handleSearchSubmit={handleSearchSubmit}
      />

      {/* Danh sách gợi ý */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleProductSelect(item)} // Chuyển sang trang chi tiết sản phẩm
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.suggestionImage}
                />
                <View>
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.suggestionPrice}>
                    {formatCurrency(item.price)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <ScrollView
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Nội dung chính */}
        <View style={styles.content}>
          <Banner />
          <FlashDeals
            onPress={(product) =>
              navigation.navigate("ProductDetailScreen", { product })
            }
          />
          <Categories onPress={handleSearchChange} />
          <Brands onPress={handleSearchChange} />
          <NewProducts products={products} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F08080",
    marginTop: -40,
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  suggestionsContainer: {
    backgroundColor: "white",
    position: "absolute",
    top: 100, 
    left: 20,
    right: 20,
    zIndex: 1,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 40,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  suggestionPrice: {
    fontSize: 14,
    color: "#FF5733", 
    fontWeight: "bold",
    marginTop: 3,
  },
});

export default HomeScreen;
