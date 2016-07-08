import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// template helpers 

// helper function that returns all available websites
Template.website_list.helpers({
		websites: function () {
    return Websites.find({}, { sort: { vote: -1 } });
		}
});

// template events 

Template.website_item.events({
		"click .js-upvote": function (event) {
    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    console.log("Up voting website with id " + website_id);
    // put the code in here to add a vote to a website!
    var site = Websites.findOne({ _id: website_id });
    if (site) {
      var vote = site.vote;
      console.log("vote count:" + vote);
      vote += 1;

      Websites.update({ _id: website_id },
        { $set: { vote: vote } });

      console.log("vote count after of the increment :" + vote);
    }

    return false;// prevent the button from reloading the page
		},
		"click .js-downvote": function (event) {

    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id = this._id;
    console.log("Down voting website with id " + website_id);

    // put the code in here to remove a vote from a website!
    var site = Websites.findOne({ _id: website_id });
    if (site) {
      var vote = site.vote;
      console.log("vote count:" + vote);

      if (vote > 0) {
        vote -= 1;

        Websites.update({ _id: website_id },
          { $set: { vote: vote } });

        console.log("vote count after of the decrement :" + vote);
      }
    }

    return false;// prevent the button from reloading the page
		}
})

Template.website_form.events({
		"click .js-toggle-website-form": function (event) {
    $("#website_form").toggle('slow');
		},
		"submit .js-save-website-form": function (event) {

    // here is an example of how to get the url out of the form:
    var url = event.target.url.value;
    var title = event.target.title.value;
    var description = event.target.description.value;

    console.log("url: " + url + ",  title:" + title + " and description: " + description);

    //  put your website saving code in here!
    if ((url == "") && (title == "") && (description == "")) {
      alert("Should fill all fields (url, title and description).");
    }
    else {
      if (Meteor.user()) {
        Websites.insert({
          title: title,
          url: url,
          description: description,
          createdOn: new Date(),
          createBy: Meteor.user()._id,
          vote: 0
        });
      }
      else {
        alert("For adding a website should login.");
      }
    }

    return false;// stop the form submit from reloading the page

		}
});

//Accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Template.body.helpers({
  username: function () {
    if (Meteor.user()) {
      return Meteor.user().username;
    }
    else {
      return "";
    }
  }
});

//routing

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navegationbar', {
    to: "navegationbar"
  });
  this.render('start', {
    to: "main"
  });
});

Router.route('/website/:_id', function () {
  this.render('navegationbar', {
    to: "navegationbar"
  });
  this.render('website', {
    to: "main",
    data: function () {
      return Websites.findOne({ _id: this.params._id });
    }
  });
});


Template.add_comments.events({

		"submit .js-save-comment-form": function (event) {

    var comment = event.target.comment.value;
    var website_id = this.id;

    console.log("Comment: " + comment);

    if (comment == "") {
      alert("Should fill the comment field.");
    }
    else {
      if (Meteor.user()) {
        Comments.insert({
          websiteId: website_id,
          comment: comment,
          createdOn: new Date(),
          createBy: Meteor.user().username
        });
      }
      else {
        alert("For adding a comment should login.");
      }
    }

    return false;// stop the form submit from reloading the page

		}
})

Template.comments_list.helpers({
		comments: function () {
    var website_id = this.id;
    return Comments.find({ websiteId: website_id });
		}
});