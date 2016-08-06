// and Image, MaterialIcon, landingStyles for new image
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Colors from '../styles/colors'
import { globals, landingStyles } from '../styles'
// import backgroundimage & logo, create styles const
const BackgroundImage = 'https://s3-us-west-2.amazonaws.com/assembliesapp/welcome%402x.png';
const Logo = 'https://s3-us-west-2.amazonaws.com/assembliesapp/logo.png';
const styles = landingStyles

class Landing extends Component {
  constructor() {
    super()
    this.visitDashboard = this.visitDashboard.bind(this)
  }

  visitDashboard() {
    this.props.navigator.push({ name: 'Dashboard' })
  }

  render() {
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
        <TouchableOpacity
          style={globals.button}
          onPress={this.visitDashboard}
        >
          <Icon name='person' size={36} color='white' />
          <Text style={globals.buttonText}>
            Go to Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Landing
