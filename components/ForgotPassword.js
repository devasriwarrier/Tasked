import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-ui-lib";
import Colors from "../assets/color";
import { auth } from "../config/firebase";

const ForgotPassword = (props) => {
  //function which passes email, setEmail as props
  const [email, setEmail] = useState("");
  const submit = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        //if authentication passes, alert sent
        Alert.alert("Password reset link has been sent to: " + email);
      })
      .catch(() => {
        Alert.alert(
          //catch function if email does not exist
          "Email " + email + " does not exist. Please try different email."
        );
      });
    setEmail("");
  };

  return (
    //Set up a pop-up screen for forgot password feature
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.x_btn_container}
        onPress={props.isModalVisible}
      >
        <Image style={styles.x_btn} source={require("../assets/x_btn.png")} />
      </TouchableOpacity>
      <View style={styles.title_container}>
        <Text style={styles.title_text}>FORGOT PASSWORD</Text>
      </View>
      <Text style={styles.label}>Email</Text>
      <KeyboardAvoidingView>
        <View style={styles.email_input_container}>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter existing email to reset password"
            onChangeText={(email) => {
              setEmail(email);
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity>
        <Button
          label={"Submit"}
          style={styles.button}
          color={Colors.black}
          backgroundColor={Colors.logoorange}
          onPress={() => {
            submit();
          }}
          enableShadow
          center
        />
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    width: "100%",
    marginBottom: 50,
    borderRadius: 5,
  },
  title_container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  title_text: {
    fontSize: 24,
  },
  label: {
    fontSize: 16,
    marginLeft: 20,
    marginTop: 45,
  },
  inputBox: {
    marginHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    borderColor: Colors.grey,
    borderRadius: 5,
  },
  email_input_container: {
    marginTop: 20,
    height: 52,
    borderRadius: 5,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
  },
  button: {
    alignItems: "center",
    borderColor: Colors.pumpkinOrange,
    borderRadius: 5,
    marginTop: 40,
    marginHorizontal: 33,
  },
  x_btn_container: {
    height: 21,
    width: 21,
    alignSelf: "flex-end",
    marginTop: 21,
    marginRight: 21,
  },
});
