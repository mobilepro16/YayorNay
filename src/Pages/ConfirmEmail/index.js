import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import apicalls from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./confirmemail.scss";
import Arrow from "../../../images/back.png";
import {activation} from '../../utilities/apiCalls'

class ConfirmEmail extends Component {
  
  state = {
    code: "",
    email: ""
  }
  
  setConfirmEmail = () => {
    const {code} = this.state;
    const {navigation} = this.props;
    if (code == '') {
      this.setState({error: true, errorMessage: 'Code is required'});
    } else {
      this.setState({error: false});
      activation(this.state.email, this.state.code)
        .then(() => {
          navigation.navigate('TellUsBit');
        })
        .catch(error => {
          console.log(error);
          this.setState({error: true, errorMessage: error.message});
        })
    }
  }
  componentDidMount() {
    const { navigation } = this.props;
    this.setState({email: navigation.getParam('email')})
  }
  
  render() {
    const { navigation } = this.props;
    const { code, error, errorMessage, email } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1 }} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.imagecontainer}>
                <Text style={globalStyles.titleText}>confirm your email</Text>
                <Text style={globalStyles.captionText}>We just sent a confirmation code to {this.state.email}</Text>
                <Text style={globalStyles.captionText}>You can click on the activation link or enter the code below:</Text>
                <View style={globalStyles.textContainer}>
                  <View style={globalStyles.labelWrapper}>
                    <Text style={globalStyles.textLabel}>Activation Code</Text>
                    <TouchableOpacity onPress={() => {
                      apicalls.resendActivationCode(email)
                        .then(data => console.log(data))
                        .catch(error => console.log(error))
                    }}>
                      <Text style={globalStyles.textRight}>Re-Send Code?</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={globalStyles.textInput}
                    value={code}
                    onChangeText={code => this.setState({ code })}
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
              <TouchableOpacity onPress={() => this.setConfirmEmail()}>
                <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtWhite}>Confirm & Continue</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

export default ConfirmEmail;
