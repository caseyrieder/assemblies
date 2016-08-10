// base components
import React, { Component } from 'react'
import { Navigator } from 'react-native'
// Group routes
import Groups from './Groups'
import Group from './Group'
import CreateGroup from './CreateGroup'
import CreateGroupConfirm from './CreateGroupConfirm'
import Event from './Event'
import CreateEvent from './CreateEvent'
import CreateEventConfirm from './CreateEventConfirm'
import Conversation from '../messages/Conversation'
import Profile from '../profile'
// helpers
import Headers from '../../fixtures'
import { API, DEV } from '../../config'
import { find, isEqual } from 'underscore'
import { globals } from '../../styles'

// turn GroupsView into Dashboard
class GroupsView extends Component {
  // initialize state & bindings
  constructor(){
    super();
    this.addGroup = this.addGroup.bind(this);
    this.unsubscribeFromGroup = this.unsubscribeFromGroup.bind(this);
    this.addUserToGroup = this.addUserToGroup.bind(this);
    this.state = {
      groups: [],
      ready: false,
      suggestedGroups: [],
    }
  }
  // first action before we view component--> show user's groups
  componentWillMount(){
    this._loadGroups(this.props.currentUser);
  }
  // for adding a new group to the list
  addGroup(group){
    this.setState({
      groups: [
        ...this.state.groups, group
      ]
    })
  }
  // add the user to the group in the UI
  addUserToGroup(group, currentUser){
    // set userGroups & userSuggesteds as state; set currentUser as member
    let { groups, suggestedGroups } = this.state;
    let member = {
      userId: currentUser.id,
      role: 'member',
      joinedAt: new Date().valueOf(),
      confirmed: true
    };
    // as long as currentUser isn't in the group yet...
    if (!find(group.members, ({ userId }) => isEqual(userId, currentUser.id))) {
      // add currentUser(member) to group members list
      group.members = [ ...group.members, member ];
      // add group to user groups
      groups = [ ...groups, group ];
      // filter group out of selectedGroups
      suggestedGroups = suggestedGroups.filter(({ id }) => ! isEqual(id, group.id));
      // re-set groups & selecteds within state
      this.setState({ groups, suggestedGroups })
      // call the updateGroup method to send info to DB
      this.updateGroup(group);
    }
  }
  // send user to the group on the DB
  updateGroup(group){
    fetch(`${API}/groups/${group.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify(group)
    })
    .then(response => response.json())
    .then(data => {})
    .catch(err => {})
    .done();
  }
  // unsubscribe (from ActionSheet)
  unsubscribeFromGroup(group, currentUser){
    // define userGroups & suggesteds as state
    let { groups, suggestedGroups } = this.state;
    // filter currentUser out of group members
    group.members = group.members.filter(({ userId }) => !isEqual(userId, currentUser.id));
    // filter group out of userGroups
    groups = groups.filter(({ id }) => !isEqual(id, group.id));
    // add group to suggesteds
    suggestedGroups = [ ...suggestedGroups, group ];
    // re-set group/suggesteds state
    this.setState({ groups, suggestedGroups });
    // call updateGroup to send data to DB
    this.updateGroup(group);
  }
  // fetch user's groups
  _loadGroups(currentUser){
    // create query to match currentUser.id with member Ids
    let query = {
      members: { $elemMatch: { userId: currentUser.id }},
      $limit: 10
    };
    // fire off & handle the fetch
    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this._loadSuggestedGroups(groups))
    .catch(err => this.ready(err))
    .done();
  }
  // load group suggestions
  _loadSuggestedGroups(groups){
    // set state to existing groups list
    this.setState({ groups, ready: true });
    // find other groups based on location --> $nin= NOT IN
    let query = {
      id: { $nin: groups.map(group => group.id) },
      'location.city.long_name': this.props.currentUser.location.city.long_name,
      $limit: 4
    };
    fetch(`${API}/groups/?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(suggestedGroups => this.setState({ suggestedGroups }))
    .catch(err => this.ready(err))
    .done();
  }
  // ready state changer
  ready(err){
    this.setState({ ready: true })
  }
  // renderer
  render(){
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Groups' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Groups':
              return (
                <Groups
                  {...this.props}
                  {...this.state}
                  navigator={navigator}
                />
              );
            case 'Group':
              return (
                <Group
                  {...this.props}
                  {...this.state}
                  {...route}
                  addUserToGroup={this.addUserToGroup}
                  navigator={navigator}
                  unsubscribeFromGroup={this.unsubscribeFromGroup}
                />
              );
            case 'CreateGroup':
              return (
                <CreateGroup
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
              );
            case 'CreateGroupConfirm':
              return (
                <CreateGroupConfirm
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                  addGroup={this.addGroup}
                />
              );
            case 'Event':
              return (
                <Event
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              );
            case 'CreateEvent':
              return (
                <CreateEvent
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              );
            case 'CreateEventConfirm':
              return (
                <CreateEventConfirm
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
              );
            case 'Profile':
              return (
                <Profile
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              );
            case 'Conversation':
              return (
                <Conversation
                  {...this.props}
                  {...route}
                  navigator={navigator}
                />
              );
          }
        }}
      />
    );
  }
};

export default GroupsView;
