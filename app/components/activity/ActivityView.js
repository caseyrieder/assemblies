import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, MapView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
import { upcomingEvent, FakeNotifications } from '../../fixtures' // fake data for mocking
import moment from 'moment' // for date formatting
import Colors from '../../styles/colors'
import { globals, activityStyles } from '../../styles'
const styles = activityStyles

// create map for the component
const ActivityMap = ({ event }) => {
  // define location & size of map
  const mapRegion = {
    latitude: event.location.lat,
    longitude: event.location.lng,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }

  // define mapview layout
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
}

// create Notification for the component
const Notification = ({ notification }) => (
  <TouchableOpacity style={[globals.flexRow, globals.ph1]}>
    <View style={globals.flex}>
      <View style={globals.flexRow}>
        {/* circle */}
        <View style={styles.circle}/>
        {/* notification type text */}
        <View style={[globals.textContainer, globals.pv1]}>
          <Text style={styles.h4}>
            New {notification.type}
          </Text>
        </View>
        {/* date from now */}
        <Text style={styles.h5}>
          {moment(new Date(new Date(notification.createdAt))).fromNow()}
        </Text>
      </View>
      {/* notification message */}
      <View style={globals.flex}>
        <Text style={styles.messageText}>
          {notification.message}
        </Text>
      </View>
    </View>
    {/* forward arrow */}
    <View>
      <Icon name='ios-arrow-forward' color='#777' size={25} />
    </View>
  </TouchableOpacity>
)

class Activity extends Component {
  render(){
    let titleConfig = { title: 'Activity', tintColor: 'white' }
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        {/* Scrollview of assemblies */}
        <ScrollView>
          {/* clickable for each assembly, with name & date */}
          <TouchableOpacity>
            <View style={[globals.flexRow, globals.mb1]}>
              <Text style={styles.h4}>
                Next Assembly:
              </Text>
              <Text style={globals.primaryText}>
                {upcomingEvent.name}
              </Text>
            </View>
            <Text style={[styles.dateText, globals.mb1]}>
              {moment(new Date(upcomingEvent.start)).format('dddd MMM Do, h:mm a')}
            </Text>
          </TouchableOpacity>
          {/* map for activity */}
          <ActivityMap event={upcomingEvent} />
          {/* Notifications view w/list of notifications */}
          <View>
            <Text style={[styles.h4, globals.mv1]}>
              Notifications
            </Text>
            <View style={globals.divider} />
            <View style={globals.flex}>
              {FakeNotifications.map((n, idx) => (
                <View key={idx} style={globals.flex}>
                  <Notification notification={n} />
                </View>
              ))}
              <View style={styles.emptySpace} />
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Activity
