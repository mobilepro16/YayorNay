import React from 'react';
import {  
    TouchableOpacity,
    Image,
    Text,
    View,
  ScrollView
  
} from 'react-native';
import { Portal, Dialog } from 'react-native-paper';
import bottomMove from "../../../images/move_forward.png";
import logo from "../../../images/logo.png";
import styles from "./select.scss";

export default class Select extends React.Component {
    state = {
        visible: false,
    };

    _showDialog = () => this.setState({ visible: true });
    _hideDialog = () => this.setState({ visible: false });

    selectValue = (item) => {
        const { onSelect } = this.props;
        this._hideDialog();
        onSelect(item);
    }
    
    render() {
      const { navigation, label, value, options } = this.props;
      const { visible } = this.state;
      return (
        <View style={styles.selectContainer}>

            <Portal>
                <Dialog visible={visible} onDismiss={this._hideDialog}>
                    <Dialog.Content style={styles.dialogSelectContent}>
                          <ScrollView>
                            {
                              options.map((item, i) =>
                                <TouchableOpacity key={`item-${i}`} onPress={() => this.selectValue(item)}>
                                  <View style={styles.selectItem}>
                                    <Text numberOfLines={1} style={styles.valueText}>{item}</Text>
                                  </View>
                                </TouchableOpacity>
                              )
                            }
                          </ScrollView>
                    </Dialog.Content>
                </Dialog>
            </Portal>

            <TouchableOpacity onPress={() => this._showDialog()}>
                <View style={styles.selectItem}>
                    <View style={styles.flex}>
                        <Text numberOfLines={1} style={styles.label}>{label}</Text>
                        <Text numberOfLines={1} style={styles.valueText}>{value}</Text>
                    </View>
                    <Image style={[styles.selectIcon, {transform: [{ rotate: '90deg'}]}]} source={bottomMove} />
                </View>
            </TouchableOpacity>
        </View>
      );
  }
}
