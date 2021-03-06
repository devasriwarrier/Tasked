import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { db, auth } from "../config/firebase";
import ActionButton from "react-native-action-button";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "../assets/color";
import Appbar from "./Appbar";
import Modal from "react-native-modal";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import OptionsMenu from "react-native-options-menu";
import FirestoreDeleteGroup from "../backend/FirestoreDeleteGroup";
import FirestoreQueryAllParticipants from "../backend/FirestoreQueryAllParticipants";

import FirestoreLeaveGroup from "../backend/FirestoreLeaveGroup";
import FirestoreQueryAllGroups from "../backend/FirestoreQueryAllGroups";
import { Context } from "../reducers/Store";
import { ColorSwatch } from "react-native-ui-lib";

const Group = (props) => {
  const { navigation } = props;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [groups, setGroups] = useState([]); // list of queried groups where user participated in
  const [selectedGroupId, setSelectedGroupId] = useState(""); //a selected group id to pass in Edit Group
  const [selectedGroupName, setSelectedGroupName] = useState(""); //a selected group name to pass in Edit Group
  const [isCreateGroupModalVisible, setCreateGroupModalVisible] = useState(
    //to check the state of the Create Group popup
    false
  );
  const [isEditGroupModalVisible, setEditGroupModalVisible] = useState(false); //to check the state of the Edit Group popup
  const [participants, setParticipants] = useState([]); //array of participants to pass in Edit Group
  const [state, dispatch] = useContext(Context);
  const [queriedParticipants, setQueriedParticipants] = useState([]);
  //individual group task page
  const groupTask = (item) => {
    dispatch({ type: "SET_SELECTED_GROUP", payload: item });
    navigation.navigate("GroupTask");
    console.log(item);
  };

  //Group Card
  const Item = ({
    item, //passing in the group object

    //pass in functions below
    toggleEditGroupModal,
    setSelectedGroupId,
    setSelectedGroupName,
    setParticipants,
  }) => (
    <TouchableOpacity
      onPress={() => {
        groupTask(item);
        console.log(item);
      }}
      style={styles.groupCard}
    >
      <View>
        <View style={styles.top_card_container}>
          <View>
            <Text style={styles.group_name}>{item.group_name}</Text>
            <Text style={styles.task_amount}>Tasks: {item.tasks.length}</Text>
          </View>

          {/* 3 dots options */}
          <OptionsMenu
            customButton={
              <View style={styles.three_dots_container}>
                <Image
                  style={styles.three_dots}
                  source={require("../assets/three_dots.png")}
                />
              </View>
            }
            buttonStyle={{
              width: 32,
              height: 8,
              margin: 7.5,
              resizeMode: "contain",
            }}
            destructiveIndex={1}
            options={["Edit", "Delete", "Leave"]}
            actions={[
              () => {
                //action for Edit Group
                setSelectedGroupId(item.group_id);
                setSelectedGroupName(item.group_name);
                setParticipants(item.participants);
                toggleEditGroupModal();
              },
              () => {
                //action for Delete Group
                FirestoreDeleteGroup(item.group_id);
              },
              () => {
                if (item.participants.length == 1) {
                  FirestoreDeleteGroup(item.group_id);
                } else {
                  FirestoreLeaveGroup(item.group_id);
                }
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  //Rerenders the component every single time when database for groups is changed
  useEffect(() => {
    setLoading(true);
    const subscriber = FirestoreQueryAllGroups(setGroups, setLoading);
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  //sets a loader while populating groups
  if (loading) {
    return <ActivityIndicator />;
  }
  const toggleCreateGroupModal = () => {
    setCreateGroupModalVisible(!isCreateGroupModalVisible);
  };
  const toggleEditGroupModal = () => {
    setEditGroupModalVisible(!isEditGroupModalVisible);
  };

  const renderGroups = ({ item }) => {
    return (
      <Item
        item={item}
        toggleEditGroupModal={toggleEditGroupModal}
        setSelectedGroupId={setSelectedGroupId}
        setSelectedGroupName={setSelectedGroupName}
        setParticipants={setParticipants}
      />
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: Colors.lightGrey }}>
      <Appbar title="Groups" />
      <ScrollView style={styles.container}>
        <FlatList
          numColumns={1}
          data={groups}
          renderItem={renderGroups}
          keyExtractor={(item, index) => String(index)}
        />
        <Modal
          isVisible={isCreateGroupModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <CreateGroup isModalVisible={toggleCreateGroupModal} />
        </Modal>
        <Modal
          isVisible={isEditGroupModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <EditGroup
            isModalVisible={toggleEditGroupModal}
            selectedGroupId={selectedGroupId}
            selectedGroupName={selectedGroupName}
            participants={participants}
          />
        </Modal>
      </ScrollView>
      <ActionButton
        buttonTextStyle={{ color: Colors.black }}
        buttonColor={Colors.logoorange}
      >
        <ActionButton.Item
          buttonColor={Colors.purple}
          title="New Group"
          onPress={toggleCreateGroupModal}
        >
          <Ionicons name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 12,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: Colors.white,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: Colors.pumpkinOrange,
    borderColor: Colors.pumpkinOrange,
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  groupCard: {
    height: 180,
    margin: 16,
    borderRadius: 5,
    color: Colors.white,
    height: 150,
    backgroundColor: Colors.white,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 10,
  },
  tinyLogo: {
    width: 26,
    height: 26,
    marginLeft: 12,
    marginTop: 12,
  },
  group_name: {
    marginLeft: 12,
    marginTop: 7.5,
    fontSize: 16,
  },
  participants: {
    marginLeft: 12,
    marginTop: 46,
  },
  task_amount: {
    marginTop: 8,
    marginLeft: 12,
    fontSize: 12,
    color: Colors.darkGrey,
  },
  top_card_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  three_dots_container: {
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 12,
  },
  three_dots: {
    height: 26,
    resizeMode: "contain",
  },
});

export default Group;
