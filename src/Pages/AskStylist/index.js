import React, {Component} from 'react';
import {
    Alert,
    TouchableOpacity,
    Image,
    Text,
    View,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';
import update from 'immutability-helper';
import {newStyle, pullStyleTags} from '../../utilities/apiCalls'
// IMAGE IMPORTS
import globalStyles from "../../Styles/main.scss";
import styles from "./askstylist.scss";
import CloseIcon from "../../../images/close.png";
import BigImage from "../../../images/Selfie.jpg";
import Camera from "../../../images/camera-take-2x-black.png";
import GradientBG from "../../../images/Gradient_BG.png";
import ImagePicker from 'react-native-image-picker';


class AskStylist extends Component {

    state = {
        style: '',
        tags: [],
        isSending: false,
        styleUserImage: BigImage
    }
  imagePicker(){
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
        this.setState({
          styleUserImage: source,
        });
      }
    });
  }
    send(image) {
      if(image.uri && image.uri.length > 1) {
        this.setState({isSending: true});
        const {navigation} = this.props;
        const tagsId = [];
        this.state.tags.map(tag => {
          if (tag.checked) {
            tagsId.push(tag.id)
          }
        });
        if (tagsId.length === 0) {
          Alert.alert('Please select a tag');
          this.setState({isSending: false});
          return
        }
        newStyle(image, tagsId, this.state.style)
            .then(data => {
              console.log(data);
              navigation.navigate('Chat', {styleId: data.id});
              this.setState({isSending: false});
            })
            .catch(error => {
              console.log(error.message);
              this.setState({isSending: false});
            })
      }
      else {
        Alert.alert('Please select an image');
        this.setState({IsSending: false})
      }
    }

    componentDidMount() {
        pullStyleTags().then(tags => {
            this.setState({tags})
        })
            .catch(error => {
                console.warn('We couldn\'t load the tags')
            })
    }

    render() {
        const {navigation} = this.props;
        const {style, tags, styleUserImage} = this.state;
        return (
            <SafeAreaView style={globalStyles.sefeareaview}>
                <View style={styles.container}>
                    <KeyboardAvoidingView keyboardVerticalOffset={60} style={{flex: 1}}
                                          behavior={Platform.OS === 'ios' && 'padding'}>
                        <ScrollView style={{marginBottom: 100}} keyboardShouldPersistTaps="handled">
                            <View style={globalStyles.imagecontainer}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image style={globalStyles.closeArrow} source={CloseIcon}/>
                                </TouchableOpacity>
                                <Text style={globalStyles.titleText}>let’s get you styled</Text>
                                <View style={globalStyles.textContainer}>
                                    <Text style={globalStyles.textLabel}>What's the occasion ?</Text>
                                    <View style={globalStyles.tagContainer}>
                                        {
                                            tags.map((item, i) =>
                                                <TouchableOpacity key={`ask-${i}`}
                                                                  onPress={() => this.setState({tags: update(tags, {[i]: {checked: {$set: !item.checked}}})})}>
                                                    <Text
                                                        style={[globalStyles.scrollTag, item.checked ? globalStyles.scrollTagActive : {}]}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                    </View>
                                </View>

                                <View style={globalStyles.textContainer}>
                                    <Text style={globalStyles.textLabel}>Show us what you have in mind ?</Text>
                                    <TouchableOpacity
                                        onPress={() => this.imagePicker()}>
                                        <View>
                                            <Image source={styleUserImage} style={styles.imagecontainer}/>
                                            <ImageBackground source={GradientBG} style={styles.cameraContainer}>
                                                <Text style={styles.cameraText}>Take Photo</Text>
                                            </ImageBackground>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                                {/* Style Selection Start */}

                                {/* Style Selection Ends */}

                                <View style={globalStyles.textContainer}>
                                    <Text style={globalStyles.textLabel}>Name this style (optional)</Text>
                                    <TextInput
                                        style={globalStyles.textInput}
                                        value={style}
                                        onChangeText={style => this.setState({style})}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                        <KeyboardAvoidingView keyboardVerticalOffset={60} style={globalStyles.buttoncontainer}
                                              behavior={Platform.OS === 'ios' && 'padding'}>
                            <TouchableOpacity onPress={() => this.send(styleUserImage)} disabled={this.state.isSending}>
                                <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                                    <Text
                                        style={globalStyles.txtWhite}>{this.state.isSending ? 'Please wait...' : 'Ask a stylist'}</Text>
                                </View>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        );
    }
}

export default AskStylist;
