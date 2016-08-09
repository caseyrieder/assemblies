// basic elements
import React, { Component, PropTypes } from 'react'
import { ScrollView, View, Text, TextInput, DatePickerIOS, Modal, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
import Picker from 'react-native-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons'
// helpers
import moment from 'moment'
import { Headers } from '../../fixtures'
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, formStyles } from '../../styles'
const styles = formStyles;

// set error message fxn
function setErrorMsg({ location, name }){
  if (!location) {
    return 'You must enter a location';
  } else if (!name) {
    return 'You must name the event';
  } else {
    return '';
  }
}
// actual component
class CreateEventConfirm extends Component {
  // initialize bindings & state
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.saveStart = this.saveStart.bind(this);
    this.saveEnd = this.saveEnd.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.toggleStartModal = this.toggleStartModal.bind(this);
    this.toggleEndModal = this.toggleEndModal.bind(this);
    this.state = {
      description: '',
      end: new Date(),
      errorMsg: '',
      finalEnd: new Date(),
      finalStart: new Date(),
      showEndModal: false,
      showStartModal: false,
      start: new Date(),
    };
  }
  // submit form
  submitForm(){
    // Set & log errorMsg, handle error
    let errorMsg = setErrorMsg({...this.props, ...this.state});
    console.log('SUBMIT', errorMsg);
    if (errorMsg !== ''){
      this.setState({ errorMsg});
      return;
    }
    // create event object
    let event = {
      createdAt: new Date().valueOf(),
      start: this.state.finalStart.valueOf(),
      end: this.state.finalEnd.valueOf(),
      name: this.props.eventName,
      location: this.props.location || {},
      groupId: this.props.group.id,
      going: [ this.props.currentUser.id ],
      capacity: this.props.capacity,
      description: this.state.description,
    };
    // send event up to DB
    fetch(`${API}/events`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify(event)
    })
    // handle response & reoute to Group
    .then(response => response.json())
    .then(data => this.props.navigator.push({
      name: 'Group',
      group: this.props.group
    }))
    // handle error
    .catch(err => {
      console.log('ERR', err);
      this.setState({ errorMsg: err.reason })
    })
    .done();
  }
  // back button
  goBack(){
    this.props.navigator.pop();
  }
  // open/close start time modal
  toggleStartModal(){
    this.setState({ showStartModal: !this.state.showStartModal })
  }
  // open/close end time modal
  toggleEndModal(){
    this.setState({ showEndModal: !this.state.showEndModal })
  }
  // save start time & close start modal
  saveStart(){
    this.setState({
      showStartModal: false,
      finalStart: this.state.start,
      end: this.state.start,
      finalEnd: this.state.start
    })
  }
  // save end time & close end modal
  saveEnd(){
    this.setState({
      showEndModal: false,
      finalEnd: this.state.end
    })
  }
  // display
  render(){
    // bring final start & end into state
    let { finalStart, finalEnd } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'Confirm Event', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView
          style={[styles.formContainer, globals.pv1]}
          contentInset={{bottom: 49}}
        >
          {/* Start time button */}
          <Text style={styles.h4}>
            * When does the event start?
          </Text>
          <View style={styles.formField}>
            <TouchableOpacity
              style={styles.flexRow}
              onPress={this.toggleStartModal}
            >
              <Text style={styles.input}>
                {finalStart ? moment(finalStart).format('ddd MMM Do, h:mm a') : 'Choose a starting time'}
              </Text>
              <Icon
                name='ios-arrow-forward'
                color='#777'
                size={30}
                style={globals.mr1}
              />
            </TouchableOpacity>
          </View>
          {/* End time button */}
          <Text style={styles.h4}>
            * When does the event end?
          </Text>
          <View style={styles.formField}>
            <TouchableOpacity
              style={styles.flexRow}
              onPress={this.toggleEndModal}
            >
              <Text style={styles.input}>
                {finalEnd ? moment(finalEnd).format('ddd MMM Do, h:mm a') : 'Choose an ending time'}
              </Text>
              <Icon
                name='ios-arrow-forward'
                color='#777'
                size={30}
                style={globals.mr1}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.h4}>
            Leave a note for your attendees
          </Text>
          <TextInput
            ref={(el) => this.desecription = el}
            returnKeyType='next'
            blurOnSubmit={true}
            clearButtonMode='always'
            onChangeText={(description) => this.setState({ description })}
            placeholderTextColor='#bbb'
            style={styles.largeInput}
            multiline={true}
            placeholder='Type a summary of the event...'
          />
          {/* Display error message */}
          <View style={[styles.error, globals.ma1]}>
            <Text style={styles.errorText}>
              {this.state.errorMsg}
            </Text>
          </View>
        </KeyboardAwareScrollView>
        {/* save the form & submit it */}
        <TouchableOpacity
          onPress={this.submitForm}
          style={[styles.submitButton, styles.buttonMargin]}
        >
          <Text style={globals.largeButtonText}>
            Save
          </Text>
        </TouchableOpacity>
        {/* START TIME MODAL with DATEPICKER */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showStartModal}
          onRequestClose={this.saveStart}
        >
          <View style={styles.modal}>
            <View style={styles.datepicker}>
              <DatePickerIOS
                date={this.state.start}
                minimumDate={new Date()}
                minuteInterval={15}
                mode='datetime'
                onDateChange={(start) => this.setState({ start })}
              />
              <View style={styles.btnGroup}>
                {/* Cancel btn */}
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => this.setState({ showStartModal: false })}
                >
                  <Text style={styles.btnText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* Save btn */}
                <TouchableOpacity
                  style={[styles.pickerButton, globals.brandPrimary]}
                  onPress={this.saveStart}
                >
                  <Text style={[styles.btnText, { color: 'white' }]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* END TIME MODAL with DATEPICKER */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showEndModal}
          onRequestClose={this.saveEnd}
        >
          <View style={styles.modal}>
            <View style={styles.datepicker}>
              <DatePickerIOS
                date={this.state.end}
                minimumDate={new Date()}
                minuteInterval={15}
                mode='datetime'
                onDateChange={(end) => this.setState({ end })}
              />
              <View style={styles.btnGroup}>
                {/* Cancel btn */}
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => this.setState({ showEndModal: false })}
                >
                  <Text style={styles.btnText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                {/* Save btn */}
                <TouchableOpacity
                  style={[styles.pickerButton, globals.brandPrimary]}
                  onPress={this.saveEnd}
                >
                  <Text style={[styles.btnText, globals.buttonText]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

export default CreateEventConfirm;
