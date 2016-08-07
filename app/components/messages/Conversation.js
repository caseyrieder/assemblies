import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'

import { globals } from '../../styles'

class Conversation extends Component {
  // initialize binding
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }
  // enable back button
  goBack() {
    this.props.navigator.pop();
  }
  // set user/currentUser as props, config title
  render() {
    let { user, currentUser } = this.props;
    let titleConfig = {
      title: `${user.firstName} ${user.lastName}`,
      tintColor: 'white'
    };
    // return navbar w/Back & text 'Conversation'
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={titleConfig}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <View style={globals.flexCenter}>
          <Text style={globals.h2}>
            Conversation
          </Text>
        </View>
      </View>
    )
  }
};

export default Conversation
