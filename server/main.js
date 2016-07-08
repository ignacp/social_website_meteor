import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
		var websitesRemove = false, commentRemove = false;
		//websitesRemove = commentRemove = true;

    if(websitesRemove) {
      Websites.remove({});
    }
		if(commentRemove) {
      Comments.remove({});
    }    
});
