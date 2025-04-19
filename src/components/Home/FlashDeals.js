import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const FlashDeals = () => {
  const [flashDeals, setFlashDeals] = useState([]);
  const [countdown, setCountdown] = useState(3600); 
  const navigation = useNavigation(); 

  useEffect(() => {
    const db = getDatabase();
    const flashDealsRef = ref(db, "products");

    onValue(flashDealsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const productsArray = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .filter((product) => product.category === "FlashDeals");

        setFlashDeals(productsArray);
      }
    });
  }, []);

  // Hàm định dạng thời gian hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Đếm ngược
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  //Xử lý khi bấm vào sản phẩm
  const handlePress = (product) => {
    navigation.navigate("ProductDetailScreen", { product });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>
          {parseInt(item.price).toLocaleString()}₫
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🔥 Chỉnh phần tiêu đề + đồng hồ */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🔥 Flash Deals</Text>
          <Text style={styles.timer}>⏳ {formatTime(countdown)}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flashDealsBackground}>
        <FlatList
          data={flashDeals}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8, 
  },
  timer: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red", 
  },
  viewAll: {
    fontSize: 16,
    color: "black",
  },
  flashDealsBackground: {
    backgroundColor: "#ffeaea",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    width: 170,
    height: 240,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    borderRadius: 8,
  },
  infoContainer: {
    width: "100%",
    marginTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
  },
  price: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
    marginVertical: 3,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "left",
  },
});

export default FlashDeals;
