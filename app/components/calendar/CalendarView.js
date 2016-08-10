// basic elements
import React, { Component } from 'react'
import { Navigator } from 'react-native'
// routes
import Calendar from './Calendar'
import Event from '../groups/Event'
// helpers
import { API, DEV } from '../../config'
import { extend } from 'underscore'
// styles
import { globals } from '../../styles'

class CalendarView extends Component {
  // initialize
  constructor(){
    super();
    this.state = {
      events: [],
      ready: false,
    }
  }
  // fetch groups where user is a member, then fire off a call to load events from those groups
  _loadGroups(){
    let query = {
      members: {
        $elemMatch: {
          userId: this.props.currentUser.id
        }
      }
    };
    fetch(`${API}/groups?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(groups => this._loadEvents(groups))
    .catch(err => this.ready(err))
    .done();
  }
  // process ready error
  ready(err){
    this.setState({ ready: true });
  }
  // fetch events
  _loadEvents(groups){
    // dateQuery ensures events end after now
    let dateQuery = { end: { $gt: new Date().valueOf() }};
    // query all events near me, im going to, or in my groups, that end after now
    let query = {
      $or: [
        extend({}, dateQuery, { groupId: { $in: groups.map((g) => g.id)}}),
        extend({}, dateQuery, { going: { $elemMatch: { $eq: this.props.currentUser.id }}}),
        extend({}, dateQuery, { 'location.city.long_name': this.props.currentUser.location.city.long_name }),
      ],
      $limit: 20,
    };
    // fetch those events based on this criteria, & set'em to state
    fetch(`${API}/events?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(events => this.setState({ events, ready: true }))
    .catch(err => this.ready(err))
    .done();
  }
  // on mount
  componentDidMount(){
    this._loadGroups();
  }
  // display navigator
  render(){
    return (
      <Navigator
        initialRoute={{ name: 'Calendar' }}
        style={globals.flex}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Calendar':
              return (
                <Calendar
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
          }
        }}
      />
    )
  }
};

export default CalendarView;
