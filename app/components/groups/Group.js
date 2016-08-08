// elements
import React, { Component } from 'react'
import { View, ListView, ScrollView, TouchableOpacity, Text, Image, ActionSheetIOS } from 'react-native'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
import Icon from 'react-native-vector-icons/Ionicons'
// helpers
import moment from 'moment'
import { find, findIndex, isEqual } from 'underscore'
import { API, DEV } from '../../config'
import { Headers } from '../../fixtures'
// styles
import { globals, groupsStyles } from '../../styles'
import Colors from '../../styles/colors'
const styles = groupsStyles;

// identify if user is a group member
function isMember(group, currentUser) {
  return findIndex(group.members, ({ userId }) => isEqual(userId, currentUser.id)) !== -1;
};
// show join for non-members
function showJoinButton(users, currentUser) {
  return findIndex(users, ({ id }) => isEqual(id, currentUser.id)) === -1;
}
// list event names for this group
class EventList extends Component {
  render() {
    return (
      <View>
        {this.props.events.map((event, idx) => {
          return (
            <Text>{event.name}</Text>
          )
        })}
      </View>
    );
  }
};
// stateful join button
class JoinButton extends Component {
  render() {
    // define props for the component; boolean for joined-ness
    let { addUserToGroup, group, currentUser } = this.props
    let hasJoined = isMember(group, currentUser);
    // clickable, different text & icon for member vs non
    return (
      <View style={[styles.joinButtonContainer, globals.mv1]}>
        <TouchableOpacity
          onPress={() => addUserToGroup(group, currentUser)}
          style={styles.joinButton}
        >
          <Text style={styles.joinButtonText}>
            {hasJoined ? 'Joined' : 'Join'}
          </Text>
          <Icon
            name={hasJoined ? 'ios-checkmark' : 'ios-add'}
            size={30}
            color='white'
            style={styles.joinIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }
};
// stateless list of group members
export const GroupMembers = ({ users, members, handlePress }) => {
  // define user var for each member, return if none exist
  // clickable avatar, user name, & role as member
  return (
    <View>
      {members.map((member, idx) => {
        let user = find(users, ({ id }) => isEqual(id, member.userId));
        if (!user) { return; }
        return (
          <TouchableOpacity
            key={idx}
            style={globals.flexRow}
            onPress={() => handlePress(user)}
          >
            <Image source={{uri: user.avatar}} style={globals.avatar}/>
            <View style={globals.textContainer}>
              <Text style={globals.h5}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={[styles.h4, globals.mh1]}>
                {member.role}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  );
};
// finally, the actual component
class Group extends Component {
  // initialize bindings & state
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
    this.visitProfile = this.visitProfile.bind(this);
    this.state = {
      events: [],
      ready: false,
      users: [],
    }
  }
  // load users after component mounts
  componentDidMount() {
    this._loadUsers();
  }
  // fetch list of group members from DB
  _loadUsers(events) {
    // set events state
    this.setState({ events })
    // query to get all userIds for group members
    let query = {
      id: { $in: this.props.group.members.map(({ userId }) => userId ) },
      $limit: 100
    };
    // Fetch userIds, pass them to state.users + make state.ready
    fetch(`${API}/users?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(users => this.setState({ users, ready: true }))
    .catch(err => {})
    .done();
  }
  // enable back button
  goBack() {
    this.props.navigator.replacePreviousAndPop({ name: 'Groups' });
  }
  // view profile of clicked member
  visitProfile(user) {
    this.props.navigator.push({
      name: 'Profile',
      user
    })
  }
  // create new event for the group
  visitCreateEvent(group) {
    this.props.navigator.push({
      name: 'CreateEvent',
      group
    })
  }
  // display the component
  render() {
    // assign group & currentUser to props
    let { group, currentUser } = this.props;
    // assign variable to handle whether joinButton is displayed
    let showButton = showJoinButton(this.state.users, currentUser) && this.state.ready;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: group.name, tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        {/* ScrollView */}
        <ScrollView style={globals.flex}>
          {/* Image w/Name & membercount overlayed */}
          <Image source={{uri: group.image}} style={styles.groupTopImage}>
            <View style={styles.overlayBlur}>
              <Text style={styles.h1}>{group.name}</Text>
            </View>
            <View style={styles.bottomPanel}>
              <Text style={[globals.h4, globals.primaryText]}>
                {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
              </Text>
            </View>
          </Image>
          {/* description, technologies */}
          <Text style={styles.h2}>Summary</Text>
          <Text style={[globals.h5, globals.ph2]}>{group.description}</Text>
          <Text style={styles.h2}>Technologies</Text>
          <Text style={[globals.h5, globals.ph2]}>{group.technologies.join(', ')}</Text>
          <View style={globals.lightDivider}/>
          {/* show join button if appropriate */}
          {showButton ?
          <JoinButton
            addUserToGroup={this.props.addUserToGroup}
            group={group}
            currentUser={currentUser} />
          : null}
          {/* past events listed */}
          <Text style={styles.h2}>Events</Text>
          <View style={globals.lightDivider} />
          {/* clickable members */}
          <Text style={styles.h2}>Members</Text>
          <View style={globals.lightDivider} />
          <GroupMembers
            members={group.members}
            users={this.state.users}
            handlePress={this.visitProfile}
          />
        </ScrollView>
      </View>
    )
  }
};

export default Group;
