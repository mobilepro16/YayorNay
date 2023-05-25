import React, {Component} from 'react';
import {SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, BackHandler} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import apiCalls from "../../utilities/apiCalls";
import firebase from "react-native-firebase";

import {Chatcard} from './chatcard';
import {chatdata} from './data';
import {styles} from './styles';


// Images
import search from "../../../images/Search.png";


class Admin extends Component {
  
  state = {
    clientList: [],
    displayingClientList: []
  }
  
  goToAdminChat(styleId) {
    const {navigation} = this.props;
    navigation.replace('Chat', {styleId, onGoBack: this.onGoBack});
  }

  filterClients(searchTerm){
    const {clientList} = this.state;
    if(searchTerm.length > 1) {
      let displayingClientList = [];
      clientList.map(client => {
        if (client.user.name.toLowerCase().search(searchTerm.toLowerCase()) > -1) {
          displayingClientList.push(client);
        }
      });
      this.setState({displayingClientList});
    }
    else{
      this.setState({displayingClientList: clientList});
    }
  }

  componentDidMount() {
    apiCalls.setFCMToken(global.fcmToken);
    // Handle notification
      if(!global.listener) {
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


  
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmTokens) => {
      global.fcmToken = fcmTokens;
      apiCalls.setFCMToken(fcmTokens);
    });
    apiCalls.getMyClientsChat()
      .then(clientList => {
        this.setState({clientList, displayingClientList: clientList});
        console.log(clientList);
      })
      .catch(error => {
        console.error(error)
      });


       this.intervalID = setInterval(() => {
         apiCalls.getMyClientsChat()
      .then(clientList => {
        this.setState({clientList});
        console.log(clientList);
      })
      .catch(error => {
        console.error(error)
      });
       }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
    console.log("unmount")
  }
  
  renderItems = (data) => {
    const {item} = data;
    return (
      
      <TouchableOpacity onPress={() => this.goToAdminChat(item.id)}>
        <Chatcard item={item}/>
      </TouchableOpacity>
    )
  };
  
  render() {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.container}>
          <View style={styles.input}>
            <Image source={search} style={styles.search}/>
            <TextInput
              style={styles.inputText}
              placeholder='Search'
              underlineColorAndroid='transparent'
              onChangeText={(searchTerm) => this.filterClients(searchTerm)}
            />
          </View>
        
        </View>
        <View style={styles.container2}>

          <SwipeListView
            data={this.state.displayingClientList}
            renderItem={this.renderItems}
            keyExtractor={(item, index) => `hello-${index}`}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <Text></Text>
                <TouchableOpacity>
                  <Text style={styles.swipeText}>ARCHIVE</Text>
                </TouchableOpacity>
              </View>
            )}
            rightOpenValue={-100}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
          />
        
        
        </View>

      </SafeAreaView>
    )
  }
}

export default Admin;