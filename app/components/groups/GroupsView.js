import React, { Component } from 'react'
// import Navigator, becaue this is now a dashboard
import { Navigator } from 'react-native'
// import Group-related Components
import Groups from './Groups'
import CreateGroup from './CreateGroup'
import CreateGroupConfirmation from './CreateGroupConfirmation'
// import Headers, API/DEV, find/isEqual & globals because we need'em
import Headers from '../../fixtures'
import { API, DEV } from '../../config'
import { find, isEqual } from 'underscore'
import { globals } from '../../styles'

// turn GroupsView into Dashboard
class GroupsView extends Component {
  // initialize state
  constructor() {
    super();
    this.state = {
      groups: [],
      ready: false,
      suggestedGroups: [],
    }
  }
  // first action before we view component--> show user's groups
  componentWillMount() {
    this._loadGroups(this.props.currentUser);
  }
  // fetch user's groups
  _loadGroups(currentUser) {
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
  _loadSuggestedGroups(groups) {
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
  ready(err) {
    this.setState({ ready: true })
  }
  // renderer
  render() {
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
            case 'CreateGroup':
              return (
                <CreateGroup
                  {...this.props}
                  {...this.state}
                  {...route}
                  navigator={navigator}
                />
            );
            case 'CreateGroupConfirmation':
              return (
                <CreateGroupConfirmation
                  {...this.props}
                  {...this.state}
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
