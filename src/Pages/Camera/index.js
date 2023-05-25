import React, { PureComponent } from 'react';
import {TouchableOpacity, View, CameraRoll, PermissionsAndroid, Platform, Image } from 'react-native';
import {RNCamera} from 'react-native-camera';
import styles from './styles.scss';

class Camera extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
            <Image style={styles.cameraImage} source={require('../../../images/camera.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  takePicture = async() => {

    let granted = false;
      if (Platform.OS == 'android'){
        const writeAccess = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const readAccess = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Cool Photo App Camera Permission',
            message:
              'Cool Photo App needs access to your camera ' +
              'so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (this.camera && readAccess === PermissionsAndroid.RESULTS.GRANTED && writeAccess === PermissionsAndroid.RESULTS.GRANTED) {
          granted = true;
        }
      }else{
        granted = true;
      }
      if(granted){
        const {navigation} = this.props;
        const preRouteState = navigation.getParam('returnToRoute');
        const options = { quality: 0.5, base64: true };
        const data = await this.camera.takePictureAsync(options);
        CameraRoll.saveToCameraRoll(data.uri, 'photo')
          .then(url => console.log(url))
          .catch(error =>{ console.log(error)});
        navigation.navigate(preRouteState.routeName,{photoLocation: data});
        console.log(data);
      }
  };
}


export default Camera;