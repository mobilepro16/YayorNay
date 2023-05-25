import React, { Component } from 'react';
import {
  Alert,
  TouchableOpacity,
  Image,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { registration} from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/AboutUs.jpg';
import globalStyles from "../../Styles/main.scss";
import styles from "./about.scss";
import Arrow from "../../../images/back.png";

class AboutUs extends Component {
  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.sefeareaview}>
        <View style={styles.container}>
          <ImageBackground source={BackgroundImg} style={styles.imgbg} >
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.AboutUsContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>YAY OR NAY? </Text>
                <Text style={styles.secondTitle}>LET'S FIND OUT.</Text>
                <Text style={styles.captionText}>When you’re in a style dilemma, sometimes we all need friendly “yay” or “nay” advice on how to best dress for the occasion.</Text>
                <Text style={styles.captionTextSecond}>Now you can chat with a professional stylist to get quick head-to-toe feedback when you need it most.</Text>
              </View>
            </ScrollView>
            
            <KeyboardAvoidingView  keyboardVerticalOffset={60} style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtWhite}>LET'S GET STARTED</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }
}

export default AboutUs;
