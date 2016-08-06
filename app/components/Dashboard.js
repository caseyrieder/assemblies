// redesign the Dashboard to act as a Dashboard
import React, { Component } from 'react'
// import { View, Text, TouchableOpacity } from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'
// import NavigationBar from 'react-native-navbar'
// import Colors from '../styles/colors'
// import { globals } from '../styles'

// import tab bar component & related icon
import { TabBarIOS } from 'react-native'
import { TabBarItemIOS } from 'react-native-vector-icons/Ionicons'
// import 3 views to link wihtin tabbar
import ActivityView from './activity/ActivityView'
import MessagesView from './messages/MessagesView'
import ProfileView from './profile/ProfileView'

class Dashboard extends Component {
  constructor() {
    super();
    // this.goBack = this.goBack.bind(this);
    // this.visitLanding = this.visitLanding.bind(this);
    this.state = {
      selectedTab: 'Activity'
    }
  }
  //
  // visitLanding() {
  //   this.props.navigator.push({
  //     name: 'Landing'
  //   });
  // }
  //
  // goBack() {
  //   this.props.navigator.pop();
  // }

  render() {
    // let titleConfig = {title: 'Dashboard', tintColor: 'white'};
    return (
      // <View style={globals.flexContainer}>
      //   <NavigationBar
      //     title={titleConfig}
      //     tintColor={Colors.brandPrimary}
      //     leftButton={<BackButton handlePress={this.goBack} />}
      //   />
      //   <View style={globals.flexCenter}>
      //     <Text style={globals.h2}>
      //       This is the Dashboard
      //     </Text>
      //     <TouchableOpacity onPress={this.visitLanding}>
      //       <Text>
      //         Go to the Landing Page
      //       </Text>
      //     </TouchableOpacity>
      //   </View>
      // </View>
      <TabBarIOS>
        <TabBarItemIOS
          title='Activity'
          selected={this.state.selectedTab === 'Activity'}
          iconName='ios-pulse'
          onPress={() => this.setState({ seletedTab: 'Activity'})}
        >
          <ActivityView />
        </TabBarItemIOS>
        <TabBarItemIOS
          title='Messages'
          selected={this.state.selectedTab === 'Messages'}
          iconName='ios-chatboxes'
          onPress={() => this.setState({ seletedTab: 'Messages'})}
        >
          <MessagesView />
        </TabBarItemIOS>
        <TabBarItemIOS
          title='Profile'
          selected={this.state.selectedTab === 'Profile'}
          iconName='ios-person'
          onPress={() => this.setState({ seletedTab: 'Profile'})}
        >
          <ProfileView />
        </TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

export default Dashboard
