
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { BackgroundImage, Logo } from '../fixtures'
import Colors from '../styles/colors'
import { globals, landingStyles } from '../styles'

const styles = landingStyles

class Landing extends Component {
  /* change to new event handlers */
  constructor(){
    super();
    this.visitLogin = this.visitLogin.bind(this);
    this.visitRegister = this.visitRegister.bind(this);
  }

  /* set up 2 event handlers */
  visitLogin(){
    this.props.navigator.push({ name: 'Login' });
  }
  visitRegister(){
    this.props.navigator.push({ name: 'Register' });
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Image
            style={styles.backgroundImage}
            source={{ uri: BackgroundImage }}
          />
        </View>
        <View style={globals.flexCenter}>
          <Image
            style={styles.logo}
            source={{ uri: Logo }}
          />
          <Text style={[globals.lightText, globals.h2, globals.mb2]}>
            assemblies
          </Text>
          <Text style={[globals.lightText, globals.h4]}>
            Where Developers Connect
          </Text>
        </View>
        {/* add 2 buttons, rows that span the width at screen bottom */}
        <TouchableOpacity
          style={[globals.button, globals.inactive, styles.loginButton]}
          onPress={this.visitLogin}
        >
          <Icon name='lock' size={36} color={Colors.brandPrimary} />
          <Text style={[globals.buttonText, globals.primaryText]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={globals.button}
          onPress={this.visitRegister}
        >
          <Icon name='person' size={36} color='white' />
          <Text style={globals.buttonText}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
};

export default Landing;
