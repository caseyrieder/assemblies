// basic elements
import React, { Component } from 'react'
import { View, Text, ScrollView, Image, MapView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
// helpers
import moment from 'moment'
import Headers from '../../fixtures'
import { find, uniq, contains } from 'underscore'
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, groupsStyles } from '../../styles'
const styles = groupsStyles;

// stateless empty map, shows # of attendees
const EmptyMap = ({ going, ready }) => (
  <View>
    <View style={[globals.map, globals.inactive, globals.pa1]}/>
    <View style={styles.bottomPanel}>
      <Text style={[globals.h5, globals.primaryText]}>
        {ready ? `${going.length} going` : ''}
      </Text>
    </View>
  </View>
);

// stateless event map
const EventMap = ({ location, going, ready }) => {
  // display EmptyMap if no location or lcoation isnt an object
  if (!location || typeof location != 'object') {
    return <EmptyMap going={going} ready={ready}/>
  }
  // set mapRegion based on location
  const mapRegion = {
    latitude: location.lat,
    longitude: location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  }
  // display map with address below
  return (
    <View style={globals.inactive}>
      <MapView
        style={globals.map}
        region={mapRegion}
        annotations={[{
          latitude: mapRegion.latitude,
          longitude: mapRegion.longitude
        }]}
      />
      <View style={[styles.bottomPanel, globals.inactive, globals.pa1]}>
        <Text style={[globals.h5, globals.primaryText]}>
          {location.formattedAddress}
        </Text>
      </View>
    </View>
  )
}
// stateless controls for joining or displaying joined-ness
const JoinControls = ({ hasJoined, joinEvent }) => (
  <View style={[styles.joinButtonContainer, globals.mv1]}>
    {/* only allows joinEvent if user is not joined */}
    <TouchableOpacity
      onPress={() => {if (!hasJoined) joinEvent()}}
      style={styles.joinButton}
    >
      <Text style={styles.joinButtonText}>
        {hasJoined ? 'Joined' : 'Join'}
      </Text>
      <Icon
        name={hasJoined ? 'ios-checkmark' : 'ios-add'}
        size={30}
        color='white'
      />
    </TouchableOpacity>
  </View>
)
//component
class Event extends Component {
  // initialize bindings & state
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.joinEvent = this.joinEvent.bind(this);
    this.state = {
      ready: false,
      eventMembers: []
    };
  }
  // get users who are going from DB, set'em to state.eventMembers
  _loadUsers(){
    let query = { id: { $in: this.props.event.going } };
    fetch(`${API}/users?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(eventMembers => this.setState({ eventMembers }))
    .catch(err => {})
    .done();
  }
  //act on component mounting
  componentDidMount(){
    this._loadUsers();
  }
  // method for joining an event
  joinEvent(){
    // set props, add currentId to going/eventMembers, update state
    let { event, currentUser, updateEvents } = this.props;
    let going = [ ...event.going, currentUser.id ];
    let users = [ ...this.state.eventMembers, currentUser ]
    this.setState({ eventMembers: users });
    // place the new attendees list ot the DB & updateEvents in HOC
    fetch(`${API}/events/${event.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({going: going})
    })
    .then(response => response.json())
    .then(data => updateEvents(data))
    .catch(err => console.log('UPDATE EVENT ERROR: ', err))
    .done();
  }
  // enable back btn
  goBack(){
    this.props.navigator.pop();
  }
  // reroute to user's profile after ensuring user isn't me
  visitProfile(user){
    if (user.id === this.props.currentUser.id) {
      return;
    }
    this.props.navigator.push({
      name: 'Profile',
      user
    })
  }
  // render component
  render(){
    // assign some variables to state & props
    let { event, group, currentUser, navigator } = this.props;
    let { ready, eventMembers } = this.state;
    // determine is currentUser is in event
    let hasJoined = contains(event.going, currentUser.id);
    // did current User just join??
    let justJoined = contains(eventMembers.map(m => m.id), currentUser.id);
    // display the event
    return (
      <View style={styles.flexContainer}>
        <NavigationBar
          title={{title: event.name, tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <ScrollView
          style={globals.flexContainer}
          contentInset={{bottom: 49}}
        >
          {/* Basic location, name, date info */}
          <EventMap
            location={event.location}
            going={event.going}
            ready={ready}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Summary
            </Text>
            <Text style={[styles.h4, globals.mh2]}>
              {event.description ? event.description : 'N/A'}
            </Text>
          </View>
          <View style={globals.lightDivider}/>
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Date
            </Text>
            <Text style={[styles.h4, globals.mh2]}>
              {moment(event.start).format('dddd, MMM Do, h:mm')} until {moment(event.end).format('dddd, MMM Do, h:mm')}
            </Text>
          </View>
          <View style={globals.lightDivider}/>
          {/* Join controls if needed */}
          {!hasJoined && <JoinControls hasJoined={justJoined} joinEvent={this.joinEvent}/>}
          {/* Info on attendees */}
          <View style={styles.infoContainer}>
            <Text style={styles.h2}>
              Going <Text style={styles.h4}>{eventMembers.length}</Text>
            </Text>
            {eventMembers.map((member, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => this.visitProfile(member)}
                style={globals.flexRow}
              >
                <Image
                  source={{uri: member.avatar}}
                  style={globals.avatar}
                />
                <View style={globals.textContainer}>
                  <Text style={globals.h5}>
                    {member.firstName} {member.lastName}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.break} />
        </ScrollView>
      </View>
    )
  }
}

export default Event;
