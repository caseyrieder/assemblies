// elements
import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import BackButton from '../shared/BackButton';
// helpers
import { find } from 'underscore'
import { Headers } from '../../fixtures'
import { GooglePlacesCityConfig } from '../../config'
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, formStyles, autocompleteStyles } from '../../styles'
const styles = formStyles;
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

// set errors
function setErrorMsg({ location, firstName, lastName, email }){
  if (typeof location !== 'object' || !location.city) {
    return 'Must provide a valid location';
  } else if (firstName === '') {
    return 'Must provide a valid first name';
  } else if (lastName === '') {
    return 'Must provide a valid a last name';
  } else if (email === ''){
    return 'Must provide a valid email address';
  } else {
    return '';
  }
}

class UserSettings extends Component {
  constructor(){
    super();
    this.saveSettings = this.saveSettings.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      email: props.currentUser.username,
      errorMsg: '',
      firstName: props.currentUser.firstName,
      lastName: props.currentUser.lastName,
      location: props.currentUser.location,
    }
  }
  // updaate all the user settings, send to DB
  saveSettings(){
    // stop this fxn if we have an error
    let errorMsg = setErrorMsg(this.state);
    if (errorMsg !== '') {
      this.setState({ errorMsg });
      return;
    }
    // define new user based on state
    let user = {
      location: this.state.location,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email
    };
    // d the actual DB call & handle the response
    fetch(`${API}/users/${this.props.currentUser.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(user => this.updateUser(user))
    .catch(err => console.log('ERR:', err))
    done();
  }
  // update user UI & reroute backwards
  updateUser(user){
    this.props.updateUser(user);
    this.goBack();
  }
  // find & save location data
  selectLocation(data, details){
    // stop if we dont have details
    if (!details) { return; }
    // find location
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => c.types[0] === 'locality'),
      state: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_1'),
      county: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_2'),
      formattedAddress: details.formatted_address
    };
    // update location state accordingly
    this.setState({ location });
  }
  // Back button
  goBack(){
    this.props.navigator.pop();
  }
  // render Component
  render(){
    return (
      <View style={[styles.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'User Settings', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.mt1]}>
          <Text style={styles.h4}>* Where are you looking for assemblies?</Text>
          <View ref='location' style={{flex: 1,}}>
            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Your city'
              minLength={2}
              autoFocus={false}
              fetchDetails={true}
              onPress={this.selectLocation}
              getDefaultValue={() => {return this.state.location.city.long_name;}}
              query={GooglePlacesCityConfig}
              currentLocation={false}
              currentLocationLabel='Current location'
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{rankby: 'distance',}}
              filterReverseGeocodingByTypes={['street_adress']}
              predefinedPlaces={[]}
            >
            </GooglePlacesAutocomplete>
          </View>
          <Text style={styles.h4}>* Email</Text>
          <View style={styles.formField}>
            <TextInput
              ref={(el) => this.email = el}
              returnKeyType='next'
              onChangeText={(email) => this.setState({ email })}
              keyboardType='email-address'
              autoCapitalize='none'
              maxLength={144}
              value={this.state.email}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder='Your email address'
            />
          </View>
          <Text style={styles.h4}>* First name</Text>
          <View style={styles.formField}>
            <TextInput
              ref={(el) => this.firtName = el}
              returnKeyType='next'
              maxLength={20}
              value={this.state.lastName}
              onChangeText={(firstName) => this.setState({ firstName })}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder='Your first name'
            />
          </View>
          <Text style={styles.h4}>* Last name</Text>
          <View style={styles.formField}>
            <TextInput
              returnKeyType='next'
              maxLength={20}
              ref={(el) => this.lastName = el}
              onChangeText={(lastName) => this.setState({ lastName })}
              placeholderTextColor='#bbb'
              value={this.state.lastName}
              style={styles.input}
              placeholder='Your last name'
            />
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={[styles.submitButton, styles.buttonMargin]}
          onPress={this.saveSettings}
        >
          <Text style={globals.largeButtonText}>
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default UserSettings;
