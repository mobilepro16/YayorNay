import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import apicalls from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./login.scss";
import Arrow from "../../../images/back.png";
import logo from "../../../images/logo-white.png";

class Login extends Component {
  
  state = {
    email: "",
    password: "",
    error: false,
    errorMessage: '',
    otherPagesError: ''
  };
  
  _onPressButton = () => {
    const { navigation } = this.props;
    const otherPagesError = navigation.getParam('errorMessage', '');
    this.setState({otherPagesError});
    const { email, password } = this.state;
    if(email == ''){
      this.setState({ error: true, errorMessage: 'Email is required' });
    } else if(password == ''){
      this.setState({ error: true, errorMessage: 'Password is required' });
    } else {
      
      apicalls.login(email, password)
        .then((user)=>{
          global.userId = user.id;
          global.user = user;
          AsyncStorage.setItem('@user', JSON.stringify(user));
          this.setState({ error: false, loading: false });
          if (user.isStylist) {
            navigation.replace('Admin');
          }
          else {
            navigation.replace('Dashboard');
          }
        })
        .catch((error) => {
        this.setState({ error: true, errorMessage: error.message, loading: false });
      })
    }
  };
  
  render() {
    const { navigation } = this.props;
    const { email, password, error, errorMessage } = this.state;
    const otherPagesError = navigation.getParam('errorMessage', '');
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.imagecontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>Login</Text>
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>EMAIl *</Text>
                  <TextInput
                    autoCapitalize="none"
                    style={globalStyles.textInput}
                    value={email}
                    onChangeText={email => this.setState({ email })}
                    keyboardType="email-address"
                  />
                </View>
                <View style={globalStyles.textContainer}>
                  <View style={globalStyles.labelWrapper}>
                    <Text style={globalStyles.textLabel}>Password *</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={globalStyles.textRight}>Forgot Password ?</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={globalStyles.textInput}
                    value={password}
                    onChangeText={password => this.setState({ password })}
                    secureTextEntry
                  />
                </View>
                <View style={globalStyles.textContainer}>
                  <View style={globalStyles.labelWrapper}>
                    {
                      error && (
                        <Text style={globalStyles.errorMessage}>{errorMessage}</Text>
                      )
                    }
                  </View>
                  <View style={globalStyles.labelWrapper}>
                    {
                      otherPagesError !== this.state.otherPagesError && (
                        <Text style={globalStyles.errorMessage}>{otherPagesError}</Text>
                      )
                    }
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <KeyboardAvoidingView keyboardVerticalOffset={60}  style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
              <TouchableOpacity onPress={this._onPressButton}>
                <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtWhite}>Let me In</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Login;
