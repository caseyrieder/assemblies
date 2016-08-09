import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ListView } from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import Loading from '../shared/Loading' // add loading activityindicator
import { rowHasChanged } from '../../utils'
import { find, isEqual } from 'underscore'
import Colors from '../../styles/colors'
import { globals, messagesStyles } from '../../styles'
const styles = messagesStyles

class Conversations extends Component {
  // method bindings
  constructor(){
    super();
    this.visitConversation = this.visitConversation.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this.dataSource = this.dataSource.bind(this);
  }
  // navigate to full conversation thread with this user
  visitConversation(user){
    this.props.navigator.push({
      name: 'Conversation',
      user
    })
  }
  // renderRow based on convo Ids, with 'user' as OtherUser
  _renderRow(conversation){
    let { currentUser } = this.props;
    let userIDs = [ conversation.user1Id, conversation.user2Id ];
    let otherUserID = find(userIDs, (id) => !isEqual(id, currentUser.id));
    let user = find(this.props.users, ({ id }) => isEqual(id, otherUserID));
    // display as earlier (otherAvatar, otherName, time since last message, first 40 chars of message), with navigating to full convo thread via visitConversation method
    return (
      <TouchableOpacity
        style={globals.flexContainer}
        onPress={() => this.visitConversation(user)}
      >
        <View style={globals.flexRow}>
          <Image
            style={globals.avatar}
            source={{uri: user.avatar}}
          />
          <View style={globals.flex}>
            <View style={globals.textContainer}>
              <Text style={styles.h5}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.h6}>
                {moment(conversation.lastMessageDate).fromNow()}
              </Text>
            </View>
            <Text style={[styles.h4, globals.mh1]}>
              {conversation.lastMessageText.substring(0, 40)}...
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              size={30}
              name='ios-arrow-forward'
              color={Colors.bodyTextLight}
            />
          </View>
        </View>
        <View style={styles.divider}/>
      </TouchableOpacity>
    )
  }
  // revise listview dataSource
  dataSource(){
    return (
      new ListView.DataSource({ rowHasChanged: rowHasChanged })
      .cloneWithRows(this.props.conversations)
    );
  }
  // render conversations list
  render(){
    // handle unready with activity indicato
    if (!this.props.ready) { return <Loading/> }
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Messages', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
        />
        <ListView
          enableEmptySections={true}
          dataSource={this.dataSource()}
          contentInset={{ bottom: 49 }}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
};

export default Conversations;
