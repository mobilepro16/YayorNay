import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {updateProfile, selfProfile} from '../../utilities/apiCalls'

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./tellusbit.scss";
import Arrow from "../../../images/back.png";

import FemaleBlack from "../../../images/female-black.png";
import MaleBlack from "../../../images/male-black.png";
import OtherBlack from "../../../images/other-black.png";

import FemaleWhite from "../../../images/female-white.png";
import MaleWhite from "../../../images/male-white.png";
import OtherWhite from "../../../images/other-white.png";

class TellUsBit extends Component {
  
  state = {
    isMale: false,
    isFemale: false,
    isOther: false,
    age: "",
    city: "",
    error: false,
    errorMessage: '',
  }
  
  tellUsBit = () => {
    const { isFemale, isMale, isOther, age, city } = this.state;
    const { navigation } = this.props;
    if(!isFemale && !isMale && !isOther){
      this.setState({ error: true, errorMessage: 'Gender is required' });
    } else if(!age.length){
      this.setState({ error: true, errorMessage: 'Age is required' });
    } else if(!city.length){
      this.setState({ error: true, errorMessage: 'city is required' });
    } else {
      this.setState({ error: false});
      const profile = {isFemale, isMale, isOther, age, city};
      updateProfile(profile).then((data) =>{
        console.log(data);
        navigation.navigate(navigation.getParam('lastPage', 'CompleteProfile'));
      })
        .catch(error =>{
          this.setState({ error: true, errorMessage: error.message });
        })
    }
  }
  
  componentDidMount() {
    selfProfile()
      .then(data =>{
        console.log(data);
        this.setState({
          isFemale: data.isFemale,
          isMale: data.isMale,
          isOther: data.isOther,
          age: data.age.toString(),
          city: data.city
        });
      })
      .catch(error => this.setState({error: error.message}))
  }
  
  render() {
    const { navigation } = this.props;
    const { age, city, isFemale, isMale, isOther, error, errorMessage } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
              <View style={globalStyles.imagecontainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>TELL US A BIT MORE ABOUT YOURSELF</Text>
                {/* Gender Selection Start */}
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>Who are you?</Text>
                  
                  <View style={styles.genderContainer}>
                    
                    <TouchableOpacity onPress={ () => this.setState({ isMale: false, isFemale:true, isOther:false })}>
                      <View style={[styles.genderItem, isFemale ? styles.genderItemActive: {}]}>
                        <Image source={isFemale ? FemaleWhite: FemaleBlack} style={styles.imageGender} />
                        <Text style={[styles.genderText, isFemale ? styles.genderTextActive: {}]}>Female</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={ () => this.setState({ isMale: true, isFemale:false, isOther:false })}>
                      <View style={[styles.genderItem, isMale ? styles.genderItemActive: {}]}>
                        <Image source={isMale ? MaleWhite: MaleBlack} style={styles.imageGender} />
                        <Text style={[styles.genderText, isMale ? styles.genderTextActive: {}]}>Male</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={ () => this.setState({ isMale: false, isFemale:false, isOther:true })}>
                      <View style={[styles.genderItem, isOther ? styles.genderItemActive: {}]}>
                        <Image source={isOther? OtherWhite: OtherBlack} style={styles.imageGender} />
                        <Text style={[styles.genderText, isOther ? styles.genderTextActive: {}]}>Non-Binary</Text>
                      </View>
                    </TouchableOpacity>
                  
                  </View>
                
                </View>
                {/* Gender Selection Ends */}
                
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>How old are you ?</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    value={age}
                    onChangeText={age => this.setState({ age })}
                  />
                </View>
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>Which city do you live in ?</Text>
                  <TextInput
                    style={globalStyles.textInput}
                    value={city}
                    onChangeText={city => this.setState({ city })}
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
              <TouchableOpacity onPress={() => this.tellUsBit()}>
                <View style={[globalStyles.btnBlack, { marginBottom: 0 }]} >
                  <Text style={globalStyles.txtWhite}> Done </Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

export default TellUsBit;
