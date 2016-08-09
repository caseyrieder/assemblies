import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { globals, formStyles } from '../../styles'
const styles = formStyles;

const TechnologyList = ({ technologies, handlePress }) => {
  return (
    <View style={styles.textContainer}>
      {technologies.map((technology, i) => {
        return (
          <TouchableOpacity
            key={i}
            onPress={() => handlePress(i)}
            style={styles.technology}
          >
            <Text style={[styles.h6, globals.primaryText]}>
              {technology}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
};

export default TechnologyList
