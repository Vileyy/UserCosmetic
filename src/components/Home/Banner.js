import React from "react";
import { View, Image, StyleSheet } from "react-native";

const Banner = () => {
  return (
    <View style={styles.bannerContainer}>
      <Image source={require("../../assets/image.png")} style={styles.banner} />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: "90%",
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 15,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default Banner;
