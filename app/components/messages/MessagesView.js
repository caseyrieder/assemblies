import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { flatten, uniq } from 'underscore'

import Conversation from './Conversation'
import Conversations from './Conversations'
import { DEV, API } from '../../config'
import { globals } from '../../styles'

class MessagesView extends Component {
  // set initial state
  constructor() {
    super();
    this.state = {
      conversations: [],
      ready: false,
      users: [],
    };
  }
  // load all conversations on initial mount
  componentDidMount() {
    this._loadConversations();
  }
  // grab 10 newest conversations involving currentUser
  _loadConversations() {
    let { currentUser } = this.props;
    let query = {
      $or: [
        { user1Id: currentUser.id },
        { user2Id: currentUser.id }
      ],
      $limit: 10, $sort: { lastMessageDate: -1 }
    };
    // this fetch will return conversations...line after response
    fetch(`${API}/conversations?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(conversations => this._loadUsers(conversations))
    .catch(err => this.ready(err))
    .done();
  }
  // grab userIds from conversations & set new state
  _loadUsers(conversations){
    let userIds = uniq(flatten(conversations.map(c => [c.user1Id, c.user2Id])));
    let query = { id: { $in: userIds }};
    // this fetch will return users...line after response
    fetch(`${API}/users?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(users => this.setState({ conversations, users, ready: true }))
    .catch(err => this.ready(err))
    .done();
  }
  // set ready error
  ready(err) {
    this.setState({ ready: true });
  }
  // becomes a navigator component toggling btwn convresations list & an individual conversation
  render() {
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Conversations' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Conversations':
              return (
                <Conversations
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
            );
            case 'Conversation':
              return (
                <Conversation
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
            );
          }
        }}
      />
    )
  }
}

export default MessagesView
