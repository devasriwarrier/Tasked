import React ,{useState, useEffect} from "react";
import { TextInput, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { bindActionCreators } from "redux";
import ForgotPassword from "./ForgotPassword";
import Modal from "react-native-modal";
import { updateEmail, updatePassword, login, getUser } from "../actions/User";
import Firebase, { auth } from "../config/firebase";

import {
 
  TextField,

  Button,
  
} from "react-native-ui-lib";
import colors from "../assets/color";

const Login = (props) => 
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {navigation} = props;
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) =>{
        if(authUser){
          navigation.replace('Tasked');
        }
      });
      return unsubscribe();
   },[]) 
  
  const login = () => {
    auth.signInWithEmailAndPassword(email, password)
    .then((authUser)=>{
      if(authUser.user.uid){
        navigation.replace('Tasked')
      }
    })
    .catch((error) => alert(error.message));
  }

    return (
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
          onChangeText={(text)=> setEmail(text)}
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
          style={styles.button}
          onPress={() => login()}
          backgroundColor={colors.logoorange}
          enableShadow
          center
        />
        <Button
          label={"Forgot password?"}
          style={styles.forgotpassword}
          onPress={toggleModal}
          backgroundColor={colors.logoorange}
          enableShadow
          center
        />
      </KeyboardAvoidingView>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "90%",
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 120,
    alignItems: "center",
    borderColor: "#F6820D",
    borderRadius: 5,
  },
  forgotpassword: {
    paddingVertical: 15,
    paddingHorizontal: 120,
    //alignItems: "center",
    borderColor: "#F6820D",
    borderRadius: 2,
  },
});


export default Login;