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
import Login from './app/components/accounts/Login'
import { globals } from './app/styles'

class Assemblies extends Component {
  // pass updateuser method into props & initialize no-user state
  constructor() {
    super();
    this.updateUser = this.updateUser.bind(this);
    this.state = {
      user: null
    };
  }
  // updateUser method will set user state
  updateUser(user) {
    this.setState({ user: user});
  }

  render() {
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Landing' }}
        renderScene={(route, navigator) => {
          switch(route.name) {
            case 'Landing':
              return (
                <Landing navigator={navigator} />
            );
            {/* add user state & updateUser method to Dashboard */}
            case 'Dashboard':
              return (
                <Dashboard
                  updateUser={this.updateUser}
                  navigator={navigator}
                  user={this.state.user}
                />
            );
            case 'Register':
              return (
                <Register navigator={navigator} />
            );
            {/* add RegisterConfirmation route */}
            case 'RegisterConfirmation':
              return (
                <RegisterConfirmation
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
