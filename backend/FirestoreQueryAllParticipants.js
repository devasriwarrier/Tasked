import { StyleSheet, Text, View } from "react-native";
import { db } from "../config/firebase";
//query participant
const FirestoreQueryAllParticipants = (
  participantsids,
  setQueriedParticipants
) => {
  return db.collection("users").onSnapshot((querySnapshot) => {
    const users = []; //array of users
    querySnapshot.forEach((documentSnapshot) => {
      try {
        if (participantsids.includes(documentSnapshot.data().uid)) {
          users.push({ ...documentSnapshot.data(), key: documentSnapshot.id }); //push to array if matches
        }
      } catch (e) {
        console.log(e);
      }
    });
    setQueriedParticipants(users);
  });
};

export default FirestoreQueryAllParticipants;

const styles = StyleSheet.create({});
