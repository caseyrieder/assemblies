import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import InvertibleScrollView from 'react-native-invertible-scroll-view' // adjustable scrolling, keeps the thread at the bottom of the screen
import KeyboardSpacer from 'react-native-keyboard-spacer' // need
import NavigationBar from 'react-native-navbar'
import BackButton from '../shared/BackButton'
import moment from 'moment' // date formatting
import { Headers } from '../../fixtures' // for fetching
import { isEqual } from 'underscore' // always good
import { DEV, API } from '../../config' // local devServer
import Colors from '../../styles/colors'
import { globals, messagesStyles } from '../../styles'
const styles = messagesStyles;

// stateless Message component: avatar - name/date - text
const Message = ({ sender, message }) => {
  return (
    <View style={[globals.centeredRow, globals.pt1]}>
      <View>
        <Image
          style={globals.avatar}
          source={{uri: sender.avatar ? sender.avatar : DefaultAvatar }}
        />
      </View>
      <View style={[styles.flexCentered, globals.pv1]}>
        <View style={globals.flexRow}>
          <Text style={styles.h5}>
            {`${sender.firstName} ${sender.lastName}`}
          </Text>
          <Text style={styles.h6}>
            {moment(new Date(message.createdAt)).fromNow()}
          </Text>
        </View>
        <View style={globals.flexContainer}>
          <Text style={styles.messageText}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  )
};

class Conversation extends Component {
  // initialize bindings & state
  constructor(){
    super();
    this.goBack = this.goBack.bind(this);
    this.createMessage = this.createMessage.bind(this);
    this.state = {
      messages: [],
      message: '',
    }
  }
  // load messages before component mounts
  componentWillMount(){
    this._loadMessages();
  }
  // load messages: log IDs, fetch last 10 messages btwn currentUser & user [other] in reverse chronological order & put those messages in {state.messages}...logging error if necessary
  _loadMessages(){
    let { user, currentUser } = this.props;
    console.log('USER IDS', user.id, currentUser.id);
    let query = {
      $or: [
        { senderId: user.id, recipientId: currentUser.id },
        { recipientId: user.id, senderId: currentUser.id }
      ],
      $sort: { createdAt: -1 },
      $limit: 10
    };
    fetch(`${API}/messages?${JSON.stringify(query)}`)
    .then(response => response.json())
    .then(messages => this.setState({ messages }))
    .catch(err => console.log('ERR:', err))
    .done();
  }
  // POST message to API, re-set {state.message} & add data response to {state.messages}
  createMessage(){
    let { currentUser, user } = this.props;
    fetch(`${API}/messages`, {
      method: 'POST',
      headers: Headers,
      body: JSON.stringify({
        senderId: currentUser.id,
        recipientId: user.id,
        text: this.state.message,
        createdAt: new Date().valueOf(),
      })
    })
    .then(response => response.json())
    .then(data => this.setState({
      message: '',
      messages: [
        data,
        ...this.state.messages
      ]
    }))
    .catch(err => {})
    .done();
  }
  // enable back button
  goBack(){
    this.props.navigator.pop();
  }
  // set user [other] & currentUser as props, config title
  render(){
    let { user, currentUser } = this.props;
    let titleConfig = {
      title: `${user.firstName} ${user.lastName}`,
      tintColor: 'white'
    };
    // Inverted message Scroll, navbar, new message input
    return (
      <View style={globals.flexContainer}>
        {/* map & display messages w/user as sender */}
        <InvertibleScrollView inverted={true}>
          {this.state.messages.map((msg, idx) => {
            let sender = isEqual(msg.senderId, currentUser.id) ? currentUser : user;
            return (
              <Message
                key={idx}
                message={msg}
                sender={sender}
              />
            );
          })}
        </InvertibleScrollView>
        {/* navbar */}
        <View style={styles.navContainer}>
          <NavigationBar
            tintColor={Colors.brandPrimary}
            title={titleConfig}
            leftButton={<BackButton handlePress={this.goBack}/>}
          />
        </View>
        {/* update {state.message} as user types */}
        <View style={styles.inputBox}>
          <TextInput
            multiline={true}
            value={this.state.message}
            placeholder='Say something...'
            placeholderTextColor={Colors.bodyTextLight}
            onChangeText={(message) => this.setState({ message })}
            style={styles.input}
          />
          {/* styling based on usr input, createMessage */}
          <TouchableOpacity
            style={this.state.message ? styles.buttonActive : styles.buttonInactive}
            underlayColor='#D97573'
            onPress={this.createMessage}>
            <Text style={this.state.message ? styles.submitButtonText : styles.inactiveButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer topSpacing={-50} />
      </View>
    )
  }
};

export default Conversation;
