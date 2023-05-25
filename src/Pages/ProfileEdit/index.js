import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import { TextInput } from 'react-native-paper';
import { ProgressBar, Colors } from 'react-native-paper';

// IMAGE IMPORTS
import LogoImg from '../../../images/logo-white.png';
import BackgroundImg from '../../../images/bg.png';
import globalStyles from "../../Styles/main.scss";
import styles from "./profile.scss";
import Arrow from "../../../images/back.png";
import Setting from "../../../images/setting.png";
import Camera from "../../../images/camera-take-2x-black.png";
import MoveForward from "../../../images/move_forward.png";
import {selfProfile, setUserAvatar} from  "../../utilities/apiCalls"

class ProfileEdit extends Component {

  state = {
    profilePerc: "15",
    fitPerc: "10",
    tastePerc: "0",
    closetPerc: "0",
    name: "User",
    avatarSource: Camera
  }

  _onPressButton() {
    Alert.alert('You tapped the button!')
  }
  
  size(object){
    return Object.keys(object).length
  }
  
  percentageFinder(data, array) {
    let emptyKeys = 0;
    let fullKeys = 0;
    array.map(val =>{
      if(data[val]){
        fullKeys++;
      }
      else{
        emptyKeys++;
      }
    });
    return parseInt(fullKeys/(fullKeys+emptyKeys) * 100)
  }
  
  loadData() {
    selfProfile()
      .then(data =>{
        this.setState({name: data.name, avatarSource: {uri:data.avatar_image}});
        const tastePerc = this.percentageFinder(data, ['tasteStyle', 'tasteDressType','tasteBudget','tasteBrands']);
        const profile = this.percentageFinder(data, ['age', 'isMale','isFemale','isOther', 'city']);
        this.setState({
          profilePerc: profile>= 60?100: profile + 33,
          fitPerc: this.percentageFinder(data, ["generalBodySize", "topBodySize", "middleBodySize", "bottomBodySize", "legsBodySize", "bottomWardrobe", "topWardrobe", "dressSize", "shoeSize", "weight", "height"]),
          tastePerc: tastePerc
        })
      })
      .catch(error => console.log(error.message));
  }
  
  uploadAvatar(){
    console.log('avatar');
    const options = {
      title: 'Select your profile photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        setUserAvatar(source)
          .then(()=> console.log('saved!'))
          .catch(error => console.log(error));
        this.setState({
          avatarSource: source,
        });
      }
    });
  }
  
  componentDidMount() {
    this.loadData()
  }
  
  render() {
    const { navigation } = this.props;
    const { profilePerc, fitPerc, tastePerc, closetPerc, name } = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' && 'padding'}>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.profileSec}>
              <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => navigation.replace('Dashboard')}>
                    <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.uploadAvatar()}>
                    <View style={styles.profileImageContainer}>
                      <Image source={this.state.avatarSource} style={[this.state.avatarSource === Camera? styles.profileCamera:styles.profileAvatar]}/>
                      {this.state.avatarSource === Camera &&
                      <Text style={styles.photoText} >Add photo</Text>
                      }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MyAccount')}>
                    <Image style={globalStyles.iconArrow} source={Setting} />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileTitle}>{name}</Text>
            </View>
            <View style={[globalStyles.imagecontainer, { paddingTop: 30 }]}>
              <View style={globalStyles.textContainer}>
                <Text style={globalStyles.textLabel}>Who i am</Text>

                <TouchableOpacity onPress={() => navigation.navigate('TellUsBit', {lastPage: 'ProfileEdit'})} style={styles.profileItem}>
                    <View style={styles.flex}>
                      <View style={styles.profileItemContainer}>
                        <Text style={styles.profileItemTitle}>Profile</Text>
                        <Text style={styles.profileItemContent}>Age, Gender, City</Text>
                      </View>
                      <Image source={MoveForward} style={styles.MoveForward} />
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: profilePerc.toString()+'%' }]}></View>
                      <Text style={styles.progressBarText}>{profilePerc}%</Text>
                    </View>
                </TouchableOpacity>
                

                <TouchableOpacity onPress={() => navigation.navigate('MyFit')} style={styles.profileItem}>
                    <View style={styles.flex}>
                      <View style={styles.profileItemContainer}>
                        <Text style={styles.profileItemTitle}>Fit</Text>
                        <Text style={styles.profileItemContent}>Body Type, Height, Weight, Size</Text>
                      </View>
                      <Image source={MoveForward} style={styles.MoveForward} />
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: fitPerc+'%' }]}></View>
                      <Text style={styles.progressBarText}>{fitPerc}%</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Tastes')} style={styles.profileItem}>
                    <View style={styles.flex}>
                      <View style={styles.profileItemContainer}>
                        <Text style={styles.profileItemTitle}>Tastes & Preferences</Text>
                        <Text style={styles.profileItemContent}>Style, Brands, Budget</Text>
                      </View>
                      <Image source={MoveForward} style={styles.MoveForward} />
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: tastePerc + '%' }]}></View>
                      <Text style={[styles.progressBarText]}>{tastePerc}%</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('NewCloset')} style={styles.profileItem}>
                    <View style={styles.flex}>
                      <View style={styles.profileItemContainer}>
                        <Text style={styles.profileItemTitle}>Closet</Text>
                        <Text style={styles.profileItemContent}>Bottoms, Tops, Outerwear, Dresses, Shoes...</Text>
                      </View>
                      <Image source={MoveForward} style={styles.MoveForward} />
                    </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        
          {/* <KeyboardAvoidingView style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
            <TouchableOpacity onPress={() => navigation.navigate('ConfirmEmail')}>
              <View style={[globalStyles.btnBlack, { marginBottom: 30 }]} >
                <Text style={globalStyles.txtWhite}>Continue</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView> */}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
    );
  }
}

export default ProfileEdit;
