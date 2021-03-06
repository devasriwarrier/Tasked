import React, { useState, useEffect, useContext } from "react";
import {
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import ForgotPassword from "./ForgotPassword";
import { useSelector } from "react-redux";
import Modal from "react-native-modal";
import { TextField, Button } from "react-native-ui-lib";
import Colors from "../assets/color";
import FirestoreQueryInitials from "../backend/FirestoreQueryInitials";
import { Context } from "../reducers/Store";
import { auth } from "../config/firebase";

//Set fields for Login Screen
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { navigation } = props;
  const [isModalVisible, setModalVisible] = useState(false);
  const uid = useSelector((state) => state.firebase.auth.uid);

  if (uid) {
    navigation.replace("Tasked");
  }
  //toggler for a popup
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //Verify credentials with firebase authenticator
  const login = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => {
        if (authUser.user.uid) {
          navigation.replace("Tasked");
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    //Set up screen and buttons for login feature
    <View>
      <KeyboardAvoidingView>
        <Modal
          isVisible={isModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <ForgotPassword isModalVisible={toggleModal} />
        </Modal>
        <TextField
          style={styles.inputBox}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          autoCapitalize="none"
          hideUnderline
        />
        <TextField
          style={styles.inputBox}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          secureTextEntry={true}
          hideUnderline
        />
        <Button
          label={"Login"} 
          color={Colors.black}
          style={styles.button}
          onPress={() => login()}
          backgroundColor={Colors.logoorange}
          enableShadow
          center
        />
      </KeyboardAvoidingView>
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.forgotpassword_text}>Forgot password?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "90%",
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 120,
    marginBottom: 25,
    alignItems: "center",
    borderColor: Colors.pumpkinOrange,
    borderRadius: 5,
    color: Colors.pumpkinOrange
  },
  forgotpassword_text: {
    fontSize: 14,
    color: Colors.logoorange,
  },
});

export default Login;
