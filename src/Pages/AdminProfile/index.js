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
import {FlatGrid} from 'react-native-super-grid';
import {Appbar, Button} from 'react-native-paper';

import apicalls from '../../utilities/apiCalls'

// Firebase
import {Notification, NotificationOpen, RemoteMessage} from 'react-native-firebase';
import firebase from 'react-native-firebase';


import usericon from "../../../images/Icon.png";
import logo from "../../../images/logo.png";
import globalStyle from "../../Styles/main.scss";
import styles from "./styles.scss";
import globalStyles from "../../Styles/main.scss";
import {listStyles, pullClosetTags, listClosetItems} from "../../utilities/apiCalls"
import Arrow from "../../../images/back.png";
import AsyncStorage from "@react-native-community/async-storage";

export default class AdminProfile extends React.Component {
    state = {
        selectedStyles: "STYLES",
        styleItems: [],
        closetItems: [],
        displayingClosetItem: [],
        tags: ['No TAG'],
        selectedTag: 'All',
        clientProfile: {}
    };

    logout() {
        const {navigation} = this.props;
        AsyncStorage.setItem('@user', '');
        navigation.navigate('LoginSplash');
    };

    hasSelectedTag(item) {
        console.log(item);
        return item.tags.some(tag => {
            if (tag.name === this.state.selectedTag || this.state.selectedTag === 'All') {
                return true;
            }
        });
    }

    goBack = async () => {
        const {navigation} = this.props;
        const onGoBack = navigation.getParam('onGoBack');
        onGoBack();
        /*    if (global.user.isStylist) {
              navigation.replace('Admin');
            }
            else {
              navigation.replace('Dashboard');
            }*/
    };

    formatRawStyleData(data) {
        const tmp = [];
        data.map(item => {
            const createdAt = Moment(item.createdAt).format('MMMM D,YYYY');
            let tags = '';
            item.tags.map(tag => {
                if (tags.length > 1) {
                    tags += ', ' + tag.name
                } else {
                    tags += tag.name
                }
            });
            tmp.push({
                id: item.id,
                tags,
                image: item.image,
                createdAt
            })
        });
        return tmp;
    }

    componentDidMount() {
        apicalls.setFCMToken(global.fcmToken);

        global.notShowNotification = false;
        const clientId = this.props.navigation.getParam('clientId', false);
        apicalls.getMyClientProfile(clientId)
            .then(clientProfile => {
                console.log(clientProfile);
                this.setState({
                    clientProfile,
                    closetItems: clientProfile.closets,
                    displayingClosetItem: clientProfile.closets
                })
            })
            .catch(error => console.warn(error));
        // Handle notification

        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh((fcmTokens) => {
            global.fcmToken = fcmTokens;
            apicalls.setFCMToken(fcmTokens);
        });

        listStyles()
            .then(data => {
                this.setState({styleItems: this.formatRawStyleData(data)})
            })
            .catch(error => {
                console.log(error)
            });
        pullClosetTags()
            .then(data => {
                data.unshift({id: 0, name: "All"});
                this.setState({tags: data})
            })
            .catch(error => {
                console.log(error)
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {navigation} = this.props;
        const newItem = navigation.getParam('newClosetItem', false);
        if (newItem && prevState.closetItems.indexOf(newItem[0]) === -1) {
            const closetItems = prevState.closetItems;
            closetItems.push(newItem[0]);
            this.setState({
                closetItems,
                selectedTag: 'All'
            })
        } else if (prevState.selectedTag !== this.state.selectedTag) {
            const displayingClosetItem = [];
            prevState.closetItems.map(item => {
                if (this.hasSelectedTag(item)) {
                    displayingClosetItem.push(item);
                }
            });
            this.setState({
                displayingClosetItem
            })
        }
        if (prevState.selectedStyles !== this.state.selectedStyles) {
            listStyles()
                .then(data => {
                    this.setState({styleItems: this.formatRawStyleData(data)})
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }


    // {/* AskStylist */}
    render() {
        const {navigation} = this.props;
        const {selectedStyles, styleItems, clientProfile, displayingClosetItem, tags, selectedTag} = this.state;
        return (
            <SafeAreaView style={globalStyle.sefeareaview}>
                <View style={globalStyle.container}>

                    <ScrollView style={styles.mainScrollView}>

                        <ScrollView
                            style={styles.scrollSelection}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                        </ScrollView>

                        <View style={styles.paddingArrow}>
                            <TouchableOpacity style={styles.iconArrow} onPress={() => navigation.goBack()}>
                                <Image source={Arrow}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.contentView}>
                            <View style={styles.contentSection}>
                                <Text style={styles.contentTitle}>User Information:</Text>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        General Body Type: {clientProfile.generalBodySize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Top: {clientProfile.topBodySize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Middle: {clientProfile.middleBodySize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Bottom: {clientProfile.bottomBodySize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Legs: {clientProfile.legsBodySize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Height: {clientProfile.height} cm

                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Weight: {clientProfile.weight} kg
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Age: {clientProfile.age}
                                    </Text>
                                </View>

                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Location: {clientProfile.city}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentTitle}>Wardrobe Size::</Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>

                                        Bottoms: {clientProfile.bottomWardrobe}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Top: {clientProfile.topWardrobe}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Dresses: {clientProfile.dressSize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Shoes: {clientProfile.shoeSize}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Taste Brands: {clientProfile.tasteBrands}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Taste Dress Type: {clientProfile.tasteDressType}
                                    </Text>
                                </View>
                                <View style={styles.contentSection}>
                                    <Text style={styles.contentCaption}>
                                        Taste Style: {clientProfile.tasteStyle}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <ScrollView
                            style={globalStyles.scrollSelection}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}>
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
                                                                   source={{uri: item.image}}/>
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
                                )
                            )
                            }
                        />
                        <TouchableOpacity style={styles.logoutAdmincontainer} onPress={() => this.logout()}>
                            <View style={[globalStyles.btnBlack, {marginBottom: 0}]}>
                                <Text style={globalStyles.txtWhite}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
