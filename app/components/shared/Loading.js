import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { globals } from '../../styles'

// create Loading element (stateless)
const Loading = () => (
  <View style={globals.flexCenter}>
    <ActivityIndicator size='large'/>
  </View>
);

export default Loading
