import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'

import { globals } from '../../styles'

class Conversation extends Component {
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.navigator.pop();
  }
  render() {
    let { user, currentUser } = this.props;
    let titleConfig = {
      title: `${user.firstName} ${user.lastName}`,
      tintColor: 'white'
    };
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
