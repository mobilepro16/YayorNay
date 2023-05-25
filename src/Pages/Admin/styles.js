import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    container: {
        paddingHorizontal: 16,
        // flex: 1,
        paddingTop: 25,
        paddingBottom: 15
    },
    container2: {
        backgroundColor: '#F4F4F4',
        // flex: 1
    },
    title: {
        fontFamily: 'Roboto Condensed',
        fontSize: 24,
        fontWeight: '300',
        letterSpacing: 0.9,
        color: '#151515'
    },
    input: {
        borderRadius: 24,
        borderColor: '#EAEAEA',
        borderWidth: 1,
        marginTop: 10,
        height: 40,
        paddingLeft: 0,
        marginLeft: 15,
        flexDirection: 'row'
    },
    search: {
        height: 14,
        width: 14,
        marginTop: 12,
        marginLeft: 15,
        marginRight: 5
    },
    inputText: {
        // flex: 1,
        position: 'relative',
        width: 275,
        paddingLeft: 10,
        marginLeft: 0
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#383C41',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rowFront: {
        backgroundColor: '#F4F4F4',
        padding: 16,
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1
        ,       flex: 1,
        flexDirection: 'row'
    },
    swipeText: {
        color: '#FFFFFF',
        fontFamily: 'Roboto Condensed',
        fontSize: 12,
        letterSpacing: 0.9,
        marginRight: 20
    },
    avatar: {
        width: 60,
        height: 60
    },
    nameview: {
        flex: 1
    },
    name: {
        marginLeft: 10,
        fontSize: 14,
        color: '#383C41',
        letterSpacing: 0.9,
        fontFamily: 'TT Commons'
    },
    date: {
        marginRight: 10,
        fontSize: 14,
        color: '#8B8B8B',
        letterSpacing: 0.9,
        fontFamily: 'TT Commons'
    },
    comment: {
        color: '#bbbbbb',
        fontFamily: 'TT Commons',
        fontSize: 15,
        marginRight: 20
    },
    icons: {
        width: 8,
        height: 16
    },
    labelview: {
        backgroundColor: '#8B8B8B',
        height: 16,
        justifyContent: 'center',
        marginRight: 10
    },
    label: {
        color: '#FFFFFF',
        fontFamily: 'Roboto Condensed',
        fontSize: 10,
        letterSpacing: 0.9,
        marginHorizontal: 3
    },
    commentBold: {
        fontWeight: 'bold',
        fontFamily: 'TT Commons',
        color: '#b90a09',
    }
});