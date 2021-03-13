import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const Appbar = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
};

export default Appbar;

const styles = StyleSheet.create({
  container: {
    //flex:1,
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#FCCF3E",
    height: 64,
    marginTop: 40,
    marginBottom: 15,
  },
  image: { height: 40, width: 40, borderRadius: 5 },
  text: {
    marginTop: 25,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
});
