import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import NavigationBar from 'react-native-navbar'
import Loading from '../shared/Loading'
import Colors from '../../styles/colors'
import { globals, groupsStyles } from '../../styles'
const styles = groupsStyles;

//create fxn for formatting groups based on odd/even number
export function formatGroups(groups) {
  if (groups.length % 2 === 1) {
    return groups.concat(null);
  } else {
    return groups;
  }
};

// Stateless Add Group component
const AddGroupBox = ({ handlePress }) => (
  <TouchableOpacity
    onPress={handlePress}
    style={styles.groupImage}>
    <View style={[styles.groupBackground, globals.inactive]}>
      <Icon name='add-circle' size={60} color={Colors.brandPrimary} />
    </View>
  </TouchableOpacity>
);

// Stateless Emptygroup component
export const EmptyGroupBox = () => (
  <View style={styles.groupsContainer}>
    <View style={styles.groupImage}>
      <View style={[styles.groupBackground, globals.inactive]} />
    </View>
  </View>
);

// Stateless EmtpyGroupBoxes, which show AddGroupBox & EmptyGroupBox
const EmptyGroupBoxes = ({ handlePress }) => (
  <View style={styles.boxContainer}>
    <AddGroupBox handlePress={handlePress}/>
    <EmptyGroupBox />
  </View>
);

// stateless empty suggested group boxes (2 emptybox components)
const EmptySuggestedGroupBoxes = () => (
  <View style={styles.boxContainer}>
    <EmptyGroupBox />
    <EmptyGroupBox />
  </View>
)

// stateless GroupBoxes renderer
export const GroupBoxes = ({ groups, visitGroup, visitCreateGroup }) => {
  // log list of groups
  console.log('MY GROUPS', groups);
  // handle empty group list
  if (!groups.length) {
    return <EmptyGroupBoxes handlePress={visitCreateGroup}/>
  }
  // otherwise, show groups box by mapping through them like so...
  return (
    <View style={styles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        // clickable image w/group name overlayed for each group
        return (
          <TouchableOpacity
            key={idx}
            style={globals.flexRow}
            onPress={() => visitGroup(group)}
          >
            <Image
              source={{uri: group.image}}
              style={styles.groupImage}
            >
              <View style={[styles.groupBackground, {backgroundColor: group.color,}]}>
                <Text style={styles.groupText}>
                  {group.name}
                </Text>
              </View>
            </Image>
          </TouchableOpacity>
        )
      })}
    </View>
  );
}

// stateless suggestedgroups box renderer
const SuggestedGroupBoxes = ({ groups, visitGroup }) => {
  // log list of groups
  console.log('SUGGESTED GROUPS', groups);
  // handle empty suggested list
  if (!groups.length) { return <EmptySuggestedGroupBoxes />}
  // otherwise, render list by mapping over suggested groups like so...
  return (
    <View style={styles.boxContainer}>
      {groups.map((group, idx) => {
        if (!group) { return <EmptyGroupBox key={idx}/>}
        // clickable image w/group name overlayed for each group
        return (
          <TouchableOpacity
            key={idx}
            style={globals.flexRow}
            onPress={() => visitGroup(group)}
          >
            <Image
              source={{uri: group.image}}
              style={styles.groupImage}
            >
              <View style={[styles.groupBackground, {backgroundColor: group.color,}]}>
                <Text style={styles.groupText}>
                  {group.name}
                </Text>
              </View>
            </Image>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// stateless AddButton to add group to my list of groups
const AddButton = ({ handlePress }) => (
  <TouchableOpacity style={globals.pa1} onPress={handlePress}>
    <Icon name='add-circle' size={25} color='#ccc' />
  </TouchableOpacity>
)

// finally, define the full component
class Groups extends Component {
  // initialize bindings
  constructor() {
    super();
    this.visitCreateGroup = this.visitCreateGroup.bind(this);
    this.visitGroup = this.visitGroup.bind(this);
  }
  // reroute for visitGroup press
  visitGroup(group) {
    this.props.navigator.push({
      name: 'Group',
      group
    })
  }
  // reroute for visitCreateGroup press
  visitCreateGroup() {
    this.props.navigator.push({ name: 'CreateGroup' })
  }
  // display component
  render(){
    // define props
    let { groups, suggestedGroups, ready, navigator } = this.props;
    // handle unready with activityindicator
    if (!ready) { return <Loading /> }
    // actual display
    return (
      <View style={globals.flexContainer}>
        {/* add group button within navbar */}
        <NavigationBar
          title={{title: 'My Groups', tintColor: 'white'}}
          tintColor={Colors.brandPrimary}
          rightButton={<AddButton handlePress={this.visitCreateGroup}/>}
        />
        {/* scroll through My groups & suggested groups */}
        <ScrollView style={[globals.flex, globals.mt1]}>
          <Text style={[globals.h4, globals.mh2]}>
            Your Assemblies
          </Text>
          <GroupBoxes
            groups={formatGroups(groups)}
            navigator={navigator}
            visitGroup={this.visitGroup}
            visitCreateGroup={this.visitCreateGroup}
          />
          <Text style={[globals.h4, globals.mh2]}>
            You Might Like
          </Text>
          <SuggestedGroupBoxes
            groups={formatGroups(suggestedGroups)}
            navigator={navigator}
            visitGroup={this.visitGroup}
          />
        </ScrollView>
      </View>
    )
  }
};

export default Groups;
