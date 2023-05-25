import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { registration} from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./signup.scss";
import Arrow from "../../../images/back.png";

class SignUp extends Component {
  
  state = {
    name: "",
    email: "",
    password: "",
    error: false,
    errorMessage: '',
  }
  
  signUp = () => {
    const { name, email, password } = this.state;
    const { navigation } = this.props;
    if(name == ''){
      this.setState({ error: true, errorMessage: 'Name is required' });
    } else if(email == ''){
      this.setState({ error: true, errorMessage: 'Email is required' });
    } else if(password == ''){
      this.setState({ error: true, errorMessage: 'Password is required' });
    } else {
      this.setState({ error: false});
      registration(this.state.name, this.state.email, this.state.password)
        .then(data => {
          navigation.navigate('ConfirmEmail', {email: this.state.email});
        })
        .catch(error => {
          this.setState({ error: true, errorMessage: error.message });
        });
    }
  }
  
  render() {
    const { navigation } = this.props;
    const { name, email, password, error, errorMessage } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.imagecontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>hey there!</Text>
                <Text style={globalStyles.captionText}>Before we get you styled, we need some info from you to set up your account.</Text>
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>Name</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    value={name}
                    onChangeText={name => this.setState({ name })}
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
                  <Text style={globalStyles.textLabel}>Password</Text>
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
                </View>
              </View>
            </ScrollView>
            
            <KeyboardAvoidingView  keyboardVerticalOffset={60} style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
              <TouchableOpacity onPress={() => this.signUp()}>
                <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtWhite}>Continue</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

export default SignUp;
