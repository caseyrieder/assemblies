/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Navigator, AsyncStorage } from 'react-native' // AsyncStorage to persistent storage
import Landing from './app/components/Landing'
import Register from './app/components/accounts/Register'
import RegisterConfirm from './app/components/accounts/RegisterConfirm'
import Login from './app/components/accounts/Login'
import Dashboard from './app/components/Dashboard'
import Loading from './app/components/shared/Loading' // ActivityIndicator for awaiting persistent storage response
import { Headers } from './app/fixtures' // for fetch Headers
import { extend } from 'underscore' // for fetching
import { API, DEV } from './app/config' // for api calls
import { globals } from './app/styles'

class Assemblies extends Component {
  // add logout method
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.updateUser = this.updateUser.bind(this);
    // add ready & initialRoute to state
    this.state = {
      user: null,
      ready: false,
      initialRoute: 'Landing',
    }
  }
  // assess credentials on mount
  componentDidMount() {
    this._loadingLoginCredentials()
  }
  // how to assess crednetials via local async storage
  async _loadingLoginCredentials() {
    try {
      let sid = await AsyncStorage.getItem('sid');
      console.log('SID', sid);
      if (sid) {
        this.fetchUser(sid);
      } else {
        this.ready();
      }
    } catch (err) {
      this.ready(err);
    }
  }
  // make state ready
  ready(err) {
    this.setState({ ready: true });
  }
  // get User info
  fetchUser(sid) {
    fetch(`${API}/users/me`, {
      headers: extend(Headers, { 'Set-Cookie': `sid=${sid}`})
    })
    .then(response => response.json())
    .then(user => this.setState({
      ready: true,
      initialRoute: 'Dashboard',
      user
    }))
    .catch(err => this.ready(err))
    .done();
  }
  // logout method--redirect to Landing & remove user
  logout() {
    this.nav.push({ name: 'Landing' });
    this.updateUser(null);
  }
  updateUser(user) {
    this.setState({ user });
  }

  render() {
    // show Loading indicator if waiting to see currentUser
    if (!this.state.ready) { return <Loading/> }
    /* add ref...el for use in logout method */
    return (
      <Navigator
        style={globals.flex}
        ref={(el) => this.nav = el }
        initialRoute={{ name: this.state.initialRoute }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Landing':
              return (
                <Landing navigator={navigator}/>
              );
            {/* add logout */}
            case 'Dashboard':
              return (
                <Dashboard
                  navigator={navigator}
                  user={this.state.user}
                  logout={this.logout}
                />
              );
            case 'Register':
              return (
                <Register navigator={navigator}/>
              );
            {/* add RegisterConfirmation route */}
            case 'RegisterConfirm':
              return (
                <RegisterConfirm
                  {...route}
                  updateUser={this.updateUser}
                  navigator={navigator}
                />
              );
            {/* add updateUser method state to Dashboard */}
            case 'Login':
              return (
                <Login
                  navigator={navigator}
                  updateUser={this.updateUser}
                />
              );
          }
        }}
      />
    )
  }
}

AppRegistry.registerComponent('Assemblies', () => Assemblies)
