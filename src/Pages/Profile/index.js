import React from 'react';
import {  
    Alert,
    TouchableOpacity,
    Image,
    Text,
    View,
    ScrollView,
    SafeAreaView
} from 'react-native';

import { Appbar } from 'react-native-paper';
import styles from "./styles.scss";
import globalStyles from "../../Styles/main.scss";
import Arrow from "../../../images/back.png";
import Info from "../../../images/info.png";
import Avatar from "../../../images/big-avatar.png";

export default class Chat extends React.Component {
  state = {
      messages: []
  };

  render() {
      const { navigation } = this.props;
      return (
        <SafeAreaView style={globalStyles.sefeareaview}>
            <View style={{ flex: 1 }}>
                <Appbar.Header style={styles.chatHeader}>
                    {/* <Appbar.Action icon="menu"/> */}
                    <View style={styles.backContainer}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack();}}>
                            <Image style={styles.iconArrow} source={Arrow} />
                        </TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.textTitle}>ASHLEY</Text>
                            <Text style={styles.textCaption}>Lead Stylist</Text>
                        </View>
                    </View>
                    <View style={styles.chatContainer} >
                        <Image style={styles.avatarIcon} source={Avatar} />
                    </View>
                </Appbar.Header>
                <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
                    <ScrollView>
                        <View style={styles.contentSection}>
                            <Text style={styles.contentTitle}>About Ashley</Text>
                            <Text style={styles.contentCaption}>Ashley Pruitt served as Senior fashion editor and creative at FLATT magazine. In her history as a Senior Level Stylist, Ashley has curated personal style branding for celebrities as well as dignitaries, editorially as well as commercially.</Text>
                        </View>
                        <View style={styles.contentSection}>
                            <Text style={styles.contentTitle}>What celebs has she worked with?</Text>
                            <Text style={styles.contentCaption}>Her work has been highlighted in International magazines and as lead Stylist on features, red carpet, and advertising that include Diane Lane, Debbie Harry, Janelle Monae, Jessica Lange, Brooke Shields, Rufus Wainwright, Lenny Kravitz, Yuna, Neil Patrick Harris, Susan Sarandon, Cobie Smulders, Christie Brinkley, Paris Hilton, Pedro Pascal, among many others. </Text>
                        </View>
                        <View style={styles.contentSection}>
                            <Text style={styles.contentTitle}>What brands has she worked with?</Text>
                            <Text style={styles.contentCaption}>Ashley has also performed commercial styling for brands such as LG, Hitachi, and Cole Haan, and L'Oreal. </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
      );
  }
}
