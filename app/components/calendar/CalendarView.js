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
  // fetch groups
  _loadGroups(){
    //TODO
  }
  // process ready error
  ready(err){
    this.setState({ ready: true });
  }
  // fetch events
  _loadEvents(groups){
    // TODO
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
