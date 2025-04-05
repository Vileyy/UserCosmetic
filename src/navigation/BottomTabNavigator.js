import React, { useRef, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ExploreScreen from "../screens/BottomTabs/ExploreScreen";
import NotificationsScreen from "../screens/BottomTabs/NotificationsScreen";
import ProfileScreen from "../screens/BottomTabs/ProfileScreen";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");
const height = 70;

// **Vẽ đường cong của Bottom Tab**
const CustomTabBackground = ({ color }) => {
  const d = `
    M0,0 
    L${width / 2 - 50},0 
    Q${width / 2},60 ${width / 2 + 50},0 
    L${width},0 
    L${width},${height} 
    L0,${height} 
    Z
  `;

  return (
    <Svg width={width} height={height} style={styles.tabBackground}>
      <Path fill={color} d={d} />
    </Svg>
  );
};

// **Custom Button ở giữa**
const CustomAddButton = ({ onPress }) => {
  // Thêm animation cho nút giữa
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Animation khi nhấn nút
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }),
    ]).start();

    // Gọi callback onPress gốc
    if (onPress) {
      onPress();
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={styles.addButtonContainer}
    >
      <Animated.View
        style={[
          styles.addButton,
          {
            transform: [{ scale: scaleAnim }, { rotate: rotate }],
          },
        ]}
      >
        <Ionicons name="add" size={35} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
  );
};

// **Component Animated Icon - Nâng cấp với nhiều hiệu ứng hơn**
const AnimatedTabIcon = ({ name, focused }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  // Animation cho icon label
  const labelPositionAnim = useRef(new Animated.Value(0)).current;
  const labelOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      // Animation scale
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1.0,
        useNativeDriver: true,
        friction: 5,
        tension: 50,
      }),
      // Animation di chuyển lên
      Animated.spring(translateYAnim, {
        toValue: focused ? -10 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 50,
      }),
      // Animation độ mờ
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      // Animation cho label
      Animated.timing(labelOpacityAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(labelPositionAnim, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        friction: 7,
      }),
    ]).start();
  }, [focused]);

  // Label position
  const labelTranslateY = labelPositionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  // Tạo hiệu ứng glow khi được chọn
  const glowStyle = focused
    ? {
        shadowColor: "#ff4081",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      }
    : {};

  return (
    <View style={{ alignItems: "center", width: 60 }}>
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: opacityAnim,
          },
          glowStyle,
        ]}
      >
        <Ionicons name={name} size={28} color={focused ? "#ff4081" : "#888"} />
      </Animated.View>

      {/* Label cho icon (tùy chọn hiển thị) */}
      {focused && (
        <Animated.Text
          style={{
            fontSize: 10,
            color: "#ff4081",
            fontWeight: "bold",
            marginTop: 4,
            opacity: labelOpacityAnim,
            transform: [{ translateY: labelTranslateY }],
          }}
        >
          {name === "home-outline"
            ? "HOME"
            : name === "search-outline"
            ? "SEARCH"
            : name === "heart-outline"
            ? "LIKES"
            : "PROFILE"}
        </Animated.Text>
      )}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Background cong */}
      <CustomTabBackground color="#fff" />

      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Explore") {
              iconName = "search-outline";
            } else if (route.name === "Notifications") {
              iconName = "notifications-outline"; 
            } else if (route.name === "Profile") {
              iconName = "person-outline";
            }
            return <AnimatedTabIcon name={iconName} focused={focused} />;
          },
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            height: height,
            bottom: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{ headerShown: false }}
        />

        {/* Nút Add ở giữa */}
        <Tab.Screen
          name="Add"
          component={HomeScreen}
          options={{
            tabBarButton: (props) => <CustomAddButton {...props} />,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </View>
  );
};

// **Style**
const styles = StyleSheet.create({
  tabBackground: {
    position: "absolute",
    bottom: 0,
    zIndex: -1,
  },
  addButtonContainer: {
    position: "absolute",
    top: -30,
    alignSelf: "center",
  },
  addButton: {
    backgroundColor: "#ff4081",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default BottomTabNavigator;
