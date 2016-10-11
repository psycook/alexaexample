module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'cases-skill' );
app.dictionary={"subjects":["printer", "lift", "door"],
                "severities":["low", "medium", "high"],
                "names":["Simon Cook", "Larence Ratcliffe", "Sanjay Pradhan"]
};

var name;
var subject;
var severity;

app.launch( function( request, response ) {
    response.say( 'Welcome to case logger.' ).reprompt( 'Welcome to case logger.' ).shouldEndSession( false );
} );

app.error = function( exception, request, response ) {
   console.log(exception)
   console.log(request);
   console.log(response);
   response.say( 'Sorry an error occured ' + error.message);
};

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
    response.say("Got it.  The subject is " + subject + ".  What is the severity?");
    }
);

app.intent('caseSeverity',
  {
    "slots":{"Severity":"LITERAL"},
    "utterances":[ "the severity is {severities|Severity}", "severity is {severities|Severity}", "severity {severities|Severity}" ]
  },
  function(request,response) {
    severity = request.slot('Severity');
    console.log("UTTERANCE:caseSeverity " + severity);
    response.say("Got it.  The severity is " + severity + ".  What is your name?");
    }
);

app.intent('caseName',
  {
    "slots":{"Name":"LITERAL"},
    "utterances":[ "my name is {names|Name}", "I am {names|Name}", "I'm {names|Name}" ]
  },
  function(request,response) {
    name = request.slot('Name');
    console.log("UTTERANCE:caseName opened case for " + subject + " at severity " + severity + " for " + name);
    response.say("Got it. Thank you " + name + ".  I have opened your " + severity + " priority case for the " + subject);
    }
);

module.exports = app;
