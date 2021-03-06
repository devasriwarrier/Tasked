import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Button } from "react-native-ui-lib";
import Colors from "../assets/color";
import FirestoreCreateTask from "../backend/FirestoreCreateTask.js";
import FirestoreQueryUser from "../backend/FirestoreQueryUser.js";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Context } from "../reducers/Store";

const CreateTask = (props) => {
  const [taskname, setTaskName] = useState("");
  const [queriedusers, setQueriedUsers] = useState([]);
  const [assigneduser, setAssignedUser] = useState("");
  const [state, dispatch] = useContext(Context);
  const [initials, setInitials] = useState("");
  //Time and date picker hooks
  const [date, setDate] = useState(new Date());

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  //Time and date picker functions
  const showDateTimePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDateTimePicker();
  };

  //Added participants item
  const IconItem = ({ assigneduser }) => (
    <View style={styles.participants_container}>
      <View style={styles.tinyLogo}>
        <Text style={styles.texin}>{initials}</Text>
      </View>
      <Text style={styles.username_text}>{assigneduser}</Text>
    </View>
  );
  //Queried in search item
  const ParticipantsIconItem = ({ username, onPress }) => (
    <TouchableOpacity style={styles.participants_container} onPress={onPress}>
      <View style={styles.tinyLogo}>
        <Text style={styles.texin}>{initials}</Text>
      </View>
      <Text style={styles.username_text}>{username}</Text>
    </TouchableOpacity>
  );

  const renderParticipantsItem = ({ item }) => {
    return (
      <ParticipantsIconItem
        username={item.username}
        onPress={() => {
          setAssignedUser(item.username);
        }}
      />
    );
  };
  return (
    //Set up create group screen with buttons and fields that the user can input details
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.x_btn_container}
        onPress={props.isModalVisible}
      >
        <Image style={styles.x_btn} source={require("../assets/x_btn.png")} />
      </TouchableOpacity>
      <View style={styles.title_container}>
        <Text style={styles.title_text}>CREATE TASK</Text>
      </View>
      <Text style={styles.label}>Task name</Text>
      <KeyboardAvoidingView>
        <View style={styles.taskname_input_container}>
          <TextInput
            style={styles.inputBox}
            placeholder="Type task name"
            onChangeText={(text) => {
              setTaskName(text); //updating the state of the group name every single time user types in the text
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <Text style={styles.label}>Assign to</Text>
      {assigneduser != "" && (
        <View style={styles.participants_flatlist_container}>
          <IconItem assigneduser={assigneduser} style={{ width: "45%" }} />
        </View>
      )}

      <KeyboardAvoidingView>
        <View style={styles.username_input_container}>
          <TextInput
            style={styles.inputBox}
            placeholder="Type username"
            onChangeText={(text) => {
              FirestoreQueryUser(text, setQueriedUsers, setInitials); //query user from firestore if exists
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.username_flatlist_container}>
        <FlatList
          data={queriedusers}
          renderItem={renderParticipantsItem}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </View>
      <Text style={styles.label}>Due date</Text>
      <View style={styles.due_date_container}>
        <TouchableOpacity
          onPress={showDateTimePicker}
          style={styles.pick_date_container}
        >
          <Text style={styles.pick_date_text}>Pick date and time</Text>
        </TouchableOpacity>
        <View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDateTimePicker}
          />
        </View>
      </View>
      <View style={styles.due_date_container}>
        <Text style={styles.date_text}>{date.toDateString()}</Text>
        <Text style={styles.time_text}>{date.toTimeString()}</Text>
      </View>
      <Button
        label={"Create Task"}
        color={Colors.black}
        style={styles.button}
        backgroundColor={Colors.logoorange}
        disabled={!taskname.length} //disable button if user didn't type anything in taskname
        onPress={() => {
          FirestoreCreateTask(
            taskname,
            queriedusers[0],
            date,
            state.selectedGroup
          ); //populate db onPress
          props.onRefresh();
          props.isModalVisible(); //hide the popup
        }}
        enableShadow
        center
      />
    </View>
  );
};

export default CreateTask;

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
  texin: {
    color: Colors.black,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginLeft: 20,
    marginTop: 15,
  },
  inputBox: {
    marginHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    borderColor: Colors.grey,
    borderRadius: 5,
  },
  taskname_input_container: {
    marginTop: 12,
    height: 52,
    borderRadius: 5,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
  },
  username_input_container: {
    marginTop: 12,
    height: 52,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
  },
  button: {
    alignItems: "center",
    borderColor: Colors.orange,
    borderRadius: 5,
    marginTop: 26,
    marginHorizontal: 33,
  },
  icon_flatlist_container: {
    height: 60,
  },
  icon_image: {
    paddingVertical: 15,
    height: 32,
    width: 32,
    marginLeft: 20,
  },
  username_flatlist_container: {
    // height: 0,
    maxHeight: 150,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginHorizontal: 20,
    backgroundColor: Colors.white,
  },
  username_text: {
    marginLeft: 12,
    paddingVertical: 5,
  },
  participants_container: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: 12,
  },
  x_btn_container: {
    height: 21,
    width: 21,
    alignSelf: "flex-end",
    marginTop: 21,
    marginRight: 21,
  },
  x_btn: {},
  tinyLogo: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: Colors.orange,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  participants_flatlist_container: {
    marginTop: 12,
    paddingVertical: 12,
    maxHeight: 150,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    marginHorizontal: 20,
  },
  due_date_container: {
    marginHorizontal: 33,
    marginTop: 15,
  },
  pick_date_container: {
    marginRight: 88,
  },
  pick_date_text: { color: Colors.logoorange },
  pick_time_text: { color: Colors.logoorange },
  date_text: { marginRight: 38 },
  time_text: {},
});
