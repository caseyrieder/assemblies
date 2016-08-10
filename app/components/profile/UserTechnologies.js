// elements
import React, { Component } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import Dropdown, { Select, Option, OptionList } from 'react-native-selectme'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import BackButton from '../shared/BackButton'
import TechnologyList from '../shared/TechnologyList'
// helpers
import { uniq } from 'underscore'
import { Technologies, Headers } from '../../fixtures'
import { API, DEV } from '../../config'
// styles
import Colors from '../../styles/colors'
import { globals, formStyles, selectStyles, optionTextStyles, overlayStyles } from '../../styles'
const styles = formStyles;
const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

// create Component
class UserTechnologies extends Component {
  // initialize
  constructor(){
    super();
    this.selectTechnology = this.selectTechnology.bind(this);
    this.removeTechnology = this.removeTechnology.bind(this);
    this.goBack = this.goBack.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.state = {
      technologies: props.currentUser.technologies,
      errorMsg: '',
    }
  }
  // pick the technology & add it to technologies in state
  selectTechnology(technology){
    this.setState({
      technologies: uniq(this.state.technologies.concat(technology))
    });
  }
  // remove technoogy from state
  removeTechnology(index){
    let { technologies } = this.state;
    this.setState({
      technologies: [
        ...technologies.slice(0, index),
        ...technologies.slice(index + 1)
      ]
    })
  }
  // back button
  goBack(){
    this.props.navigator.pop();
  }
  // save state.technologies to DB & re-route via updateUser prop
  saveSettings(){
    fetch(`${API}/users/${this.props.currentUser.id}`, {
      method: 'PUT',
      headers: Headers,
      body: JSON.stringify({ technologies: this.state.technologies })
    })
    .then(response => response.json())
    .then(user => {
      this.props.updateUser(user);
      this.goBack();
    })
    .catch(err => {})
    .done();
  }
  // show it
  render(){
    let { technologies } = this.state;
    return (
      <View style={[globals.flexContainer, globals.inactive]}>
        <NavigationBar
          title={{ title: 'User Technologies', tintColor: 'white' }}
          tintColor={Colors.brandPrimary}
          leftButton={<BackButton handlePress={this.goBack}/>}
        />
        <KeyboardAwareScrollView
          style={[styles.formContainer, globals.mt1]}
          contentInset={{bottom: 49}}
        >
          <View style={globals.flex}>
            <Text style={styles.h4}>
              Select technologies
            </Text>
            <Select
              width={deviceWidth}
              height={55}
              styleText={optionTextStyles}
              style={selectStyles}
              optionListRef={() => this.options}
              defaultValue='Add a technology'
              onSelect={this.selectTechnology}
            >
              {Technologies.map((tech, idx) => (
                <Option styleText={optionTextStyles} key={idx}>
                  {tech}
                </Option>
              ))}
            </Select>
            <OptionList
              ref={(el) => this.options = el}
              overlayStyles={overlayStyles}
            />
          </View>
          <TechnologyList
            technologies={technologies}
            handlePress={this.removeTechnology}
          />
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={[styles.submitButton, styles.buttonMargin]}
          onPress={this.saveSettings}
        >
          <Text style={globals.largeButtonText}>
            SAVE
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default UserTechnologies;
