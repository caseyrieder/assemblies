// basic elements
import React, { Component } from 'react'
import { View, Text, ListView, TouchableOpacity } from 'react-native'
import NavigationBar from 'react-native-navbar'
import Icon from 'react-native-vector-icons/Ionicons'
// my components
import Loading from '../shared/Loading'
// helpers
import moment from 'moment'
import { uniq, flatten, find, contains } from 'underscore'
import { rowHasChanged, sectionHeaderHasChanged, getSectionData, getRowData } from '../../utils'
// styles
import Colors from '../../styles/colors'
import { globals, calendarStyles } from '../../styles'
const styles = calendarStyles;

// define stateless EmptyList
const EmptyList = ({ ready }) => {
  // handle not readiness, then show the empty list text
  if (!ready) { return <Loading/> }
  return (
    <View style={[globals.textContainer, globals.ph1]}>
      <Text style={styles.h2}>
        No events scheduled. Explore groups in the groups tab or create your own to start an event.
      </Text>
    </View>
  );
};
// define the list of events
class EventList extends Component {
  // initialize
  constructor(){
    super();
    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.visitEvent = this.visitEvent.bind(this);
    this.state = {
      dataSource: this._loadData(props.events)
    };
  }
  // fetch events data to populate event list
  _loadData(events){
    let dataBlob = {};
    // get all unique dates
    let dates = uniq(events.map(evt => new Date(evt.start).toLocaleDateString()));
    // sections == each date & the events that start on that date
    let sections = dates.map((date, id) => ({
      date: new Date(date),
      events: events.filter(event => new Date(event.start).toLocaleDateString() === date),
      id: id,
    }));
    // create IDs for sections, then the rows within them
    let sectionIDs = sections.map((section, id) => id);
    let rowIDs = sectionIDs.map(sectionID => sections[sectionID].events.map((e, id) => id));
    // create dataBlob for each section & its events/rows
    sections.forEach(section => {
      dataBlob[section.id] = section.date;
      section.events.forEach((event, rowID) => {
        dataBlob[`${section.id}:${rowID}`] = event;
      });
    });
    // return new ListView with the just-defined IDs & data
    return new ListView.DataSource({
      getSectionData: getSectionData,
      getRowData: getRowData,
      rowHasChanged: rowHasChanged,
      sectionHeaderHasChanged: sectionHeaderHasChanged
    })
    .cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
  }
  // route to Event
  visitEvent(event){
    this.props.navigator.push({
      name: 'Event',
      event
    })
  }
  // view for each row
  renderRow(event, sectionID, rowID){
    // define boolean to determine if currentUser will attend
    let isGoing = contains(event.going, this.props.currentUser.id);
    // display clickable listItem: EvtName, # going, btn for me, start time
    return (
      <TouchableOpacity
        style={styles.row}
        onPres={() => this.visitEvent(event)}
      >
        <View style={globals.flex}>
          <View style={styles.flexContainer}>
            <Text style={styles.h4}>
              {event.name}
            </Text>
            <Text style={styles.h5}>
              {event.going.length} going
            </Text>
            {isGoing && <Text style={[globals.primaryText, styles.h5]}><Icon name='ios-checkmark' color={Colors.brandSuccess}/> Yes</Text>}
          </View>
        </View>
        <View style={styles.flexContainer}>
          <Text style={[styles.dateText, globals.mh1]}>
            {moment(event.start).format('h:mm a')}
          </Text>
          <Icon
            style={styles.arrow}
            name='ios-arrow-forward'
            size={25}
            color={Colors.bodyTextLight}
          />
        </View>
      </TouchableOpacity>
    )
  }
  // display section header as formatted date
  renderSectionHeader(sectionData, sectionID){
    return (
      <View style={styles.setionHeader}>
        <View style={styles.sectionHeaderText}>
          {moment(sectionData).format('dddd MMM Do')}
        </View>
      </View>
    )
  }
  // display EventList compoent
  render(){
    return (
      <ListView
        enableEmptySectionHeaders={true}
        style={globals.flex}
        contentInset={{bottom: 49}}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
      />
    )
  }
}

class Calendar extends Component {
  render(){
    // set props
    let { events, ready } = this.props;
    return (
      <View style={globals.flexContainer}>
        <NavigationBar
          tintColor={Colors.brandPrimary}
          title={{ title: 'Calendar', tintColor: 'white' }}
        />
        {events && events.length ? <EventList {...this.props}/> : <EmptyList ready={ready}/>}
      </View>
    )
  }
};

export default Calendar;
