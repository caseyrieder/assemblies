/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Navigator } from 'react-native'
import Landing from './app/components/Landing'
import Dashboard from './app/components/Dashboard'
import Register from './app/components/accounts/Register'
import RegisterConfirm from './app/components/accounts/RegisterConfirm'
import Login from './app/components/accounts/Login'
import { globals } from './app/styles'

class Assemblies extends Component {
  // add logout method
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      user: null
    }
  }
  // logout method--redirect to Landing & remove user
  logout() {
    this.nav.push({ name: 'Landing' });
    this.updateUser(null);
  }

  updateUser(user) {
    this.setState({ user: user});
  }

  render() {
    /* add ref...el for use in logout method */
    return (
      <Navigator
        style={globals.flex}
        ref={(el) => this.nav = el }
        initialRoute={{ name: 'Landing' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Landing':
              return (
                <Landing navigator={navigator} />
            );
            {/* add logout */}
            case 'Dashboard':
              return (
                <Dashboard
                  updateUser={this.updateUser}
                  navigator={navigator}
                  user={this.state.user}
                  logout={this.logout}
                />
            );
            case 'Register':
              return (
                <Register navigator={navigator} />
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
