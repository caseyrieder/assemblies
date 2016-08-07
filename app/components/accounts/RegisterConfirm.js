import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, AsyncStorage } from 'react-native' // add AsyncStorage for persistence
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-picker' // add imagepicker
import NavigationBar from 'react-native-navbar'
import Dropdown, { Select, Option, OptionList } from 'react-native-selectme' // selector & dropdown
import BackButton from '../shared/BackButton'
import { uniq, extend } from 'underscore' // always good
import { Headers } from '../../fixtures' // for API calls
import { DEV, API } from '../../config' // for the dev server
import { Technologies, ImageOptions, DefaultAvatar } from '../../fixtures' // for mocking data
import Colors from '../../styles/colors'
import { globals, formStyles, selectStyles, optionTextStyles, overlayStyles } from '../../styles'
import TechnologyList from '../shared/TechnologyList' //TechList component
import { registerError } from '../../utils' // error handling merthod
// formStyles into variable
const styles = formStyles
// define device dimensions
const {
  width: deviceWidth,
  height: deviceHeight
} = Dimensions.get('window');

class RegisterConfirm extends Component {
  // add a bunch of binders, initialize state
  constructor() {
    super();
    this.goBack = this.goBack.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.selectTechnology = this.selectTechnology.bind(this);
    this.showImagePicker = this.showImagePicker.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      avatar: DefaultAvatar,
      errorMsg: '',
      technologies: [],
    }
  }

  // submit form with completed info
  submitForm() {
    let errorMsg = registerError(this.props);
    if (errorMsg !== '') { /* return error if needed */
      this.setState({ errorMsg: errorMsg });
      return;
    }
    let user = {
      avatar: this.state.avatar,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      location: this.props.location,
      password: this.props.password,
      technologies: this.state.technologies,
      username: this.props.email,
    };
    fetch(`${API}/users`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(user => this.loginUser(this.props.email, this.props.password))
    .catch(err => {})
    .done();
  }
  // handle login if account creation accepted
  loginUser(email, password) {
    fetch(`${API}/users/login`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({ username: email, password: password})
    })
    .then(response => response.json())
    .then(data => this.getUserInfo(data.id))
    .catch(err => {})
    .done();
  }
  // handle user info parsing once the user logs in
  getUserInfo(sid) {
    // AsyncStorage for user login persistence
    AsyncStorage.setItem('sid', sid);
    fetch(`${API}/users/me`, {
      headers: extend(Headers, { 'Set-Cookie': `sid=${sid}`})
    })
    .then(response => response.json())
    .then(user => {
      this.props.updateUser(user);
      this.props.navigator.push({
        name: 'Dashboard'
      });
    })
    .catch((err) => {})
    .done();
  }
  // select image from camera roll for avatar
  showImagePicker() {
    ImagePicker.showImagePicker(ImageOptions, (response) => {
      if (response.didCancel || response.error) { return; }
      const avatar = 'data:image/png;base64,' + response.data;
      this.setState({ avatar });
    });
  }

  // choose technology from the dropdown
  selectTechnology(technology) {
    this.setState({
      technologies: uniq([
        ...this.state.technologies, technology
      ])
    });
  }
  // remove pressed technology
  removeTechnology(index) {
    let { technologies } = this.state;
    this.setState({
      technologies: [
        ...technologies.slice(0, index),
        ...technologies.slice(index + 1)
      ]
    })
  }

  goBack() {
    this.props.navigator.pop();
  }

  render() {
    let titleConfig = { title: 'Create Account', tintColor: 'white' };
    return (
      <View style={[globals.flex, globals.inactive]}>
        <NavigationBar
          leftButton={<BackButton handlePress={this.goBack}/>}
          tintColor={Colors.brandPrimary}
          title={titleConfig}
        />
        {/* Scrollview is dropdown of techs */}
        <ScrollView style={styles.container}>
          <View style={globals.flex}>
            <Text style={styles.h4}>
              Select Technologies
            </Text>
            <Select
              defaultValue='Add a technology'
              height={55}
              onSelect={this.selectTechnology}
              optionListRef={() => this.options}
              style={selectStyles}
              styleText={optionTextStyles}
              width={deviceWidth}
            >
              {Technologies.map((technology, i) => (
                <Option
                  styleText={optionTextStyles}
                  key={i}
                >
                  {technology}
                </Option>
              ))}
            </Select>
            <OptionList
              overlayStyles={overlayStyles}
              ref={(el) => this.options = el}
            />
          </View>
          <View>
            <TechnologyList
              technologies={this.state.technologies}
              handlePress={this.removeTechnology}
            />
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={this.showImagePicker}
          >
            <Icon name='camera' size={30} color={Colors.brandPrimary}/>
            <Text style={[styles.h4, globals.primaryText]}>
              Add a Profile Photo
            </Text>
          </TouchableOpacity>
          <View style={styles.avatarImageContainer}>
            <Image
              source={{uri: this.state.avatar}}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {this.state.errorMsg}
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.submitForm}
        >
          <Text style={globals.largeButtonText}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default RegisterConfirm
