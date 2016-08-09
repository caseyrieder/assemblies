import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Config from 'react-native-config' // Google Places
import Icon from 'react-native-vector-icons/Ionicons'
import { find, extend, isEqual } from 'underscore' // always useful
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete' // for suggesting nearby places
import BackButton from '../shared/BackButton'
import Colors from '../../styles/colors'
import { globals, formStyles, autocompleteStyles } from '../../styles' // additinoal styles

// assign API key & formStyles to consts
const GooglePlacesKey = Config.GOOGLE_PLACES_API_KEY
const styles = formStyles
// create Register screen that, for now, just lets us go back
class Register extends Component {
  // initialize state, add method bindings
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectLocation = this.selectLocation.bind(this);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      location: null,
      password: '',
    }
  }

  goBack(){
    this.props.navigator.pop();
  }
  // new methods
  selectLocation(data, details){
    if (!details) { return }
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => (
        isEqual(c.types[0], 'locality')
      )),
      state: find(details.address_components, (c) => (
        isEqual(c.types[0], 'administrative_area_level_1')
      )),
      county: find(details.address_components, (c) => (
        isEqual(c.types[0], 'administrative_area_level_2')
      )),
      formattedAddress: details.formatted_address
    };
    this.setState({ location });
  }

  handleSubmit(){
    this.props.navigator.push({
      name: 'RegisterConfirm',
      ...this.state
    })
  }

  render(){
    let titleConfig = { title: 'Create Account', tintColor: 'white' };
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          title={titleConfig}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        {/* Create form elements for 1st part of form */}
        <ScrollView style={styles.container}>
          <Text style={styles.h4}>
            * Where are you looking for assemblies?
          </Text>
          <View style={globals.flex}>
            <GooglePlacesAutocomplete
              autoFocus={false}
              currentLocation={false}
              currentLocationLabel='Current location'
              fetchDetails={true}
              filterReverseGeocodingByTypes={['street_address']}
              getDefaultValue={() => {return '';}}
              GooglePlacesSearchQuery={{rankby: 'distance',}}
              GoogleReverseGeocodingQuery={{}}
              minLength={2}
              nearbyPlacesAPI='GooglePlacesSearch'
              onPress={this.selectLocation}
              placeholder='Your city'
              predefinedPlaces={[]}
              query={{
                key: GooglePlacesKey,
                language: 'en',
                types: '(cities)',
              }}
              styles={autocompleteStyles}
            >
            </GooglePlacesAutocomplete>
          </View>
          <Text style={styles.h4}>* Email</Text>
          <View style={styles.formField}>
            <TextInput
              autoCapitalize='none'
              keyboardType='email-address'
              maxLength={144}
              onChangeText={(email) => this.setState({ email })}
              onSubmitEditing={() => this.password.focus()}
              placeholder='Your email'
              placholderTextColor={Colors.copyMedium}
              returnKeyType='next'
              style={styles.input}
            />
          </View>
          <Text style={styles.h4}>* Password</Text>
          <View style={styles.formField}>
            <TextInput
              autoCapitalize='none'
              maxLength={20}
              onChangeText={(password) => this.setState({ password })}
              onSubmitEditing={() => this.firstName.focus()}
              placeholder='Your password'
              placeholderTextColor={Colors.copyMedium}
              ref={(el) => this.password = el}
              returnKeyType='next'
              secureTextEntry={true}
              style={styles.input}
            />
          </View>
          <Text style={styles.h4}>* First name</Text>
          <View style={styles.formField}>
            <TextInput
              maxLength={20}
              onChangeText={(firstName) => this.setState({ firstName })}
              onSubmitEditing={() => this.lastName.focus()}
              placeholder='Your first name'
              placeholderTextColor='#bbb'
              ref={(el) => this.firstName = el}
              returnKeyType='next'
              style={styles.input}
            />
          </View>
          <Text style={styles.h4}>* Last name</Text>
          <View style={styles.formField}>
            <TextInput
              maxLength={20}
              onChangeText={(lastName) => this.setState({ lastName })}
              placeholder='Your last name'
              placeholderTextColor='#bbb'
              ref={(el) => this.lastName = el}
              returnKeyType='next'
              style={styles.input}
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.handleSubmit}
        >
          <Text style={globals.largeButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default Register;
