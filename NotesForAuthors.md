* Great tutorial---the best walkthrough I've seen. Fantastic!
* How soon will the production appendices (GooglePlay/AppStore) come out?
* What about the Redux section?
* Is there any way that I can help a little? I'm new to this and would like the real-world experience
* What Atom theme are you using?

EDITS
* Accounts Pt. 2 Chapter
-in '...index.ios.js'
  -...
    `<Navigator...
      ...
      ...
      case 'Dashboard':
        return (
          <Dashboard
            navigator={navigator}
            logout={this.logout}
          />
      );`
    ...
  *** should not remove updateUser={this.updateUser} or user={this.state.user}-->
      `...
          <Dashboard
            updateUser={this.updateUser}
            user={this.state.user}
            navigator={navigator}
            logout={this.logout}
          />
      ...`

* Messaging Chapter
-in '...Conversations.js' (1st version of it in the chapter)
  -...`_renderRow(...
    let { currentUser }...
    let userIDs = [ conversation.user1Id, conversations.user2Id ];
    ...
  }`
  *** `conversations.user2Id` --> `conversation.user2Id` (remove 's')

***Conversation autoupdating script in dpd shell doesn't work. The new message does not propagate***

* Groups Chapter
-when seeding 1st group...there is no location field, but you provide location information
***The suggested groups section doesn't populate with anything***
