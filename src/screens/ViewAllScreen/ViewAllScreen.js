import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation, useRoute } from "@react-navigation/native";

const ViewAllScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category, title } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productList = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((item) => item.category === category);

        setProducts(productList);
      }
    });

    return () => unsubscribe();
  }, [category]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() =>
        navigation.navigate("ProductDetailScreen", { product: item })
      }
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productPrice}>
        {parseInt(item.price).toLocaleString("vi-VN")} VNĐ
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#e74c3c",
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default ViewAllScreen;
