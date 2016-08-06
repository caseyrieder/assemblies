/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react'
import { AppRegistry, Navigator } from 'react-native'
import Landing from './app/components/Landing'
import Dashboard from './app/components/Dashboard'
import { globals } from './app/styles'

class Assemblies extends Component {
  render() {
    return (
      <Navigator
        style={globals.flex}
        initialRoute={{ name: 'Landing' }}
        renderScene={(route, navigator) => {
          switch(route.name){
            case 'Landing':
              return (
                <Landing navigator={navigator}/>
            );
            case 'Dashboard':
              return (
                <Dashboard navigator={navigator}/>
            );
          }
        }}
      />
    )
  }
}

AppRegistry.registerComponent('Assemblies', () => Assemblies)
