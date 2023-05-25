import React from 'react';
import {
    Alert,
    TouchableOpacity,
    Image,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView
} from 'react-native';
import Moment from 'moment'
import { FlatGrid } from 'react-native-super-grid';

import apicalls from '../../utilities/apiCalls'

// Firebase
import firebase from 'react-native-firebase';

import globalStyle from "../../Styles/main.scss";
import Toolbar from "../../Modules/Toolbar";
import styles from "./styles.scss";
import globalStyles from "../../Styles/main.scss";
import {listStyles, pullClosetTags, listClosetItems} from "../../utilities/apiCalls"

import ClosetImage from "../../../images/ClosetItems.jpg";
import StyleImage from "../../../images/CreateStyles.jpg";

export default class  Dashboard extends React.Component {
  state = {
    selectedStyles: "STYLES",
    styleItems: [],
    closetItems: [],
    displayingClosetItem: [],
    tags: ['No TAG'],
    selectedTag: 'All',
  };
  hasSelectedTag(item){
    return item.tags.some( tag => {
      if (tag.name === this.state.selectedTag || this.state.selectedTag === 'All'){
        return true;
      }
    });
  }
  formatRawStyleData(data){
    const tmp = [];
    data.map(item => {
      const createdAt = Moment(item.createdAt).format('MMMM D,YYYY');
      let tags = '';
      item.tags.map(tag =>{
        if( tags.length > 1){
          tags += ', ' + tag.name
        }
        else{
          tags += tag.name
        }
      });
      tmp.push({
        id: item.id,
        tags,
        small_image: item.small_image,
        image: item.image,
        createdAt
      })
    });
    return tmp;
  }
  componentDidMount(){
    apicalls.setFCMToken(global.fcmToken);
    // Handle notification
      if(!global.listener && !this.messageListeners) {
          console.log(global.listener);
          this.messageListeners = firebase.messaging().onMessage((message) => {
              console.log(message);
              global.listener = true;
              if (!global.notShowNotification) {
                  const newNotification = new firebase.notifications.Notification()
                      .android.setChannelId('test-channel')
                      .setNotificationId(message.messageId)
                      .setTitle(message.data.title)
                      .setBody(message.data.body)
                      .setSound('default')
                      .android.setAutoCancel(true)
                      .android.setCategory(firebase.notifications.Android.Category.Alarm);
                  // Build a channel
                  const channel = new firebase.notifications.Android.Channel('test-channel', 'test', firebase.notifications.Android.Importance.Max)
                      .setDescription('Hello');

                  // Create the channel
                  firebase.notifications().android.createChannel(channel);
                  firebase.notifications().displayNotification(newNotification);
              }
          });
      }
    listStyles()
      .then( data => {
        this.setState({styleItems: this.formatRawStyleData(data)})
          console.log(this.state.styleItems);
      })
      .catch(error =>{
        console.log(error)
      });
    pullClosetTags()
      .then( data => {
        data.unshift({id: 0, name:"All"});
        this.setState({tags: data})
      })
      .catch(error =>{
        console.log(error)
      });

    listClosetItems()
      .then( data => {
        this.setState({closetItems: data, displayingClosetItem: data})
      })
      .catch(error =>{
        console.log(error)
      })
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const {navigation} = this.props;
    const newItem = navigation.getParam('newClosetItem', false);
    if(newItem && prevState.closetItems.indexOf(newItem[0]) === -1){
      const closetItems = prevState.closetItems;
      closetItems.push(newItem[0]);
      this.setState({
        closetItems,
        selectedTag: 'All'
      })
    }
    else if(prevState.selectedTag !== this.state.selectedTag){
      const displayingClosetItem = [];
      prevState.closetItems.map(item =>{
        if(this.hasSelectedTag(item)){
          displayingClosetItem.push(item);
        }
      });
      this.setState({
        displayingClosetItem
      })
    }
    if (prevState.selectedStyles !== this.state.selectedStyles){
      listStyles()
        .then( data => {
          this.setState({styleItems: this.formatRawStyleData(data)})
        })
        .catch(error =>{
          console.log(error)
        });
    }
  }

  onGoBack = () => {
    apicalls.setUserStatus(false);
    console.log('itsc all');

  }

  goToChat(styleId){
    const { navigation } = this.props;
    navigation.navigate('Chat', {styleId, onGoBack: this.onGoBack});
  }

    // {/* AskStylist */}
    render() {
        const {navigation} = this.props;
        const {selectedStyles, styleItems, displayingClosetItem, tags, selectedTag} = this.state;
        return (
            <SafeAreaView style={globalStyle.sefeareaview}>
                <View style={globalStyle.container}>
                    <Toolbar {...this.props} />
                    <ScrollView style={styles.mainScrollView}>
                        <ScrollView
                            style={styles.scrollSelection}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            <TouchableOpacity onPress={() => this.setState({selectedStyles: "STYLES"})}>
                                <Text
                                    style={[styles.scrollText, selectedStyles == 'STYLES' ? styles.scrollTextActive : {}]}>STYLES</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({selectedStyles: "CLOSET"})}>
                                <Text
                                    style={[styles.scrollText, selectedStyles == 'CLOSET' ? styles.scrollTextActive : {}]}>CLOSET</Text>
                            </TouchableOpacity>
                            {/*<TouchableOpacity onPress={() => this.setState({ selectedStyles: "OUR PICKS" })}>*/}
                            {/*  <Text style={[styles.scrollText, selectedStyles == 'OUR PICKS' ? styles.scrollTextActive: {}]}>OUR PICKS</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </ScrollView>
                        <View style={styles.contentView}>
                            {
                                selectedStyles == 'STYLES' && styleItems != '' && (
                                    <View>
                                        <FlatGrid
                                            itemDimension={130}
                                            items={styleItems}
                                            style={styles.gridView}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            spacing={0}
                                            renderItem={({item, index}) => (
                                                <TouchableOpacity onPress={() => this.goToChat(item.id)}>
                                                    {
                                                        item.label && (
                                                            <View style={styles.badge}>
                                                                <Text style={styles.badgeText}></Text>
                                                            </View>
                                                        )
                                                    }
                                                    <View style={styles.itemContainer}>
                                                        <View style={styles.imageContainer}>
                                                            <Image style={styles.productImage}
                                                                   source={{uri: item.small_image }}/>
                                                        </View>
                                                        <Text numberOfLines={1}
                                                              style={styles.itemName}>{item.tags}</Text>
                                                        <Text numberOfLines={1}
                                                              style={styles.itemDate}>{item.createdAt}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                )
                            }
                            {
                                selectedStyles == 'STYLES' && styleItems == false && (
                                    <View style={styles.missingtextcontainer}>
                                        <Image style={globalStyles.iconDashboard} source={{ StyleImage  }} />
                                    </View>
                                )
                            }

                            {
                                selectedStyles == 'CLOSET' && this.state.closetItems != '' && (

                                    <View>

                                        <ScrollView
                                            style={globalStyles.scrollSelection}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {
                                                tags.map((item, i) =>
                                                    <TouchableOpacity key={`closet-${i}`}
                                                                      onPress={() => this.setState({selectedTag: item.name})}>
                                                        <Text
                                                            style={[globalStyles.scrollTag, selectedTag === item.name ? globalStyles.scrollTagActive : {}]}>{item.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </ScrollView>


                                        <FlatGrid
                                            itemDimension={100}
                                            items={displayingClosetItem}
                                            style={styles.gridView}
                                            spacing={0}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            name={'closet'}
                                            renderItem={({item, index}) => (
                                                this.hasSelectedTag(item) && (


                                                    <TouchableOpacity
                                                        onPress={() => navigation.navigate('ClosetDetail', {closetItemId: item.id})}>
                                                        <View style={[styles.itemContainer, {padding: 6}]}>
                                                            <View style={styles.imageContainerThumbnailCloset}>



                                                                        {item.image.length > 1 && (
                                                                            <View style={styles.ClosetImgWrapper}>
                                                                                <View style={styles.imageContainerThumbnail}>
                                                                            <Image style={styles.productImageThumbnailCloset}
                                                                                   source={{uri: item.small_image }}/>
                                                                                </View>
                                                                            </View>
                                                                        )}

                                                                        {item.image.length === 0 && (
                                                                            <View style={styles.ClosetTextWrapper}>
                                                                                <View style={styles.imageContainerThumbnail}>
                                                                            <View>
                                                                                <Text
                                                                                    style={styles.ClosetText}>{item.type}</Text>
                                                                                <Text
                                                                                    style={styles.ClosetText}>{item.style}</Text>
                                                                            </View>
                                                                            </View>
                                                                            </View>
                                                                        )}

                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>

                                                ))
                                            }
                                        />


                                    </View>
                                )
                            }
                            {
                                selectedStyles == 'CLOSET' && this.state.closetItems == false && (
                                    <View style={styles.missingtextcontainer}>
                                        <Image style={globalStyles.iconDashboard} source={ClosetImage}/>
                                        {/*  <Text style={styles.missingtext}>ADD SOME CLOSET ITEMS.</Text>*/}
                                    </View>
                                )
                            }

                        </View>
                    </ScrollView>

                    {
                        selectedStyles == 'STYLES' && (
                            <KeyboardAvoidingView style={globalStyles.buttoncontainer}
                                                  behavior={Platform.OS === 'ios' && 'padding'}>
                                <TouchableOpacity onPress={() => navigation.navigate('AskStylist')}>
                                    <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                                        <Text style={globalStyles.txtWhite}>Ask a Stylist</Text>
                                    </View>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        )
                    }

                    {
                        selectedStyles == 'CLOSET' && (
                            <KeyboardAvoidingView style={globalStyles.buttoncontainer}
                                                  behavior={Platform.OS === 'ios' && 'padding'}>
                                <TouchableOpacity onPress={() => navigation.navigate('NewCloset')}>
                                    <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                                        <Text style={globalStyles.txtWhite}>ADD Item</Text>
                                    </View>
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        )
                    }
                </View>
            </SafeAreaView>
        );
    }
}
