// elements
import React, { Component } from 'react'
import { Navigator } from 'react-native'
// Views for routing
import Activity from './Activity'
import Conversation from '../messages/Conversation'
import Event from '../groups/Event'
// helpers
import { extend } from 'underscore'
import { API, DEV } from '../../config'
// styles
import { globals } from '../../styles'

class ActivityView extends Component {
  // initialize
  constructor(){
    super();
    this.state = {
      nextEvents: [],
      notifications: [],
    }
  }
  // on display
  componentDidMount(){
    this._loadNotifications();
  }
  // load notifications from DB
  _loadNotifications(){
    // set query, gather all notifications where user is participant
    let query = {
      participants: {
        $elemMatch: {
          userId: this.props.currentUser.id
        }
      }
    };
    // fetch the data & poss response into loadNotifications call
    fetch(`${API}/notifications?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(notifications => this._loadNextEvents(notifications))
    .catch(err => {})
    .done();
  }
  // load next events from notifications
  _loadNextEvents(notifications){
    // set notifications state, ensure query will only load things ending after now
    this.setState({ notifications });
    let dateQuery = { end: { $gt: new Date().valueOf() }};
    // query pulls all events where I', going, or are near me (provided they end after now)
    let query = {
      $or: [
        extend({}, dateQuery, { going: { $elemMatch: { $eq: this.props.currentUser.id }}}),
        extend({}, dateQuery, { 'location.city.long_name': this.props.currentUser.location.city.long_name })
      ],
      $limit: 1,
      $sort: { createdAt: 1 }
    };
    // query using those params & set the repsonse into nextEvents
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(nextEvents => this.setState({ nextEvents }))
    .catch(err => {})
    .done();
  }
  // display
  render(){
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Activity' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Activity':
              return (
                <Activity
                  {...this.props}
                  {...route}
                  {...this.state}
                  navigator={navigator}
                />
              );
            case 'Event':
              return (
                <Event
                  {...this.props}
                  {...route}
                  {...this.state}
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
    )
  }
}

export default ActivityView;
