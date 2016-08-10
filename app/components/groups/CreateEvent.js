// elements
import React, { Component, PropTypes } from 'react'
import { View, Text, TextInput, Slider, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
import Icon from 'react-native-vector-icons/Ionicons'
// helpers
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { find } from 'underscore'
import Config from 'react-native-config'
// styles
import Colors from '../../styles/colors'
import { globals, formStyles, autocompleteStyles } from '../../styles'
const styles = formStyles;

class CreateEvent extends Component {
  // initialize bindings & state
  constructor(){
    super();
    this.saveLocation = this.saveLocation.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      capacity: 50,
      location: null,
      name: '',
      showPicker: false,
    };
  }
  // go to confirmation page
  submitForm(){
    this.props.navigator.push({
      name: 'CreateEventConfirm',
      group: this.props.group,
      location: this.state.location,
      capacity: this.state.capacity,
      eventName: this.state.name,
    })
  }
  // location identifier/saver (puts into state, moves to name)
  saveLocation(data, details=null){
    if (!details) { return; }
    let location = {
      ...details.geometry.location,
      city: find(details.address_components, (c) => c.types[0] === 'locality'),
      state: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_1'),
      county: find(details.address_components, (c) => c.types[0] === 'administrative_area_level_2'),
      formattedAddress: details.formatted_address
    };
    this.setState({ location });
    this.name.focus();
  }
  // backbutton
  goBack(){
    this.props.navigator.pop();
  }
  // display
  render(){
    // set capacity into state
    let { capacity } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Create Event', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView style={[styles.formContainer, globals.mt1]} contentInset={{bottom: 49}}>
          {/* Event location */}
          <Text style={globals.h4}>*Where is the event?</Text>
          <View style={globals.flex}>
            <GooglePlacesAutocomplete
              styles={autocompleteStyles}
              placeholder='Type a place or street address'
              minLength={2}
              autoFocus={true}
              fetchDetails={true}
              onPress={this.saveLocation}
              getDefaultValue={() => ''}
              query={{
                key: Config.GOOGLE_PLACES_API_KEY,
                language: 'en'
              }}
              currentLocation={false}
              currentLocationLabel='Current location'
              nearbyPlacesAPI='GooglePlacesSearch'
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{ rankby: 'distance' }}
              filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
              predefinedPlaces={[]}
            />
          </View>
          {/* Event Name */}
          <Text style={styles.h4}>
            * What's the event name?
          </Text>
          <View style={styles.formField}>
            <TextInput
              reurnKeyType='next'
              ref={(el) => this.name = el}
              onChangeText={(name) => this.setState({ name })}
              placeholderTextColor='#bbb'
              style={styles.input}
              placeholder='Name the event'
            />
          </View>
          {/* Event capacity slider */}
          <Text style={styles.h4}>
            Attendee capacity
          </Text>
          <View style={styles.formField}>
            <View style={styles.pickerButton}>
              <Text style={styles.input}>
                {capacity ? capacity : 'Choose a capacity'}
              </Text>
            </View>
          </View>
          <View style={globals.mv1}>
            <Slider
              style={styles.slider}
              defaultValue={capacity}
              value={capacity}
              step={5}
              minimumValue={10}
              maximumValue={200}
              onValueChange={(val) => this.setState({capacity: val})}
            />
          </View>
        </KeyboardAwareScrollView>
        {/* Next button */}
        <TouchableOpacity
          onPress={this.submitForm}
          style={[styles.submitButton, styles.buttonMargin]}
        >
          <Text style={globals.largeButtonText}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default CreateEvent;
