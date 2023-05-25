import React, { Component } from 'react';
import { Alert , TouchableOpacity, Image , Text, View, KeyboardAvoidingView, Platform, SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import {updateProfile, selfProfile} from '../../utilities/apiCalls'

// IMAGE IMPORTS
import globalStyles from "../../Styles/main.scss";
import styles from "./myfit.scss";
import Arrow from "../../../images/back.png";
import Setting from "../../../images/setting.png";
import Camera from "../../../images/camera-take-2x-black.png";
import MoveForward from "../../../images/move_forward.png";
import Select from '../../Modules/Select';

class Tastes extends Component {

  state = {
    tasteStyle: "Casual",
    tasteBudget: "$",
    tasteBrands: "",
    tasteDressType: "Work"
  }

  _onPressButton() {
    Alert.alert('You tapped the button!')
  }


  componentDidMount() {
    selfProfile()
        .then(data => {
          const state = {
            tasteBudget: data.tasteBudget.toString(),
            tasteDressType: data.tasteDressType.toString(),
            tasteStyle: data.tasteStyle.toString(),
            tasteBrands: data.tasteBrands.toString()
          };
          this.setState(state);
        })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    updateProfile(this.state)
        .then(data => console.log(data))
        .catch(error => console.log(error))
  }
  render() {
    const { navigation } = this.props;
    const { tasteStyle, tasteDressType, tasteBudget, tasteBrands} = this.state;
    return (
      <SafeAreaView style={globalStyles.sefeareaview}>
        <View style={styles.container}>
          <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
            <ScrollView keyboardShouldPersistTaps="handled">

              <View style={globalStyles.imagecontainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Image style={globalStyles.iconArrow} source={Arrow} />
                </TouchableOpacity>
                <Text style={globalStyles.titleText}>Tastes & Preferences</Text>
                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>GENERAL</Text>
                  <Select
                    label="Style"
                    value={tasteStyle}
                    onSelect={(tasteStyle) => this.setState({ tasteStyle })}
                    options={["Casual", "Boho", "Classic/Timeless", "Trendy" , "Edgy" , "Glam" , "Preppy","Sexy","Other"]}
                  />

                  <Select
                    label="Dress Type"
                    value={tasteDressType}
                    onSelect={(tasteDressType) => this.setState({ tasteDressType })}
                    options={["Work", "Casual", "Evening","Travel"]}
                  />

                  <Select
                    label="Budget"
                    value={tasteBudget}
                    onSelect={(tasteBudget) => this.setState({ tasteBudget })}
                    options={["$", "$$", "$$$" , "$$$$","$$$$$","$$$$$$"]}
                  />


                </View>

                <View style={globalStyles.textContainer}>
                  <Text style={globalStyles.textLabel}>Brands you like:</Text>
                  <View style={styles.flexInput}>
                    <View style={[styles.flexInput, { marginRight: 4, flex: 1 }]}>
                      <View style={[globalStyles.textContainer, styles.textContainer, { marginRight: 2 }]}>
                        <TextInput
                            style={[globalStyles.textInput, styles.textInput]}
                            value={tasteBrands}
                            onChangeText={tasteBrands => this.setState({ tasteBrands })}
                        />
                      </View>
                    </View>
                  </View>
                </View>

              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }
}

export default Tastes;
