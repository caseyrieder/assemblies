// base components
import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Ionicons'
import BackButton from '../shared/BackButton'
import { EmptyGroupBox } from '../groups/Groups'
// helpers
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, groupsStyles, profileStyles } from '../../styles'
const styles = profileStyles;

// handle formatting of groups, based on even/odd number
function formatGroups(groups){
  if (groups.length % 2 === 1) {
    return groups.concat(null);
  } else {
    return groups;
  }
};
// stateless box for groups...map over each, show empty if needed
// ...image with color in background & text in foreground
const GroupBoxes = ({ groups }) => {
  return (
    <View style={groupsStyles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        return (
          <View key={idx} style={globals.flexRow}>
            <Image source={{uri: group.image}} style={groupsStyles.groupImage}>
              <View style={[groupsStyles.groupBackground, {backgroundColor: group.color,}]}>
                <Text style={groupsStyles.groupText}>{group.name}</Text>
              </View>
            </Image>
          </View>
        );
      })}
    </View>
  );
}
// actual component
class Profile extends Component {
  // initialize
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.state = {
      groups: []
    }
  }
  // on mounting, fetch this user's groups from DB & populate state.groups
  componentDidMount(){
    let query = {
      members: {
        $elemMatch: {userId: this.props.user.id}
      }
    };
    fetch(`${API}/groups?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this.setState({ groups }))
    .catch(err => console.log('ERR: ', err))
    .done();
  }
  // goBack
  goBack(){
    this.props.navigator.pop();
  }
  // sendMessage by routing to conversation
  sendMessage(){
    this.props.navigator.push({
      name: 'Conversation',
      user: this.props.user
    });
  }
  // display
  render(){
    // assign user to props, title to name
    let { user } = this.props;
    let title = `${user ? user.firstName : "User"}'s Profile'`;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: title, tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        {/* scroller */}
        <ScrollView style={[globals.flex, globals.mt1]}>
          {/* avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{uri: user.avatar}} style={styles.avatar}/>
          </View>
          {/* name */}
          <Text style={[globals.h4, globals.centerText]}>
            {user.firstName} {user.lastName}
          </Text>
          {/* location */}
          <Text style={[globals.h5, globals.centerText]}>
            {user.location.city.long_name}, {user.location.state.long_name}
          </Text>
          {/* send message button */}
          <TouchableOpacity style={[globals.row, globals.mv2]} onPress={this.sendMessage}>
            <Icon name='ios-chatboxes' sieze={40} style={globals.mr1} color={Colors.brandPrimary}/>
            <Text style={globals.h5}>Send a Message</Text>
          </TouchableOpacity>
          <View style={globals.lightDivider}></View>
          {/* technologies list */}
          <View style={globals.ph1}>
            <Text style={[globals.h4, globals.ma1]}>
              Technologies
            </Text>
            <Text style={[globals.h5, globals.primaryText, globals.ma1]}>
              {user.technologies.join(', ')}
            </Text>
            <Text style={[globals.h4, globals.ma1]}>
              Assemblies
            </Text>
          </View>
          {/* assemblies list */}
          <View style={globals.flex}>
            <GroupBoxes groups={this.state.groups}/>
          </View>
        </ScrollView>
      </View>
    )
  }
};

export default Profile;
