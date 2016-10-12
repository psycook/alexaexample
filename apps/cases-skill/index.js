module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('cases-skill');
var nforce = require('nforce');

// used for partial intents
var name;
var subject;
var priority;

// saleforce log in details
var SF_CLIENT_ID = '3MVG99OxTyEMCQ3gpLbNrfR_7CPi4qJaodVDpvY5AHDNm8OKbCJLuGselI19gdyRdf.MDaivybiAmZ5cu.7fe';
var SF_CLIENT_SECRET = '4024960190951116854';
var SF_USERNAME = 'simon.cook@innovate.ul';
var SF_PASSWORD = 'salesforce1';
var SF_CALLBACK_URL = 'http://localhost:3000/oauth/_callback';

var org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: SF_CALLBACK_URL,
    mode: 'single'
});

app.dictionary = {
    "subjects": ["printer", "lift", "door", "laptop", "phone"],
    "priorities": ["low", "medium", "high"],
    "names": ["Simon Cook", "Larence Ratcliffe", "Sanjay Pradhan", "John Smith"]
};

app.launch(function(request, response) {
    response.say('Welcome to sales force case manager.').reprompt('Welcome to sales force case manager.').shouldEndSession(false);
});

app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say('Sorry an error occured ' + error.message);
};

app.intent('caseCreate', {
        "slots": {
            "Subject": "LITERAL",
            "Priority": "LITERAL",
            "Name": "LITERAL"
        },
        "utterances": ["{new|open|start|} case for {subjects|Subject} with {priorities|Priority} priority for {names|Name}",
                       "{new|open|start|} case for {subjects|Subject} {priorities|Priority} priority for {names|Name}"]
    },
    function(request, response) {
        subject = request.slot('Subject');
        priority = request.slot('Priority');
        name = request.slot('Name');

        //create the object
        var newCase = nforce.createSObject('Case');
        newCase.set('Subject', subject);
        //newCase.set('CreatorName', name);
        newCase.set('Priority', priority);
        newCase.set('Origin', 'Echo');
        newCase.set('Type', 'Problem');
        newCase.set('Status', 'New');
        newCase.set('Description', 'Case opened for ' + name);

        org.authenticate({
            username: SF_USERNAME,
            password: SF_PASSWORD
        }).then(function() {
            return org.insert({
                sobject: newCase
            })
        }).then(function(result) {
            if (result.success) {
                console.log("UTTERANCE:caseCreate - Thank you " + name + ".  I have opened your " + priority + " priority case for the " + subject);
                response.say("Thank you " + name + ".  I have opened your " + priority + " priority case for the " + subject);
                response.card({
                  type: "Standard",
                  title: "Case Created",
                  text: "Thanks you " + name + ".  Your case for " + subject + " with a " + priority + " priority has been raised.",
                  image: {
                    smallImageUrl: "https://smc-alexa-case.herokuapp.com/salesforce-logo-small.png",
                    largeImageUrl: "https://smc-alexa-case.herokuapp.com/salesforce-logo.png"
                  }
                });
                response.send();
            } else {
                console.log("UTTERANCE:caseCreate - Tilt " + JSON.stringify(result));
                response.say("I am afraid I cannot do that " + name);
                response.send();
            }
        }).error(function(err) {
            console.log("UTTERANCE:caseCreate - Tilt " + JSON.stringify(err));
            response.say("I am afraid I cannot do that " + name);
            response.send();
        });
        return false;
    }
);

app.sessionEnded(function(request,response) {
    // Clean up the user's server-side stuff, if necessary
    console.log("SESSION ENDED");
    // No response necessary
});

/*
app.intent('caseOpen',
  {
    "slots":{},
    "utterances":[ "open new case", "new case", "start case" ]
  },
  function(request,response) {
    console.log("UTTERANCE:caseOpen");
    response.say("Ok, what is the subject for the case?");
  }
);

app.intent('caseSubject',
  {
    "slots":{"Subject":"LITERAL"},
    "utterances":[ "the subject is {subjects|Subject}", "subject is {subjects|Subject}", "subject {subjects|Subject}" ]
  },
  function(request,response) {
    subject = request.slot('Subject');
    console.log("UTTERANCE:caseSubject " + subject);
    response.say("Got it.  The subject is " + subject + ".  What is the priority?");
    }
);

app.intent('casePriority',
  {
    "slots":{"priority":"LITERAL"},
    "utterances":[ "the priority is {priorities|priority}", "priority is {priorities|priority}", "priority {priorities|priority}" ]
  },
  function(request,response) {
    priority = request.slot('priority');
    console.log("UTTERANCE:casepriority " + priority);
    response.say("Lovely.  The priority is " + priority + ".  What is your name?");
    }
);

app.intent('caseName',
  {
    "slots":{"Name":"LITERAL"},
    "utterances":[ "my name is {names|Name}", "I am {names|Name}", "I'm {names|Name}" ]
  },
  function(request,response) {
    name = request.slot('Name');
    console.log("UTTERANCE:caseName opened case for " + subject + " at priority " + priority + " for " + name);
    response.say("Thank you " + name + ".  I have opened your " + priority + " priority case for the " + subject);
    }
);
*/
module.exports = app;
