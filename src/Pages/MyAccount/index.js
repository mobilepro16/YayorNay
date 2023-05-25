import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {selfProfile, changePassword, updateProfile} from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./myaccount.scss";
import Arrow from "../../../images/back.png";

class MyAccount extends Component {

  state = {
    name: 'Becca Simmons',
    email: 'name@domain.com',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    phone: ''
  };

  logout(){
    const { navigation } = this.props;
    AsyncStorage.setItem('@user', '');
    navigation.navigate('LoginSplash');
  };

  updateProfile = () => {
    const { name, email, oldPassword, password, confirmPassword, phone } = this.state;
    if(name == ''){
      this.setState({ error: true, errorMessage: 'Name is required' });
    } else if(email == ''){
      this.setState({ error: true, errorMessage: 'Email is required' });
    } else if(phone == ''){
      this.setState({ error: true, errorMessage: 'phone is required' });
    } else if(password != confirmPassword){
      this.setState({ error: true, errorMessage: 'Password does not match with confirm password' });
    } else{
      this.setState({ error: false });
      if(password.length > 2 && password === confirmPassword && oldPassword.length > 2){
        changePassword(oldPassword, password)
            .then()
            .catch(error => this.setState({error: true,  errorMessage: error.message}));
      }
      updateProfile({
        name,
        email,
        phone
      })
          .then()
          .catch(error => this.setState({error: true, errorMessage: error.message}));
    }
  };

  componentDidMount() {
    selfProfile()
        .then(profile =>{
          this.setState({
            name: profile.name,
            email: profile.email,
            phone: profile.phone
          })
        })
        .catch(error => {console.log('amin')})

  }

  render() {
    const { navigation } = this.props;
    const { name, email, password, oldPassword, phone, confirmPassword, error, errorMessage } = this.state;
    return (
        <SafeAreaView style={globalStyles.sefeareaview}>
          <View style={styles.container}>
            <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
              <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
                <View style={globalStyles.imagecontainer}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={globalStyles.iconArrow} source={Arrow} />
                  </TouchableOpacity>
                  <Text style={globalStyles.titleText}>My Account</Text>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Name</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={name}
                        onChangeText={name => this.setState({ name })}
                    />
                  </View>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Phone</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={phone}
                        onChangeText={phone => this.setState({ phone })}
                        keyboardType="phone-pad"
                    />
                  </View>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>EMAIl</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={email}
                        onChangeText={email => this.setState({ email })}
                        keyboardType="email-address"
                    />
                  </View>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Old Password</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={oldPassword}
                        onChangeText={oldPassword => this.setState({ oldPassword })}
                        secureTextEntry
                    />
                  </View>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}> New Password</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={password}
                        onChangeText={password => this.setState({ password })}
                        secureTextEntry
                    />
                  </View>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Confirm Password</Text>
                    <TextInput
                        style={globalStyles.textInput}
                        value={confirmPassword}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
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
                  </View>
                  <TouchableOpacity onPress={() => this.logout()}>
                    <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                      <Text style={globalStyles.txtWhite}>Logout</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <KeyboardAvoidingView  keyboardVerticalOffset={60} style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
                <TouchableOpacity onPress={() => this.updateProfile()}>
                  <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                    <Text style={globalStyles.txtWhite}>Save</Text>
                  </View>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>

    );
  }
}

export default MyAccount;