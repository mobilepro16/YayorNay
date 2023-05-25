import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import update from 'immutability-helper';

import {newClosetItem,  deleteClosetItem , pullSingleClosetItem} from '../../utilities/apiCalls';
// IMAGE IMPORTS
import globalStyles from "../../Styles/main.scss";
import styles from "./newcloset.scss";
import CloseIcon from "../../../images/close.png";
import Camera from "../../../images/camera-take-2x-black.png";
import Select from "../../Modules/Select";
import avatar from "../../../images/avatar.png";
import Arrow from "../../../images/back.png";
import {Appbar} from "react-native-paper";


export default class ClosetDetail extends Component {

  state = {
    style: '',
    itemtype: '',
    color: '',
    tags: [
      { name : 'Top', checked: false },
      { name : 'Bottom', checked: false },
      { name : 'Shoes', checked: false },
      { name : 'Dress', checked: false },
      { name : 'Shirt', checked: false },
      { name : 'Bag', checked: false },
      { name : 'Skirt', checked: false },
      { name : 'Jewelery', checked: false },
      { name : 'Dress', checked: false },
      { name : 'Bag', checked: false },
      { name : 'Skirt', checked: false },
    ],
    photoLocation: null,
    isSending: false,
    item: ''
  };

  delete() {
    console.log(this.state.item);
    const {navigation} = this.props;
    const itemId =  navigation.getParam('closetItemId', false);
    deleteClosetItem(itemId);
    navigation.replace('Dashboard')
  }


  componentDidMount() {
    const {navigation} = this.props;
    const itemId = navigation.getParam('closetItemId', false);
    if(itemId){
      pullSingleClosetItem(itemId)
        .then(item => {
          console.log("pull closet" + item);

          if(item){
            this.setState({item: item, tags: item.tags});
            console.log(item);
          }
          else{
            console.warn('Bad Item')
          }
        })
        .catch(error => console.warn(error))
    }
    else{
      console.error('No Id has been passed!')
    }
  }


  render() {
    const { navigation } = this.props;
    const { style, tags, item ,itemtype,color} = this.state;
    const photoLocation = navigation.getParam('photoLocation', '');



    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
          <ScrollView style={{ marginBottom: 100 }} keyboardShouldPersistTaps="handled">
            <View style={globalStyles.imagecontainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image style={globalStyles.closeArrow} source={CloseIcon} />
              </TouchableOpacity>
              <Text style={globalStyles.titleText}>Closet Detail</Text>

              <View style={globalStyles.textContainer}>

                {this.state.item !== ''  && this.state.item.image.length > 1 &&  (
                          <Image style={styles.fullsizeImage} source={{uri:this.state.item.image , cache: 'force-cache'}} />
                )}




              </View>
        
              <View style={globalStyles.textContainer}>
                <Text style={globalStyles.textLabel}>Item Information:</Text>
                <View style={globalStyles.tagContainer}>
                {
                    this.state.tags.map((item, i) =>
                      <TouchableOpacity key={`ask-${i}`} onPress={() => this.setState({ tags: update(tags, { [i] : { checked: { $set: !item.checked } } }) })} >
                        <Text style={[globalStyles.scrollTag, item.checked ? globalStyles.scrollTagActive: {}]}>{item.name}</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
        
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>ITEM DETAILS</Text>

                  <Text  style={styles.detailstext}>
                    Type: {item.type}
                  </Text>

                  <Text  style={styles.detailstext}>
                    Style: {item.style}
                  </Text>
        
                  <Text  style={styles.detailstext}>
                    Color: {item.color}
                  </Text>
        
                </View>
        
        
              </View>
        
            </View>
          </ScrollView>

          </KeyboardAvoidingView>

          <KeyboardAvoidingView style={globalStyles.buttoncontainer} behavior={Platform.OS === 'ios' && 'padding'}>
            <TouchableOpacity onPress={() => this.delete()}>
              <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                <Text style={globalStyles.txtWhite}>Delete Item</Text>
              </View>
            </TouchableOpacity>
          </KeyboardAvoidingView>

      </View>
    </SafeAreaView>

    );
  }
}
