import AppbarWBackButton from "./AppBarWBackButton";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ActionButton from "react-native-action-button";
import Colors from "../assets/color";
import Ionicons from "react-native-vector-icons/Ionicons";
import Task_list from "./Task_list";
import CreateTask from "./CreateTask";
import Modal from "react-native-modal";
import { Context } from "../reducers/Store";
import FirestoreQueryAllTasks from "../backend/FirestoreQueryAllTasks";
import { ColorSwatch } from "react-native-ui-lib";

export default function GroupTask(props) {
  const [isCreateTaskModalVisible, setCreateTaskModalVisible] = useState(
    //to check the state of the Create Group popup
    false
  );
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [state, dispatch] = useContext(Context);
  const [tasks, setTasks] = useState([]);
  const { navigation } = props;
  const toggleCreateTaskModal = () => {
    setCreateTaskModalVisible(!isCreateTaskModalVisible);
  };
  //Rerenders the component every single time when database for groups is changed
  useEffect(() => {
    setLoading(true);
    const subscriber = FirestoreQueryAllTasks(
      setTasks,
      state.selectedGroup.group_id,
      setLoading
    );
    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  //sets a loader while populating groups
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppbarWBackButton
        title={state.selectedGroup.group_name}
        nav={navigation}
      />

      <ScrollView style={styles.container}>
        <Task_list Data={tasks} />
        <Modal
          isVisible={isCreateTaskModalVisible}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
        >
          <CreateTask isModalVisible={toggleCreateTaskModal} />
        </Modal>
      </ScrollView>
      <ActionButton
        buttonTextStyle={{ color: Colors.black }}
        buttonColor={Colors.logoorange}
      >
        <ActionButton.Item
          buttonColor={Colors.purple}
          title="New Task"
          onPress={toggleCreateTaskModal}
        >
          <Ionicons name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
}

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
});
