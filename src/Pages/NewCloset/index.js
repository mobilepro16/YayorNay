import React, {Component} from 'react';
import {Alert, TouchableOpacity, Image, Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import update from 'immutability-helper';
import ImagePicker from 'react-native-image-picker';
import Select from "../../Modules/Select";
import {newClosetItem, pullClosetTags} from '../../utilities/apiCalls';
import selectDataAll from './data';
import genderTags from './tags';
// IMAGE IMPORTS
import globalStyles from "../../Styles/main.scss";
import styles from "./newcloset.scss";
import CloseIcon from "../../../images/close.png";
import Camera from "../../../images/camera-take-2x-black.png";
import BigImage from "../../../images/Selfie.jpg";


class NewCloset extends Component {

  state = {
    gender: 'women',
    style: '',
    type: '',
    color: '',
    filter: {
      tag: '',
      style: '',
      type: '',
      color: ''
    },
    tags: [
      {name: 'Top', checked: false},
      {name: 'Pants', checked: false},
      {name: 'Jeans', checked: false},
      {name: 'Shorts', checked: false},
      {name: 'Swim', checked: false},
      {name: 'Suits', checked: false},
      {name: 'Outerwear', checked: false},
      {name: 'Shoes', checked: false},
      {name: 'Dress', checked: false},
      {name: 'Shirt', checked: false},
      {name: 'Bag', checked: false},
      {name: 'Skirt', checked: false},
      {name: 'Jewelery', checked: false},
      {name: 'Accessories', checked: false},
      {name: 'Dress', checked: false},
      {name: 'Skirts', checked: false},
    ],
    baseTags: [
        {name: 'Top', checked: false},
        {name: 'Pants', checked: false},
        {name: 'Jeans', checked: false},
        {name: 'Shorts', checked: false},
        {name: 'Swim', checked: false},
        {name: 'Suits', checked: false},
        {name: 'Outerwear', checked: false},
        {name: 'Shoes', checked: false},
        {name: 'Dress', checked: false},
        {name: 'Shirt', checked: false},
        {name: 'Bag', checked: false},
        {name: 'Skirt', checked: false},
        {name: 'Jewelery', checked: false},
        {name: 'Accessories', checked: false},
        {name: 'Dress', checked: false},
        {name: 'Skirts', checked: false},
    ],
    closetUserImage: '',
    isSending: false
  };

  imagePicker() {
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
        const source = {uri: response.uri};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          closetUserImage: source,
        });
      }
    });
  }

  send(image) {
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
    console.log(tagsId);
    const data = {
      type: this.state.type,
      style: this.state.style,
      color: this.state.color,
    };
    newClosetItem(image, tagsId, data)
        .then(data => {
          navigation.navigate('Dashboard', {newClosetItem: data});
          this.setState({isSending: false});
        })
        .catch(error => {
          console.log(error.message);
          this.setState({isSending: false})
        })
  }

  componentDidMount() {
    let tmpTags;
    if(global.user.isMale){
      this.setState({gender: 'men'});
      tmpTags = genderTags.men;
    }
    else if(global.user.isFemale){
      this.setState({gender: 'women'});
      tmpTags = genderTags.women;
    }
    else{
      this.setState({gender: 'other'});
      tmpTags = genderTags.other;
    }
    pullClosetTags().then(allTags => {
      console.log(allTags);
      let tags = [];
      tmpTags.map(tag =>{
        for(let i=0; i < allTags.length; i++){
          console.log(allTags[i].name.toLowerCase());
          if(allTags[i].name.toLowerCase() === tag.toLowerCase()){
            tags.push(allTags[i]);
            break;
          }
        }
      });
      this.setState({tags: tags, baseTags: tags})
    })
        .catch(error => {
          console.warn('We couldn\'t load the tags');
          console.warn(error);
        })
  }
  componentDidUpdate(prevProps, prevState, snapshot) {

  }


  render() {
    const {navigation} = this.props;
    const {style, type, color, tags, closetUserImage, filter} = this.state;
    const selectData = selectDataAll[this.state.gender];
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
                  <Text style={globalStyles.titleText}>what’s in your closet?</Text>

                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Snap a photo of an item </Text>
                     <Text style={globalStyles.textLabel}>Or manually select your item below. </Text>
                    <TouchableOpacity onPress={() => this.imagePicker()}>
                      <View style={styles.imagecontainer}>
                        {
                          closetUserImage !== '' && (<Image style={styles.takenPhoto} source={closetUserImage}/>)
                        }
                        {
                          closetUserImage === '' && (<Image style={styles.cameraImage} source={Camera}/>)
                        }
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>What kind of item is this ?</Text>
                    <View style={globalStyles.tagContainer}>
                      {
                        tags.map((item, i) =>
                            <TouchableOpacity key={`ask-${i}`}
                                              onPress={() => {
                                                this.setState({
                                                      tags: update(this.state.baseTags, {[i]: {checked: {$set: !item.checked}}})
                                                    }
                                                );
                                                this.setState({filter: {type: '', style: '', tag: tags[i].name.toLowerCase()}});
                                              }
                                              }>
                              <Text
                                  style={[globalStyles.scrollTag, item.checked ? globalStyles.scrollTagActive : {}]}>{item.name}</Text>
                            </TouchableOpacity>
                        )
                      }
                    </View>

                    <View style={globalStyles.textContainer}>
                      <Text style={globalStyles.textLabel}>ITEM DETAILS</Text>
                      <Select
                          label="Type"
                          value={type}
                          onSelect={(type) => {
                            if(type !== 'Select A Tag First') {
                              this.setState({filter: {type, tag: filter.tag}, type});
                              filter.type = type;
                            }
                          }
                          }
                          options={selectData[filter.tag]?selectData[filter.tag].options:['Select A Tag First']}
                      />

                      <Select
                          label="Style"
                          value={style}
                          onSelect={(style) => {
                            if (filter.type.length > 1) {
                              filter.style = style.toLowerCase();
                              this.setState({filter, style})
                            }
                          }
                          }
                          options={(filter.type && selectData[filter.tag].type[filter.type])?selectData[filter.tag].type[filter.type].style:['Select A Type First']}
                      />

                      <Select
                          label="Color"
                          value={color}
                          onSelect={(color) => {
                            if (filter.type.length > 1) {
                              filter.color = color.toLowerCase();
                              this.setState({filter, color})
                            }
                          }}
                          options={(filter.type && selectData[filter.tag].type[filter.type])?selectData[filter.tag].type[filter.type].colors:['Select A Type First']}
                      />

                    </View>

                  </View>

                </View>
              </ScrollView>
              <KeyboardAvoidingView keyboardVerticalOffset={60} style={globalStyles.buttoncontainer}
                                    behavior={Platform.OS === 'ios' && 'padding'}>
                <TouchableOpacity onPress={() => this.send(closetUserImage)} disabled={this.state.isSending}>
                  <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                    <Text style={globalStyles.txtWhite}>{this.state.isSending ? 'Please wait...' : 'Add to Closet'}</Text>
                  </View>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>

    );
  }
}

export default NewCloset;
