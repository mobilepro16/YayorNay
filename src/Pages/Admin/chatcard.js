import React from 'react';
import {View, Image} from 'react-native';
import { styles } from './styles';


import avatar from "../../../images/avatar.png";
import arrow from "../../../images/arrow.png";
import { Text } from 'react-native-paper';


export const Chatcard = (props) => {

    const { item } = props;
    return (
        <View key={item.name} style={styles.rowFront}>
           <Image source={item.user.avatar_image?{uri:item.user.avatar_image}: avatar} style={styles.avatar} />
           <View style={{ flex: 1}}>
                <View style={{ flexDirection: 'row'}}>
                    <View style={styles.nameview}>
                        <Text style={styles.name}>{item.user.name}</Text>
                    </View>
                    <Text style={styles.date}>{item.date}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 6 }}>
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text
                         style={[styles.comment,  item.messages[0].isSeen || item.messages[0].senderId === global.user.id  ? '' : styles.commentBold  ]}
                         numberOfLines={2}
                        >
                            {item.messages[0] && item.messages[0].isText && item.messages[0].content?item.messages[0].content:'' }
                            {item.messages[0] && item.messages[0].isImage && 'Image'}
                        </Text>
                    </View>
                    {item.isArchive && <View style={styles.labelview}><Text style={styles.label}>ARCHIVED</Text></View>}
                    <Image source={arrow} style={styles.icons} />
                </View>
           </View>
           
        </View>
    )
}
