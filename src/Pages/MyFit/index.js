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

class MyFit extends Component {

  state = {
    generalBodySize: "Plus Size",
    topBodySize: "Busty (C-Cup or Larger)",
    middleBodySize: "Hour Glass",
    bottomBodySize: "Bootilicious",
    legsBodySize: "Extra love on the thighs",
    bottomWardrobe: "Waist - 23",
    topWardrobe: "XL",
    dressSize: "0",
    shoeSize: "0",
    weightLbs: "0",
    weight: "0",
    heightFeet: "0",
    heightInch: "0",
    height: "0",
    isMale: ''
  }

  _onPressButton() {
    Alert.alert('You tapped the button!')
  }

  heightToFeetInch(height){
    const inch = height * 0.393701;
    const heightFeet = parseInt(inch / 12);
    const heightInch = Math.ceil(inch - (heightFeet * 12));
    return {heightFeet: heightFeet.toString(), heightInch: heightInch.toString()};
  }

  componentDidMount() {
    selfProfile()
        .then(data =>{
          const heightFeetInch = this.heightToFeetInch(data.height);
          const state = {
            isMale: data.isMale,
            generalBodySize: data.generalBodySize?data.generalBodySize.toString():this.state.generalBodySize,
            topBodySize: data.topBodySize?data.topBodySize.toString():this.state.topBodySize,
            middleBodySize: data.middleBodySize?data.middleBodySize.toString():this.state.middleBodySize,
            bottomBodySize: data.bottomBodySize?data.bottomBodySize.toString():this.state.bottomBodySize,
            legsBodySize: data.legsBodySize?data.legsBodySize.toString():this.state.legsBodySize,
            bottomWardrobe: data.bottomWardrobe?data.bottomWardrobe.toString():this.state.bottomWardrobe,
            topWardrobe: data.topWardrobe?data.topWardrobe.toString():this.state.topWardrobe,
            dressSize: data.dressSize?data.dressSize.toString():this.state.dressSize,
            shoeSize: data.shoeSize?data.shoeSize.toString():this.state.shoeSize,
            weight: data.weight?data.weight.toString():this.state.weight,
            weightLbs: (data.weight?data.weight * 2.205:0).toFixed(1).toString(),
            height: data.height?data.height.toString():this.state.height,
            heightFeet: heightFeetInch.heightFeet,
            heightInch: heightFeetInch.heightInch
          };
          this.setState(state);
          console.log(this.state)
        })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    updateProfile(this.state)
        .then(data => console.log(this.state))
        .catch(error => console.log(error) )
  }

  render() {
    const { navigation } = this.props;
    const { generalBodySize, isMale, topBodySize, middleBodySize, bottomBodySize, legsBodySize, bottomWardrobe, topWardrobe, dressSize, shoeSize, weightLbs, weight, heightFeet, heightInch, height } = this.state;
    return (
        <SafeAreaView style={globalStyles.sefeareaview}>
          <View style={styles.container}>
            <KeyboardAvoidingView keyboardVerticalOffset={60} style={{ flex: 1}} behavior={Platform.OS === 'ios' && 'padding'}>
              <ScrollView keyboardShouldPersistTaps="handled">

                <View style={globalStyles.imagecontainer}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={globalStyles.iconArrow} source={Arrow} />
                  </TouchableOpacity>
                  <Text style={globalStyles.titleText}>My Fit</Text>
                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>BODY TYPE</Text>



                    <Select
                        label="In General"
                        value={generalBodySize}
                        onSelect={(generalBodySize) => this.setState({ generalBodySize })}
                        options={["Athletic", "Skinny", "Petite", "Tall and Straight","Plus Size"]}
                    />
    {
                                !isMale &&  (
                    <Select
                        label="Top"
                        value={topBodySize}
                        onSelect={(topBodySize) => this.setState({ topBodySize })}
                        options={["Busty (C-Cup or Larger)", "Medium (B-cup)", "Small (A cup and smaller)",]}
                    />
                                )}

                    <Select
                        label="Middle"
                        value={middleBodySize}
                        onSelect={(middleBodySize) => this.setState({ middleBodySize })}
                        options={["Straight waist", "Hour Glass", "Extra love around the waist"]}
                    />

                    <Select
                        label="Bottom"
                        value={bottomBodySize}
                        onSelect={(bottomBodySize) => this.setState({ bottomBodySize })}
                        options={["Bootilicious", "Medium Booty", "Small Booty", "Other"]}
                    />

                    <Select
                        label="Legs"
                        value={legsBodySize}
                        onSelect={(legsBodySize) => this.setState({ legsBodySize })}
                        options={["Muscular", "Skinny boy band legs", "Extra love on the thighs", "Other"]}
                    />
                  </View>

                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Height</Text>

                    <View style={styles.flexInput}>
                      <View style={[styles.flexInput, { marginRight: 4, flex: 1 }]}>
                        <View style={[globalStyles.textContainer, styles.textContainer, { marginRight: 2 }]}>
                          <Text style={[globalStyles.textLabel, styles.textLabel]}>f</Text>
                          <TextInput
                              style={[globalStyles.textInput, styles.textInput]}
                              value={heightFeet}
                              onChangeText={heightFeet => this.setState({ heightFeet, height: parseInt((heightFeet * 30.48) + (heightInch * 2.54)).toString()})}
                              keyboardType="numeric"
                          />
                        </View>
                        <View style={[globalStyles.textContainer, styles.textContainer]}>
                          <Text style={[globalStyles.textLabel, styles.textLabel]}>in</Text>
                          <TextInput
                              style={[globalStyles.textInput, styles.textInput]}
                              value={heightInch}
                              onChangeText={heightInch => {
                                this.setState({ heightInch, height: parseInt((heightFeet * 30.48) + (heightInch * 2.54)).toString() })
                              }
                              }
                              keyboardType="numeric"
                          />
                        </View>
                      </View>
                      <View style={[globalStyles.textContainer, styles.textContainer]}>
                        <Text style={[globalStyles.textLabel, styles.textLabel]}>CM</Text>
                        <TextInput
                            style={[globalStyles.textInput, styles.textInput]}
                            value={height}
                            onChangeText={ height => {
                              const inch = height * 0.394;
                              const heightFeet = parseInt(inch / 12);
                              const heightInch = Math.ceil(inch - (heightFeet * 12));
                              this.setState({height, heightFeet: heightFeet.toString(), heightInch: heightInch.toString()});
                            }
                            }
                            keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Weight</Text>

                    <View style={styles.flexInput}>
                      <View style={[globalStyles.textContainer, styles.textContainer, { marginRight: 4 }]}>
                        <Text style={[globalStyles.textLabel, styles.textLabel]}>lbs</Text>
                        <TextInput
                            style={[globalStyles.textInput, styles.textInput]}
                            value={weightLbs}
                            onChangeText={weightLbs => this.setState({ weightLbs, weight: (weightLbs * 0.453592).toFixed(1).toString() })}
                            keyboardType="numeric"
                        />
                      </View>
                      <View style={[globalStyles.textContainer, styles.textContainer]}>
                        <Text style={[globalStyles.textLabel, styles.textLabel]}>kg</Text>
                        <TextInput
                            style={[globalStyles.textInput, styles.textInput]}
                            value={weight}
                            onChangeText={weight => this.setState({ weight, weightLbs: (weight * 2.2046).toFixed(1).toString() })}
                            keyboardType="numeric"
                        />
                      </View>
                    </View>

                  </View>

                  <View style={globalStyles.textContainer}>
                    <Text style={globalStyles.textLabel}>Wardrobe SIZES</Text>

                    <Select
                        label="Bottom"
                        value={bottomWardrobe}
                        onSelect={(bottomWardrobe) => this.setState({ bottomWardrobe })}
                        options={["Waist - 23", "Waist - 24", "Waist - 25", "Waist - 26" , "Waist - 27" , "Waist - 28" , "Waist - 29" , "Waist - 30" , "Waist - 31" , "Waist - 32", "Waist - 33" , "Waist - 34" , "Waist - 35","Waist - 36","Waist - 37",'Waist - 38','Waist - 39','Waist - 40']}
                    />

                    <Select
                        label="Top"
                        value={topWardrobe}
                        onSelect={(topWardrobe) => this.setState({ topWardrobe })}
                        options={["XXS", "XS", "S", "M",  "L" , "XL" , "XXL" , "XXL"]}
                    />
  {
                                !isMale &&  (
                    <Select
                        label="Dresses"
                        value={dressSize}
                        onSelect={(dressSize) => this.setState({ dressSize })}
                        options={["0", "2", "4", "6","8","10","12","14","16"]}
                    />

                                )}

                    <Select
                        label="Shoes"
                        value={shoeSize}
                        onSelect={(shoeSize) => this.setState({ shoeSize })}
                        options={[ "5", "5.5",  "6" , "6.5" , "7" , "7.5" , "8" , "8.5"  , "9" , "9.5" , "10" , "10.5" , "11", "11.5" , "12" , "12.5" , "13", "13.5" , "14" , "14.5" ,  "15"]}
                    />

                  </View>
                </View>
              </ScrollView>

            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>

    );
  }
}

export default MyFit;
