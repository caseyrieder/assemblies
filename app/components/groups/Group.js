// elements
import React, { Component } from 'react'
import { View, ListView, ScrollView, TouchableOpacity, Text, Image, ActionSheetIOS } from 'react-native'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
import Icon from 'react-native-vector-icons/Ionicons'
// helpers
import Swipeout from 'react-native-swipeout'
import moment from 'moment'
import { find, findIndex, isEqual } from 'underscore'
import { API, DEV } from '../../config'
import { Headers } from '../../fixtures'
import { rowHasChanged } from '../../utils'
// styles
import { globals, groupsStyles } from '../../styles'
import Colors from '../../styles/colors'
const styles = groupsStyles;

// identify if user is a group member
function isMember(group, currentUser){
  return findIndex(group.members, ({ userId }) => isEqual(userId, currentUser.id)) !== -1;
};
// show join for non-members
function showJoinButton(users, currentUser){
  return findIndex(users, ({ id }) => isEqual(id, currentUser.id)) === -1;
}
// list event names for this group
class EventList extends Component {
  // initialize binding
  constructor(){
    super();
    this._renderRow = this._renderRow.bind(this);
  }
  // method for rendering button based on attendance
  getButtons(isGoing, event, currentUser){
    if (isGoing) {
      return [{
        text: 'Cancel',
        type: 'delete',
        onPress: () => {this.props.cancelRSVP(event, currentUser)}
      }];
    } else {
      return [{
        text: 'RSVP',
        type: 'primary',
        onPress: () => {this.props.joinEvent(event, currentUser)}
      }];
    }
  }
  // render the event row
  _renderRow(event, sectionID, rowID){
    // assign props & calculate if current user is going
    let { currentUser, events, group } = this.props;
    let isGoing = find(event.going, (id) => isEqual(id, currentUser.id));
    // enable the swipe button
    let right = this.getButtons(isGoing, event, currentUser);
    return (
      <Swipeout backgroundColor='white' rowID={rowID} right={right}>
        <View style={styles.eventContainer}>
          {/* visit event on row press: name, startTime, # going */}
          <TouchableOpacity
            style={globals.flex}
            onPress={() => this.props.visitEvent(event)}
          >
            <Text style={globals.h5}>
              {event.name}
            </Text>
            <Text style={styles.h4}>
              {moment(event.start).format('dddd, MMM Do')}
            </Text>
            <Text style={styles.h4}>
              {event.going.length} Going
            </Text>
          </TouchableOpacity>
          {/* display icno & text based on if current user is going */}
          <View style={[globals.flexRow, globals.pa1]}>
            <Text style={[globals.primaryText, styles.h4, globals.ph1]}>
              {isGoing ? "You're Going" : "Want to go?"}
            </Text>
            <Icon
              name={isGoing ? 'ios-checkmark' : 'ios-add'}
              size={30}
              color={Colors.brandPrimary}
            />
          </View>
        </View>
      </Swipeout>
    )
  }
  // set up the sataSource for the list from events prop
  dataSource(){
    return (
      new ListView.DataSource({ rowHasChanged }).cloneWithRows(this.props.events)
    );
  }
  // display the list
  render(){
    // handle an empty event list
    if (!this.props.events.length){
      return (
        <Text style={[globals.h5, globals.mh2]}>
          No events scheduled
        </Text>
      )
    }
    return (
      <ListView
        enableEmptySections={true}
        dataSource={this.dataSource}
        renderRow={this._renderRow}
        scrollEnabled={false}
        style={globals.flex}
      />
    )
  }
};
// stateful join button
class JoinButton extends Component {
  render(){
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
// Button to open ActionSheet, for leaving a group
const OptionsButton = ({ openActionSheet }) => {
  return (
    <TouchableOpacity style={globals.pa1} onPress={openActionSheet}>
      <Icon name='ios-more' size={25} color='#ccc' />
    </TouchableOpacity>
  )
}

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
  constructor(){
    super();
    this.openActionSheet = this.openActionSheet.bind(this);
    this.cancelRSVP = this.cancelRSVP.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
    this.goBack = this.goBack.bind(this);
    this.visitProfile = this.visitProfile.bind(this);
    this.visitEvent = this.visitEvent.bind(this);
    this.visitCreateEvent = this.visitCreateEvent.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
    this.state = {
      events: [],
      ready: false,
      users: [],
    }
  }
  // method for opening the action sheet
  openActionSheet(){
    // assign group & currentUser to props
    let { group, currentUser } = this.props;
    // member is the userId of the currentUser
    let member = find(group.members, ({ userId }) => isEqual(userId, currentUser.id));
    // Define 2 actionSheet buttons
    let buttonActions = ['Unsubcribe', 'Cancel'];
    // if member=owner, can also create event from actionsheet
    if (member && member.role === 'owner') {
      buttonActions.unshift('Create Event');
    }
    // define options
    let options = {
      options: buttonActions,
      cancelButtonIndex: buttonActions.length-1
    };
    // display the ActionSheet & define actions for each button
    ActionSheetIOS.showActionSheetWithOptions(options, (buttonIndex) => {
      switch(buttonActions[buttonIndex]){
        case 'Unsubscribe':
          this.props.unsubscribeFromGroup(group, currentUser);
          break;
        case 'Create Event':
          this.visitCreateEvent(group);
          break;
        default:
          return;
      }
    });
  }
  // cancel RSVP : remove currrentId from going list & update stuff
  cancelRSVP(event, currenUser){
    let { events } = this.state;
    // remove user from event
    let updatedEvent = {
      ...event,
      going: event.going.filter((userId) => !isEqual(userId, currenUser.id))
    };
    // find the event
    let index = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    // update full events list
    let updatedEvents = [
      ...events.slice(0, index),
      updatedEvent,
      ...events.slice(index + 1)
    ];
    // set events state & call updateEventGoing method
    this.setState({ events: updatedEvents })
    this.updateEventGoing(event);
  }
  // joining event
  joinEvent(event, currentUser){
    let { events } = this.state;
    // add user to event
    let updatedEvent = {
      ...event,
      going: [ ...event.going, currentUser.id ]
    };
    // find the event
    let index = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    // update full events list
    let updatedEvents = [
      ...events.slice(0, index),
      updatedEvent,
      ...events.slice(index + 1)
    ];
    // set events state & call updateEventGoing method
    this.setState({ events: updatedEvents })
    this.updateEventGoing(event);
  }
  // reoute to Event screen
  visitEvent(){
    this.props.navigator.push({
      name: 'Event',
      group: this.props.group,
      updateEvents: this.updateEvents,
      event,
    })
  }
  // method for updating events
  updateEvents(event){
    let { events } = this.state;
    // find the event
    let idx = findIndex(this.state.events, ({ id }) => isEqual(id, event.id));
    // update the events list & its state
    let updatedEvents = [
      ...events.slice(0, idx),
      event,
      ...events.slice(idx + 1)
    ];
    this.setState({ events: updatedEvents })
  }
  // send new attendees updates to the DB
  updateEventGoing(event){
    fetch(`${API}/events/${event.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({
        going: event.going
      })
    })
    .then(response => response.json())
    .then(data => {})
    .catch(err => {})
    .done();
  }
  // load events after component mounts
  componentDidMount(){
    this._loadEvents();
  }
  // fetch list of events from DB
  _loadEvents(){
    // get group events where endTime is after now
    let query = {
      groupId: this.props.group.id,
      end: { $gt: new Date().valueOf() },
      $limit: 10,
      $sort: { start: -1 }
    };
    // send query, handle it, fire off eventUsers fetch
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(events => this._loadUsers(events))
    .catch(err => {})
    .done();
  }
  // fetch list of group members from DB
  _loadUsers(events){
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
  goBack(){
    this.props.navigator.replacePreviousAndPop({ name: 'Groups' });
  }
  // view profile of clicked member
  visitProfile(user){
    this.props.navigator.push({
      name: 'Profile',
      user
    })
  }
  // navigate to event creation view
  visitCreateEvent(group){
    this.props.navigator.push({
      name: 'CreateEvent',
      group
    })
  }
  // display the component
  render(){
    // assign group & currentUser to props
    let { group, currentUser } = this.props;
    // assign variable to handle whether joinButton is displayed
    let showButton = showJoinButton(this.state.users, currentUser) && this.state.ready;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{title: group.name, tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton navigator={navigator} handlePress={this.goBack}/>}
          rightButton={<OptionsButton openActionSheet={this.openActionSheet}/>}
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
          <EventList
            {...this.state}
            {...this.props}
            visitEvent={this.visitEvent}
            joinEvent={this.joinEvent}
            cancelRSVP={this.cancelRSVP}
          />
          {/* clickable members */}
          <View style={globals.lightDivider} />
          <Text style={styles.h2}>Members</Text>
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
