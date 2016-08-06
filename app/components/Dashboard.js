import React, { Component } from 'react'
import { TabBarIOS } from 'react-native'
import { TabBarItemIOS } from 'react-native-vector-icons/Ionicons'

import ActivityView from './activity/ActivityView'
import MessagesView from './messages/MessagesView'
import ProfileView from './profile/ProfileView'

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'Activity'
    };
  }

  render() {
    let { user } = this.props; // user data comes from logged in user
    // add cuser as currentUser prop to all 3 views
    return (
      <TabBarIOS>
        <TabBarItemIOS
          title='Activity'
          selected={this.state.selectedTab === 'Activity'}
          iconName='ios-pulse'
          onPress={() => this.setState({ selectedTab: 'Activity'})}
        >
          <ActivityView currentUser={user}/>
        </TabBarItemIOS>
        <TabBarItemIOS
          title='Messages'
          selected={this.state.selectedTab === 'Messages'}
          iconName='ios-chatboxes'
          onPress={() => this.setState({ selectedTab: 'Messages'})}
        >
          <MessagesView currentUser={user}/>
        </TabBarItemIOS>
        <TabBarItemIOS
          title='Profile'
          selected={this.state.selectedTab === 'Profile'}
          iconName='ios-person'
          onPress={() => this.setState({ selectedTab: 'Profile'})}
        >
          <ProfileView currentUser={user}/>
        </TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

export default Dashboard
