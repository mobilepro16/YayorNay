import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {requestForgetPass} from "../../utilities/apiCalls";

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./forgotpassword.scss";
import Arrow from "../../../images/back.png";

class ForgotPassword extends Component {

  state = {
    email: "",
  }

  _onPressButton = () => {
    const { email } = this.state;
    const { navigation } = this.props;
    if(email === ''){
      this.setState({ error: true, errorMessage: 'Email is required' });
    } else {
      this.setState({ error: false, errorMessage: ''});
      requestForgetPass(email).then(data => {
        this.setState({ error: true, errorMessage: 'We sent you your new password!' });
        navigation.navigate('Login', {errorMessage: 'We sent you your new password!'});
      });
    }
  }

  render() {
    const { navigation } = this.props;
    const { email, error, errorMessage } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <ScrollView keyboardVerticalOffset={60} keyboardShouldPersistTaps="handled">
            <View style={globalStyles.imagecontainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
              </TouchableOpacity>
              <Text style={globalStyles.titleText}>Forgot Password ?</Text>
              <Text style={globalStyles.captionText}>Please type your email address below and we will send you a message with instructions on how to reset your password.</Text>
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
            <TouchableOpacity onPress={this._onPressButton}>
              <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                <Text style={globalStyles.txtWhite}>Reset Password</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>

      </View>
    </SafeAreaView>

    );
  }
}

export default ForgotPassword;
