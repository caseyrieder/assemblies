// elements
import React, { Component } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationBar from 'react-native-navbar'
// helpers
import { ImageOptions, Headers } from '../../fixtures'
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, profileStyles } from '../../styles'
const styles = profileStyles;

class UserProfile extends Component {
  // initialize
  constructor(){
    super();
    this.visitTechnologies = this.visitTechnologies.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.visitSettings = this.visitSettings.bind(this);
  }
  // display image picker & update user's avatar in DB, then in UI
  showImagePicker(){
    ImagePicker.showImagePicker(ImageOptions, (response) => {
      if (response.didCancel || response.error) { return; }
      const avatar = 'data:image/png;base64,' + response.data;
      fetch(`${API}/users/${this.props.currentUser.id}`, {
        method: 'PUT',
        headers: Headers,
        body: JSON.stringify({avatar: avatar})
      })
      .then(response => response.json())
      .then(user => this.props.updateUser(user))
      .catch(err => console.log('ERR:', err))
      .done();
    });
  }
  // route to Technologies View
  visitTechnologies(){
    this.props.navigator.push({
      name: 'UserTechnologies',
      currentUser: this.props.currentUser
    });
  }
  // route to Settings View
  visitSettings(){
    this.props.navigator.push({
      name: 'UserSettings',
      currentUser: this.props.currentUser
    });
  }
  // render
  render(){
    // assign currentUser to props
    let { currentUser } = this.props;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Profile', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
        />
        <ScrollView style={globals.flex}>
          <View style={styles.flexRow}>
            <TouchableOpacity
              style={[globals.flexCenter, globals.pv1]}
              onPress={this.showImagePicker}
            >
              <Image
                source={{uri: currentUser.avatar}}
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <Text style={globals.h4}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={globals.h5}>
                {currentUser.location.city.long_name}, {currentUser.location.state.short_name}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.formButton}
            onPress={this.visitTechnologies}
          >
            <Text style={globals.h4}>
              My Technologies
            </Text>
            <Icon name='ios-arrow-forward' size={30} color='#ccc' />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.formButton}
            onPress={this.visitSettings}
          >
            <Text style={globals.h4}>
              Settings
            </Text>
            <Icon name='ios-arrow-forward' size={30} color='#ccc' />
          </TouchableOpacity>
          {/* wire up the logout button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={this.props.logout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
};

export default UserProfile;
