import React from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text, View, Image } from "react-native";
import { ColorSwatch } from "react-native-ui-lib";
import AntDesign from "react-native-vector-icons/AntDesign";
import Colors from "../assets/color";

const AppbarWBackButton = (props) => {
  //function for the top yellow UI design passings props in function and returning views
  const press = () => {
    props.nav.navigate("Tasked");
  };
  return (
    <View style={styles.container}>
      <View style={styles.items}>
        <View style={{ alignItems: "center", alignContent: "center", flex: 2 }}>
          <TouchableOpacity onPress={press}>
            <AntDesign name="arrowleft" color={Colors.black} size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center", flex: 9, marginRight: 60 }}>
          <Text style={styles.text}>{props.title}</Text>
        </View>
      </View>
    </View>
  );
};

export default AppbarWBackButton;

const styles = StyleSheet.create({
  container: {
    alignContent: "center",

    backgroundColor: Colors.orange,
    height: 108,
  },
  items: {
    marginTop: 65,

    flexDirection: "row",
  },
  image: { height: 40, width: 40, borderRadius: 5 },
  text: {
    alignItems: "center",
    color: Colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
});
