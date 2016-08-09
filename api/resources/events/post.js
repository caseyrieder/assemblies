console.log('EVENT CREATED', this);
var evt = this;
var groupId = evt.groupId;

dpd.groups.get({ id: groupId })
.then(function(group){
    console.log('NEW EVENT FOR GROUP', group.name);
    dpd.notifications.post({
        type: 'Event',
        message: 'Your group ' + group.name + ' has a new event',
        createdAt: new Date().valueOf(),
        participants: members.map(function(m){
            return {
                seen: false,
                userId: m.userId
            }
        }),
        data: {
            group: group,
            event: evt
        }
    })
});