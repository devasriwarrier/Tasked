import React, { useState, useEffect, useContext } from "react";
import Appbar from "./Appbar";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import Modal from "react-native-modal";
import EditProfile from "./EditProfile";

import { Context } from "../reducers/Store";
import FirestoreQueryInitials from "../backend/FirestoreQueryInitials";

import { db, auth } from "../config/firebase";
import Colors from "../assets/color";
//Set up Profile Screen with username and fullname
const Profile = (props) => {
  //hook function in react to declare local variable for the state
  const [username, setUserName] = useState(auth.currentUser.displayName);
  const [email, setEmail] = useState(auth.currentUser.email);
  const [isModalVisible, setModalVisible] = useState(false);
  const [initial, setInitial] = useState("");
  const [user, setUser] = useState({});

  const fireinitial = () => {
    db.collection("users").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        try {
          if (auth.currentUser.uid == documentSnapshot.data().uid) {
            setUser(documentSnapshot.data());
            const fullName = documentSnapshot.data().fullname;
            const i = fullName.charAt(0) + fullName.charAt(1);
            setInitial(i.toUpperCase());
          }
        } catch (e) {
          console.log(e);
        }
      });
    });
  };
  useEffect(() => {
    //function that renders when component loads
    fireinitial();
  }, [username]);

  //toggler for a popup
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const { navigation } = props; //prop is an arguement passed
  return (
    //styling and UI
    <View>
      <Appbar title="Profile" />
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity>
          <View style={styles.profilePic}>
            <Text
              style={{ color: Colors.black, fontWeight: "bold", fontSize: 28 }}
            >
              {initial}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>@{username}</Text>
        <Text style={styles.email}>{email}</Text>
        <KeyboardAvoidingView>
          <Modal
            isVisible={isModalVisible}
            animationIn="slideInLeft"
            animationOut="slideOutRight"
          >
            <EditProfile
              user={user}
              setUserName={setUserName}
              isModalVisible={toggleModal}
            />
          </Modal>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={toggleModal}
        >
          <Text style={styles.editProfileButtonText}>EDIT PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logOutbutton}
          onPress={async () => {
            //Logout of profile upon tapping logout button
            await auth.signOut();
            if (!auth.currentUser) {
              navigation.navigate("Home");
            }
          }}
        >
          <Text style={styles.logOutbuttonText}>LOG OUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 30,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
  
    paddingBottom: 5,
    marginTop: 30,
    marginBottom: 15,
  },
  email: {
  
    paddingBottom: 15,
    marginTop: 5,
  },
  editProfileButton: {
    marginTop: 25,
    marginBottom: 140,

    alignItems: "center",
    backgroundColor: Colors.wolfGrey,
    borderColor: Colors.wolfGrey,
    borderWidth: 1,
    borderRadius: 5,
    height: 36,
    width: 208,
  },
  editProfileButtonText: {
    marginTop: 8,
    fontSize: 13,
    height: 20,
    color: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  logOutbutton: {
    marginBottom: 140,

    alignItems: "center",
    backgroundColor: Colors.logoorange,
    borderColor: Colors.logoorange,
    borderWidth: 1,
    borderRadius: 5,
    height: 52,
    width: 300,
  },
  logOutbuttonText: {
    marginTop: 12,
    fontSize: 20,
    height: 22,
    color: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Profile;
