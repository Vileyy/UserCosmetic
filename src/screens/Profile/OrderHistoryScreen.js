import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const ordersRef = ref(db, `orders/${userId}`);
    onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        setOrders(Object.values(snapshot.val()));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử mua hàng</Text>
      {loading ? <ActivityIndicator size="large" color="#007BFF" /> : null}
      {orders.length === 0 ? (
        <Text style={styles.noOrder}>Bạn chưa có đơn hàng nào.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>Sản phẩm: {item.productName}</Text>
              <Text style={styles.orderText}>Giá: {item.price} VNĐ</Text>
              <Text style={styles.orderText}>Ngày: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noOrder: {
    textAlign: "center",
    color: "gray",
  },
  orderItem: {
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
  },
});

export default OrderHistoryScreen;
