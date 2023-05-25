/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert, TouchableOpacity, ImageBackground, Image, Text, View, SafeAreaView} from 'react-native';
import { Button } from 'react-native-paper';

// Firebase
import firebase from 'react-native-firebase';

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg3.gif';
import globalStyles from "../../Styles/main.scss";
import styles from "./splash.scss";
import apicalls from '../../utilities/apiCalls';

class LoginSplash extends Component {
  state = {
    loading: true,
    error: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    firebase.messaging().hasPermission().then((enabled) => {
      if (enabled) {
        // user has permissions
        this.getTokens();
      } else {
        try {
          firebase.messaging().requestPermission().then(() => {
            this.getTokens();
          });
        } catch (error) {
          // User has rejected permissions
        }
      }
    });
    try {
      AsyncStorage.getItem('@user').then( userStr =>{
      if(userStr !== null) {
        const user = JSON.parse(userStr);
        console.log(user);
        apicalls.loginWithTOken(user.id, user.token)
          .then((userUpdated) => {
            AsyncStorage.setItem('@user', JSON.stringify(userUpdated));
            global.userId = userUpdated.id;
            global.user = userUpdated;
            global.notShowNotification = false;
            global.listener = false;
            this.setState({error: false, loading: false});
            if (userUpdated.isStylist) {
              navigation.replace('Admin');
            } else {
              navigation.replace('Dashboard');
            }
          })
          .catch((error) => {
            this.setState({loading: false});
          })
      }
      else{
        this.setState({loading: false});
      }
      })
        .catch(e => {
          this.setState({loading: false});
          console.log(e)
        });
    }
    catch(e) {
      this.setState({loading: false});
    }
  }

  async getTokens() {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      global.fcmToken = fcmToken;
    }
  }

  render() {
    const { navigation } = this.props;
    const {error, loading} = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        {
          loading && (
            <View style={globalStyles.loading}>
              <Image style={globalStyles.userlogo} source={LogoImg}/>
              <Text style={globalStyles.loaderText}>LOADING...</Text>
            </View>
          )
        }
        {
          (error || !loading) && (
            <View style={styles.container}>
              <View style={styles.imagecontainer}>
                <ImageBackground source={BackgroundImg} style={styles.imgbg} >
                  <Image style={styles.logo} source={LogoImg} />
                  <Text style={styles.subtitle} >PROFFESIONAL STYLING IN THE
                    PALM OF YOUR HAND</Text>
                </ImageBackground>
              </View>
              <View style={styles.buttoncontainer}>
                <TouchableOpacity onPress={() => navigation.navigate('AboutUs')}>
                  <View style={[globalStyles.btnBlack, { marginBottom: 16 }]} >
                    <Text style={globalStyles.txtWhite}>I'm New Here</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <View style={[globalStyles.btnWhite, { marginBottom: 16 }]} >
                    <Text style={ globalStyles.txtBlack }>Login</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressButton}>
                {/*  <Text style={styles.terms}>Terms of Service</Text>*/}
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </SafeAreaView>

    );
  }
}

export default LoginSplash;
