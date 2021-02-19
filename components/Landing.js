import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Paper, Tabs, Tab } from "@material-ui/core";
import styled from "styled-components";
import "@fontsource/roboto/400.css";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { updateEmail, updatePassword, login, getUser } from "../actions/User";
import Firebase from "../config/firebase";
import colors from "../assets/color";
import SignUp from "./SignUp";
import Login from "./Login";

const StyledTabs = styled((props) => {
  return <Tabs {...props} classes={{ indicator: "indicator" }}></Tabs>;
})`
  && {
    border-bottom: 1px solid white;
  }
  && .indicator {
    background-color: #fccf3e;
  }
`;

const StyledTab = styled(Tab)`
  && {
    color: black;
    text-transform: none;
  }
`;
class Landing extends React.Component {
  state = { tab: 0 };
  handleChangeTab = (e, tab) => {
    this.setState({ tab });
  };

  render() {
    const { tab } = this.state;
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/img/android/logo-black-text.png")}
        />
        <Text style={styles.welcomeText}>WELCOME</Text>

        <Paper elevation={0}>
          <StyledTabs centered value={tab} onChange={this.handleChangeTab}>
            <StyledTab label="Login"></StyledTab>
            <StyledTab label="Sign Up"></StyledTab>
          </StyledTabs>
          {this.state.tab === 0 ? (
            <Login navigation={this.props.navigation} />
          ) : (
            <SignUp navigation={this.props.navigation} />
          )}
        </Paper>
      </View>
    );
  }
}

// const Tabs = AnimatedTabBarNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: "center",
    backgroundColor: "#F6820D",
    borderColor: "#F6820D",
    borderWidth: 1,
    borderRadius: 5,
    width: 200,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonSignup: {
    fontSize: 12,
  },
  logo: {
    width: 150,
    height: 150,
  },
  welcomeText: {
    fontWeight: 100,
    fontSize: 38,
    paddingBottom: 15,
  },
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { updateEmail, updatePassword, login, getUser },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
