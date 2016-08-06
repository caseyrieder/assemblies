import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
// import { currentUser } from '../../fixtures' /* undo this now */
import Colors from '../../styles/colors'
import { globals, profileStyles } from '../../styles'
const styles = profileStyles

class ProfileView extends Component {
  render() {
    let { currentUser } = this.props; // add me, now that i've logged in
    let titleConfig = { title: 'Profile', tintColor: 'white' }
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView style={globals.flex}>
          <View style={styles.flexRow}>
            <TouchableOpacity style={[globals.flexCenter, globals.pv1]}>
              <Image
                source={{uri: currentUser.avatar}}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.flexContainer}>
              <Text style={globals.h4}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={globals.h5}>
                {currentUser.location.city.long_name}, {currentUser.location.state.short_name}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.formButton}>
            <Text style={globals.h4}>
              My Technologies
            </Text>
            <Icon name='ios-arrow-forward' size={30} color='#ccc' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formButton}>
            <Text style={globals.h4}>
              Settings
            </Text>
            <Icon name='ios-arrow-forward' size={30} color='#ccc' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

export default ProfileView
