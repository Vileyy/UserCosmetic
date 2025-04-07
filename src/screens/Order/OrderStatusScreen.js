import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image
} from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const OrderStatusScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = auth.currentUser.uid;
        const database = getDatabase();
        const ordersRef = ref(database, `users/${userId}/orders`);

        onValue(ordersRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const ordersList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setOrders(ordersList);
          } else {
            setOrders([]);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f39c12"; // Vàng
      case "processing":
        return "#3498db"; // Xanh dương
      case "shipped":
        return "#2ecc71"; // Xanh lá
      case "delivered":
        return "#27ae60"; // Xanh lá đậm
      case "cancelled":
        return "#e74c3c"; // Đỏ
      default:
        return "#95a5a6"; // Xám
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "processing":
        return "construct-outline";
      case "shipped":
        return "car-outline";
      case "delivered":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const renderOrderItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    const statusText = getStatusText(item.status);
    const statusIcon = getStatusIcon(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.orderCard}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
          <Text style={styles.orderNumber}>Đơn hàng #{item.id.slice(-6)}</Text>
        </View>
        
        <View style={styles.orderContent}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>
              {item.items?.length} sản phẩm • {item.total?.toLocaleString('vi-VN')} đ
            </Text>
            <Text style={styles.orderAddress} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} >
              <Ionicons name={statusIcon} size={16} color="white" />
            </View>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
        
        <View style={styles.orderFooter}>
          <TouchableOpacity 
            style={styles.trackButton}
            onPress={() => navigation.navigate("OrderTracking", { orderId: item.id })}
          >
            <Ionicons name="navigate-outline" size={16} color="#3498db" />
            <Text style={styles.trackButtonText}>Theo dõi</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.productImages}>
          {/* Hiển thị ảnh sản phẩm lấy từ Cloudinary */}
          {item.items && item.items.map((product, index) => (
            <Image
              key={index}
              source={{ uri: product.image }} // Đường dẫn từ Cloudinary
              style={styles.productImage}
            />
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tình trạng đơn hàng</Text>
      </View>
      
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  orderNumber: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  orderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#ecf0f1",
  },
  trackButtonText: {
    marginLeft: 4,
    color: "#3498db",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 16,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  productImages: {
    flexDirection: "row",
    marginTop: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default OrderStatusScreen;
