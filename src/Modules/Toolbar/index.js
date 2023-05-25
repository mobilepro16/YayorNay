import React from 'react';
import {  
    Alert,
    TouchableOpacity,
    Image,
    Text,
    View,
    ScrollView
} from 'react-native';
import { Button } from 'react-native-paper';
import usericon from "../../../images/Icon.png";
import logo from "../../../images/logo.png";
import styles from "./toolbar.scss";

export default class Toolbar extends React.Component {
  state = {};

  render() {
      const { navigation } = this.props;
      return (
        <View style={styles.toolbarContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
                    <Image style={styles.usericon} source={usericon}/>
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={logo}/>
                </View>
            </View>
        </View>
      );
  }
}
