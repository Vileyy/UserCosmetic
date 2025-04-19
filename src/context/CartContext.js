import React, { createContext, useContext, useState, useEffect } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();
  const db = getDatabase();

  // Lưu giỏ hàng vào Firebase
  const saveCartToFirebase = (updatedCart) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    set(ref(db, `users/${userId}/cart`), updatedCart);
  };

  // Load giỏ hàng từ Firebase khi đăng nhập
  const loadCartFromFirebase = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const cartRef = ref(db, `users/${userId}/cart`);
    onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCart(data);
      }
    });
  };

  useEffect(() => {
    if (auth.currentUser) {
      loadCartFromFirebase(); // Tải giỏ hàng từ Firebase khi đăng nhập
    }
  }, [auth.currentUser]);

  // Lưu giỏ hàng vào Firebase mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    if (auth.currentUser) {
      saveCartToFirebase(cart);
    }
  }, [cart, auth.currentUser]);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1, selected: false }];
      }
    });
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Chọn hoặc bỏ chọn sản phẩm trong giỏ hàng
  const toggleSelect = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleSelect,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
