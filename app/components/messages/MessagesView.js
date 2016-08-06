import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ListView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import { FakeConversations, FakeUsers, currentUser } from '../../fixtures' // to mock data
import moment from 'moment' // for date formating
import { find, isEqual } from 'underscore' // to ID users from fixtures
import { rowHasChanged } from '../../utils' // util fxn for ListView
import Colors from '../../styles/colors'
import { globals, messagesStyles } from '../../styles'
const styles = messagesStyles

class Conversations extends Component {
  constructor() {
    super()
    this._renderRow = this._renderRow.bind(this)
    this.dataSource = this.dataSource.bind(this)
  }

  _renderRow(conversation) {
    let userIDs = [conversation.user1Id, conversation.user2Id] // ID both usersin convo
    let otherUserID = find(userIDs, (id) => !isEqual(id, currentUser.id)) // distinguish currentUser from other
    let user = find(FakeUsers, ({ id }) => isEqual(id, otherUserID)) // pull other user's data
    return (
      <TouchableOpacity style={globals.flexContainer}>
        <View style={globals.flexRow}>
          {/* other user's avatar at the left (hence the flexRow) */}
          <Image
            style={globals.avatar}
            source={{uri: user.avatar}}
          />
          {/* text info regarding the convo */}
          <View style={globals.flex}>
            {/* top row */}
            <View style={globals.textContainer}>
              {/* first last */}
              <Text style={styles.h5}>
                {user.firstName} {user.lastName}
              </Text>
              {/* how long ago most recent message happened */}
              <Text style={styles.h6}>
                {moment(conversation.lastMessageDate).fromNow()}
              </Text>
            </View>
            {/* belwo the name & date, 1st 40 chars of last message */}
            <Text style={styles.h4}>
              {conversation.lastMessageText.substring(0, 40)}...
            </Text>
          </View>
          {/* at the right of the row, an arrow into the convo */}
          <View style={styles.arrowContainer}>
            <Icon
              size={30}
              name='ios-arrow-forward'
              color={Colors.bodyTextLight}
            />
          </View>
        </View>
        {/* with a separator after each row */}
        <View style={styles.divider} />
      </TouchableOpacity>
    )
  }

  // setup datasource using the rowHasChanged util fxn
  dataSource() {
    return (
      new ListView.DataSource({ rowHasChanged: rowHasChanged })
      .cloneWithRows(FakeConversations)
    )
  }

  render() {
    let titleConfig = { title: 'Messages', tintColor: 'white' }
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        <ListView
          dataSource={this.dataSource()}
          contentInset={{ bottom: 49 }}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
}

export default Conversations
