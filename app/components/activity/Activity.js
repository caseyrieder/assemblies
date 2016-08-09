// elements
import React, { Component } from 'react'
import { View, Text, ScrollView, InteractionManager, TouchableOpacity, MapView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
// helpers
import moment from 'moment'
// styles
import Colors from '../../styles/colors'
import { globals, activityStyles } from '../../styles'
const styles = activityStyles;

// show the map for the activity (if it exists)
const ActivityMap = ({ event, ready }) => {
  // ensure ready & event exists
  if (!ready || !event) {
    return <View style={globals.map} />
  }
  // define mapRegion
  const mapRegion = {
    latitude: event.location.lat,
    longitude: event.location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
  // display Map
  return (
    <MapView
      style={globals.map}
      region={mapRegion}
      annotations={[{
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude
      }]}
    />
  )
};
// define the Notification
const Notification = ({ notification, handlePress }) => (
  <TouchableOpacity
    style={[globals.flexRow, globals.ph1]}
    onPress={() => handlePress(notification)}
  >
    <View style={globals.flex}>
      <View style={globals.flexRow}>
        <View style={styles.circle}/>
        <View style={[globals.textContainer, globals.pv1]}>
          <Text style={styles.h4}>
            New {notification.type}
          </Text>
        </View>
        <Text style={styles.h5}>
          {moment(new Date(new Date(notification.createdAt))).fromNow()}
        </Text>
      </View>
      <View style={globals.flex}>
        <Text style={styles.messageText}>
          {notification.message}
        </Text>
      </View>
    </View>
    <View>
      <Icon
        name='ios-arrow-forward'
        color='#777'
        size={25}
      />
    </View>
  </TouchableOpacity>
)

class Activity extends Component {
  // intialize with bindings & state
  constructor(){
    super();
    this.handleNotificationPress = this.handleNotificationPress.bind(this);
    this.visitEvent = this.visitEvent.bind(this);
    this.state = {
      ready: false
    }
  }
  // after component mounts, set state to ready
  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this.setState({ ready: true })
    });
  }
  // route to Event view of next event in array
  visitEvent(){
    let event = this.props.nextEvents[0];
    this.props.navigator.push({
      name: 'Event',
      event,
    })
  }
  // when a notification is pressed...
  handleNotificationPress(notification){
    // go to Conversation view if notification is Message, Event if notification is an event
    if (notification.type === 'Message') {
      this.props.navigator.push({
        name: 'Conversation',
        ...notification.data
      })
    } else if (notification.type === 'Event') {
      this.props.navigator.push({
        name: 'Event',
        ...notification.data
      })
    }
  }
  // display component
  render(){
    // assign val to next event, if exists
    let upcomingEvent = this.props.nextEvents.length ? this.props.nextEvents[0] : null;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={{ title: 'Activity', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView>
          <TouchableOpacity onPress={this.visitEvent}>
            <View style={[globals.flexRow, globals.mb1]}>
              <Text style={styles.h4}>
                Next Assembly:
              </Text>
              <Text style={globals.primaryText}>
                {upcomingEvent && upcomingEvent.name}
              </Text>
            </View>
            <Text style={[styles.dateText, globals.mb1]}>
              {upcomingEvent && moment(new Date(upcomingEvent.start)).format('dddd MMM Do, h:mm a')}
            </Text>
          </TouchableOpacity>
          <ActivityMap
            event={upcomingEvent}
            ready={this.state.ready}
          />
          <View>
            <Text style={[styles.h4, globals.mv1]}>
              Notifications
            </Text>
            <View style={globals.divider}/>
            <View style={globals.flex}>
              {this.props.notifications.map((n, idx) => (
                <View key={idx} style={globals.flex}>
                  <Notification
                    notification={n}
                    handlePress={this.handleNotificationPress}
                  />
                </View>
              ))}
              <View style={styles.emptySpace}/>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
};

export default Activity;
