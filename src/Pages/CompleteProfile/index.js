import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./completeprofile.scss";
import Close from "../../../images/close.png";

class CompleteProfile extends Component {

  state = {
    email: "",
    password: "",
  }
  
  render() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.imagecontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={globalStyles.closeArrow} source={Close} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>Almost there...</Text>
                <Text style={globalStyles.captionText}>Now, our stylists would love to know more about your specific tastes, style, budget and so on.</Text>
                <Text style={globalStyles.captionText}>If you have a minute, please continue to complete your profile. Otherwise you can do it later.</Text>
              </View>
            </ScrollView>

            <KeyboardAvoidingView style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
              <TouchableOpacity onPress={() => navigation.replace('ProfileEdit')}>
                <View style={[globalStyles.btnBlack, { marginBottom: 20 }]} >
                  <Text style={globalStyles.txtWhite}>Complete profile</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.replace('Dashboard')}>
                <View style={[globalStyles.btnWhite, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtBlack}>I'll do it later</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
      </View>
     </SafeAreaView>
    );
  }
}

export default CompleteProfile;
