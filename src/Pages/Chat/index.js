import React from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    View,
    TextInput,
    SafeAreaView,
    BackHandler,
    Modal
} from 'react-native';

import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { Appbar } from 'react-native-paper';
import styles from "./styles.scss";
import globalStyles from "../../Styles/main.scss";
import Arrow from "../../../images/back.png";
import Info from "../../../images/info.png";
import Avatar from "../../../images/avatar.png";
import apiCalls from '../../utilities/apiCalls';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}



export default class Chat extends React.Component {
  state = {
    messages: [],
    styleId: 0,
    lastChecked: 0,
    photo: '',
    otherUser: {},
    lastMessageId: 0,
    isVisible: false,
    image: ''
  };

  componentDidMount() {
    const { navigation } = this.props;
    const styleId = navigation.getParam('styleId');
    global.notShowNotification = true;
    this.setState({styleId});
    apiCalls.setUserStatus(true);
    apiCalls.pullStyleDetail(styleId)
      .then(style =>{
        if(global.user.isStylist){
          this.setState({otherUser: style.user})
        }
        else{
          this.setState({otherUser: style.stylist})
        }
      })
      .catch(error => {
        console.log(error)
      });
    apiCalls.pullMessages(styleId)
      .then(data=>{
        const messages = this.formatData(data).reverse();
        this.setState({messages, lastChecked: Math.floor(new Date().getTime() / 1000)})
      })
      .catch( error => {
        console.error(error)
      });
    this.setState({
      messages: [],
    });
    this.intervalID = setInterval(() => this.checkChat(), 1000);
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
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
          photo: source,
        });
          apiCalls.sendMessageImage(this.state.styleId, source)
      }
    });
  }
  formatData(data, oldMessages = []){
    const messages = [];
    data.map(singleMessage =>{
      const format = {
        _id: singleMessage.id,
        text:  singleMessage.isText?singleMessage.content: '',
        createdAt: singleMessage.createdAt,
        user: {
          _id: singleMessage.senderId
        },
        image: singleMessage.isImage?singleMessage.content: ''
      };
      const isDuplicate = oldMessages.findIndex( function (el){
        return el._id === format._id;
      });
      if (isDuplicate === -1){
        messages.push(format)
      }
    });

    return messages
  }

  submitChatMessage = () => {
    const { navigation } = this.props;
    const styleId = this.state.styleId;
    const { text } = this.state;
    const format = {
      _id: -1,
      text:  text,
      createdAt: Math.floor(new Date().getTime() / 1000),
      user: {
        _id: global.userId
      }
    };
    apiCalls.sendMessage(styleId, text)
      .then(data => {
        const message = this.formatData(data);
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
      })
      .catch(error => {});
    this.setState({ text: '' });
  };

  checkChat(){
    const styleId = this.state.styleId;
    global.notShowNotification = true;
    apiCalls.pullMessagesSinceId(styleId, this.state.lastMessageId)
      .then(data =>{
        if(data) {
          const messages = this.formatData(data, this.state.messages);
          this.setState({lastMessageId: data[data.length-1].id});
          if (messages.length) {
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, messages),
            }))
          }
        }
      })
      .catch(error =>{ console.log(error.message)})
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  goBack = async () => {
      const { navigation } = this.props;
      this.setState({ isVisible: false })
      console.log('its call');

    //const onGoBack = navigation.getParam('onGoBack');
    //onGoBack();
      if (global.user.isStylist) {
        global.notShowNotification = false;
          navigation.replace('Admin');
      }
      else {
          global.notShowNotification = false;
          navigation.replace('Dashboard');
      }
  }

  renderBubble = (props) => {
    if(props.position == 'left'){
      return (
        <View>
          {
            props.currentMessage.text != '' && (
              <View style={styles.chatItemContainer}>
                <View style={styles.leftOrder} />
                <View
                  style={{
                    backgroundColor: '#EAEAEA',
                    borderRadius: 0,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 10,
                    paddingBottom: 6,
                    marginTop: 4,
                    maxWidth: 280,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'TT Commons',
                      color: '#383C41',
                      fontSize: 17,
                      margin: 0,
                    }}
                  >{props.currentMessage.text}</Text>
                </View>
              </View>
            )
          }
          {
            (props.currentMessage.image != undefined && props.currentMessage.image != '') && (
              <TouchableOpacity
                style={[styles.imageContainer, { marginLeft: 10 }]}
                onPress={() => this.setState({ isVisible: true, image: props.currentMessage.image})}
              >
                <Image resizeMode='contain' style={styles.image} source={{ uri: props.currentMessage.image  , cache: 'force-cache'}} />
              </TouchableOpacity>
            )
          }
        </View>
      )
    }else{
        return (
          <View>
            {
              props.currentMessage.text != '' && (
                <View style={styles.chatItemContainer}>
                  <View
                    style={{
                      backgroundColor: '#383C41',
                      borderRadius: 0,
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 10,
                      paddingBottom: 6,
                      marginTop: 4,
                      maxWidth: 280,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'TT Commons',
                        color: '#ffffff',
                        fontSize: 17,
                        margin: 0,
                      }}
                    >{props.currentMessage.text}</Text>
                  </View>
                  <View style={[styles.rightOrder, { transform: [{ rotate: '90deg'}]}]} />
                </View>
              )
            }
            {
              (props.currentMessage.image != undefined && props.currentMessage.image != '') && (
                <TouchableOpacity style={[styles.imageContainer, { marginRight: 10 }]}
                onPress={() => this.setState({ isVisible: true, image: props.currentMessage.image})}>
                  <Image resizeMode='contain' style={styles.image} source={{ uri: props.currentMessage.image }} />
                </TouchableOpacity>
              )
            }
            {
              props.currentMessage.isdelivered && (
                <Text style={styles.deliveredText}>
                  Delivered
                </Text>
              )
            }
          </View>
        )
    }
  }

  renderInputToolbar = (props) => {
    const { navigation } = this.props;
    return (
      <View style={styles.flex}>
        <TouchableOpacity onPress={() => this.imagePicker()}>
          <Image style={styles.cameraImage} source={require('../../../images/camera-take-2x-black.png')} />
        </TouchableOpacity>
        <TextInput
          style={styles.containerInput}
          value={this.state.text}
          onChangeText={(text) => this.setState({ text })}
          placeholder="Message"
        />
        {
          this.state.text != '' && (
            <View>
              <Text onPress={() => this.submitChatMessage()} style={styles.sendBtn}>Send</Text>
            </View>
          )
        }
        {/* <InputToolbar containerStyle={styles.containerInput}  {...props} /> */}
      </View>
    )
}

renderLoader = () => ( <Text style={{ color: '#FFF', fontSize: 18 }}>Loading...</Text>)

  renderZoomViewer = (url) => (
    <Modal
      visible={this.state.isVisible}
      transparent={true}
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={() => this.setState({ isVisible: false })}
    >
        <ImageViewer
          imageUrls={[{ url }]}
          enableSwipeDown
          loadingRender={this.renderLoader}
          onCancel={() => this.setState({ isVisible: false })}
        />
    </Modal>
  )

  render() {
      const { navigation } = this.props;
      const { otherUser } = this.state;

      return (
        <SafeAreaView style={[globalStyles.sefeareaview, { backgroundColor: '#fff' }]}>
          <View style={{ flex: 1 }}>
              <Appbar.Header style={ styles.chatHeader }>
                  {/* <Appbar.Action icon="menu"/> */}
                  <View>
                      <TouchableOpacity style={styles.iconArrow}  onPress={this.goBack}>
                          <Image source={Arrow} />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.chatContainer} >
                      <View style={styles.textContainer}>
                          <Text style={styles.textTitle}>{otherUser.name}</Text>
                          <Text style={styles.textCaption}>{otherUser.isStylist?'Stylist':'Member'}</Text>
                      </View>
                      <Image style={styles.avatarIcon}
                             source={(otherUser && otherUser.avatar_image) ? {uri: otherUser.avatar_image} : Avatar}/>
                      <TouchableOpacity onPress={() => {
                          if (global.user.isStylist) {
                              global.notShowNotification = false;
                              navigation.navigate('AdminProfile', {clientId: otherUser.id});
                          } else {

                              global.notShowNotification = false;
                              navigation.navigate('Profile');
                          }
                      }}>
                          <Image style={styles.infoIcon} source={Info} />
                      </TouchableOpacity>
                  </View>
              </Appbar.Header>
              <View style={{ flex: 1 }}>
                  <Text style={styles.textChatMessage}>Your stylist reply time is about 1-3hrs.</Text>
                  <GiftedChat
                      renderAvatar={() => null}
                      renderBubble={this.renderBubble}
                      messages={this.state.messages}
                      showUserAvatar={false}
                      scrollToBottom={true}
                      onSend={messages => this.onSend(messages)}
                      user={{
                          _id: global.userId,
                      }}
                      renderInputToolbar={this.renderInputToolbar}
                  />
              </View>
          </View>
          {this.renderZoomViewer(this.state.image)}
        </SafeAreaView>
      );
  }
}

const stylesInline = {
    arrow: {
        height: 30,
        width: 30,
        marginTop: 30
    }
}