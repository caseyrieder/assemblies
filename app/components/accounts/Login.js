import React, { Component } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native' // add Scrollview, textinput & TouchableOpacity for form
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Ionicons'
import BackButton from '../shared/BackButton'
import { API, DEV } from '../../config' // dev data & server info
import { Headers } from '../../fixtures' // for api call header
import { extend } from 'underscore' // to add attrib/prop to an object
import Colors from '../../styles/colors'
import { globals, formStyles } from '../../styles' // add formStyles

const styles = formStyles // create formStyles constant

// create Login screen that, for now, just lets us go back
class Login extends Component {
  // add all the handlers & initialize state
  constructor() {
    super();
    this.loginUser = this.loginUser.bind(this);
    this.goBack = this.goBack.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.state = {
      email: '',
      password: '',
      errorMsg: '',
    }
  }
  // define the fetch API call to login by POSTing login form to endpoint (.../users/login)---gives us response with status (response.status) & id (response.id) property... handling error (401), fetch/get user info with session id cookie (sid) (.../users/me)
  loginUser() {
    if (DEV) {
      console.log('Logging in...');
      console.log('Email: ', this.state.email);
      console.log('Password: ', this.state.password);
    }
    fetch(`${API}/users/login`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({
        username: this.state.email,
        password: this.state.password
      })
    })
    .then(response => response.json())
    .then(data => this.loginStatus(data))
    .catch(err => this.connectionError())
    .done();
  }
  /*DEFINE HELPER FXNS FOR loginUser METHOD...*/
  // check the loggedin status of the call
  loginStatus(response) {
    if (response.status === 401) {
      this.setState({ errorMsg: 'Incorrect login info' });
    } else {
      this.fetchUserInfo(response.id)
    }
  }
  // fetch user data if login info is correct
  fetchUserInfo(sid) {
    fetch(`${API}/users/me`, {
      headers: extend(Headers, {'Set-Cookie': `sid=${sid}`})
    })
    .then(response => response.json())
    .then(user => this.updateUserInfo(user))
    .catch(err => this.connectionError())
    .done();
  }
  // log the connected user & redirect to Dashboard
  updateUserInfo(user) {
    if (DEV) { console.log('Logged in user', user); }
    this.props.updateUser(user);
    this.props.navigator.push({ name: 'Dashboard' })
  }
  // register & display connection error
  connectionError(){
    this.setState({ errorMsg: 'Connection error.'})
  }

  // define 3 onPress handlers
  goBack() {
    this.props.navigator.pop();
  }
  changeEmail(email) {
    this.setState({ email })
  }
  changePassword(password) {
    this.setState({ password })
  }

  render() {
    let titleConfig = { title: 'Login', tintColor: 'white' };
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          leftButton={<BackButton handlePress={this.goBack}/>}
          title={titleConfig}
          tintColor={Colors.brandPrimary}
        />
        {/* change to scrollview & create form w/fields */}
        <ScrollView style={styles.container}>
          <Text style={styles.h3}>
            Login with your email and password
          </Text>
          <Text style={styles.h4}>Email</Text>
          <View style={styles.formField}>
{/* returnKeyType defines what the 'return' key in the keyboard says/does */}
            <TextInput
              autoFocus={true}
              returnKeyType='next'
              onSubmitEditing={() => this.password.focus()}
              onChangeText={this.changeEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              maxLength={140}
              placeholderTextColor={Colors.copyMedium}
              style={styles.input}
              placeholder='Your email address'
            />
          </View>
          <Text style={styles.h4}>Password</Text>
          <View style={styles.formField}>
{/* ref, for onSubmitEditing...this.password.focus() from email field */}
            <TextInput
              ref={(el) => this.password = el}
              returnKeyType='next'
              onChangeText={this.changePassword}
              secureTextEntry={true}
              autoCapitalize='none'
              maxLength={140}
              placeholderTextColor={Colors.copyMedium}
              style={styles.input}
              placeholder='Your password'
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
          onPress={this.loginUser}
        >
          <Text style={globals.largeButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default Login;
