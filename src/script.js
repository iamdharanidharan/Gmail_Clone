// Client ID and API key from the Developer Console
var CLIENT_ID = '384015590213-mer7mo6grfo36sss9nt9rhne2m13nlbv.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD3_bp1ztPy8JqejfUJIqXPT6chJUfgRZg';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://mail.google.com/ ' + 'https://www.googleapis.com/auth/gmail.addons.current.action.compose ' + 'https://www.googleapis.com/auth/gmail.compose ' + 'https://www.googleapis.com/auth/gmail.modify ' + 'https://www.googleapis.com/auth/gmail.send';

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var tableDiv = document.getElementById('table-Div');
var contentDiv = document.getElementById('contents-Div');
var composeBtn = document.getElementById('compose-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        tableDiv.style.display = '';
        contentDiv.style.display = '';
        composeBtn.style.display = 'block';
        getPrimaryMsgIDs();
        
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        tableDiv.style.display = 'none';
        contentDiv.style.display = 'none';
        composeBtn.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '    ');
    pre.appendChild(textContent);
}



function listLabels() {
    gapi.client.gmail.users.labels.list({
        'userId': 'me'
    }).then(function (response) {
        var labels = response.result.labels;
        appendPre('Labels:');

        if (labels && labels.length > 0) {
            for (i = 0; i < labels.length; i++) {
                var label = labels[i];
                appendPre(label.name)
            }
        } else {
            appendPre('No Labels found.');
        }

    });
}

function getPrimaryMsgIDs() {

    var msgIds = [];
    gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'CATEGORY_PERSONAL',
        'maxResults': '10'
    }).then(function (response) {
        for (records in response.result.messages) {
            var msgId = response.result.messages[records].id;
            msgIds.push(msgId);
        }
        //appendPre('last message snippet' + response.result.messages[4].);
        readSubjectAndSnippets(msgIds);
    })

}

function readSubjectAndSnippets(msgIds) {
    let resultDiv = document.getElementById('subjectAndSnippets');
    if(resultDiv.innerHTML !== '') resultDiv.innerHTML = '';
    var table = document.createElement('table');
    table.setAttribute('class', 'table table-hover');
    var tableBody = document.createElement('tbody');
    tableBody.id = 'tableBody';
    table.append(tableBody);
    resultDiv.append(table);
    
    for (val in msgIds) {
        gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': msgIds[val]
        }).then(res => {
            //  let msg = res.data.payload.MessagePart.body.data ;
            // let decodedMsg = btoa(msg);
            return res;

        }).then(data1 => {

            // let encodeddata = data1.result.payload.parts[1].body.data;
           // console.log(data1.result.payload.headers);
            var snippet = data1.result.snippet;
            var subject = '';
            var from = '';
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'Subject') 
                    subject= data1.result.payload.headers[val].value
            }
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'From') 
                    from = data1.result.payload.headers[val].value
            }
            var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.innerText = from;
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = subject;
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = snippet;
                    tr.append(td);
                    var button= document.createElement('a');
                    button.className="btn btn-primary";
                    button.setAttribute('data-target','#ViewEmail-modal');
                    button.setAttribute('data-toggle',"modal");
                    button.innerText= "View";
                    button.setAttribute('onclick',"readPrimary('"+data1.result.id+"')");
                    
                   // console.log(msgIds[i]);
                   
                    td = document.createElement('td');
                    td.append(button);
                    tr.append(td);
                    var tBody = document.getElementById('tableBody');
                    tBody.append(tr);

            // encodeddata = encodeddata.replace(/-/g, '+').replace(/_/g, '/');
            // encodeddata = atob(encodeddata);
            //console.log();
            //var encodeddata = data1.result.payload.parts[1].body.data;
            // let lmessage = document.getElementById('lastEmail');
            // lmessage.innerHTML = encodeddata;

        })

    }
    //  populatePrimaryTable(subjectAndSnippet);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function getSentMsgIDs() {

    var msgIds = [];
    gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'SENT',
        'maxResults': '10'
    }).then(function (response) {
        for (records in response.result.messages) {
            var msgId = response.result.messages[records].id;
            msgIds.push(msgId);
        }
        //appendPre('last message snippet' + response.result.messages[4].);
        readSubjectAndSnippetsOfSent(msgIds);
    })

}

function readSubjectAndSnippetsOfSent(msgIds) {
    let resultDiv = document.getElementById('subjectAndSnippets');
    if(resultDiv.innerHTML !== '') resultDiv.innerHTML = '';
    var table = document.createElement('table');
    table.id = 'mytable';
    table.setAttribute('class', 'table table-hover');
    var tableBody = document.createElement('tbody');
    tableBody.id = 'tableBody';
    table.append(tableBody);
    
    resultDiv.append(table);
    for (val in msgIds) {
        gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': msgIds[val]
        }).then(res => {
            //  let msg = res.data.payload.MessagePart.body.data ;
            // let decodedMsg = btoa(msg);
            return res;

        }).then(data1 => {

            // let encodeddata = data1.result.payload.parts[1].body.data;
           // console.log(data1.result.payload.headers);
            var snippet = data1.result.snippet;
            var subject = '';
            var from = '';
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'Subject') 
                    subject= data1.result.payload.headers[val].value
            }
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'To') 
                    from = data1.result.payload.headers[val].value
            }
            var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.innerText = from;
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = subject.substring(0,50);
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = snippet;
                    tr.append(td);
                    var tBody = document.getElementById('tableBody');
                    tBody.append(tr);

            // encodeddata = encodeddata.replace(/-/g, '+').replace(/_/g, '/');
            // encodeddata = atob(encodeddata);
            //console.log();
            //var encodeddata = data1.result.payload.parts[1].body.data;
            // let lmessage = document.getElementById('lastEmail');
            // lmessage.innerHTML = encodeddata;

        })

    }
    //  populatePrimaryTable(subjectAndSnippet);
}


///////////////////////////////////////////////////////////////////////////////////////////////////


function readPrimary(messageID) {
   // console.log(messageID);
        gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageID
        }).then(res => {
            //  let msg = res.data.payload.MessagePart.body.data ;
            // let decodedMsg = btoa(msg);
            return res;

        }).then(data1 => {
           // console.log(data1.result);
            let encodeddata = data1.result.payload.parts[1].body.data;
            encodeddata = encodeddata.replace(/-/g, '+').replace(/_/g, '/');
            encodeddata = atob(encodeddata);
            //console.log();
            //var encodeddata = data1.result.payload.parts[1].body.data;
            let lmessage = document.getElementById('viewEmailModal');
            lmessage.innerHTML = encodeddata;

        })

    
}

function customSendMail() {

    gapi.client.gmail.users.getProfile({
        'userId': 'me',
    }).then(res => {
        return res;
    }).then(data1 => {
        var fromAddress = data1.result.emailAddress;
        var toAddress = document.getElementById('compose-to').value;
        var subjectText = document.getElementById('compose-subject').value;
        var messageText = document.getElementById('compose-message').value;
        console.log(fromAddress);
       const message =
            "From: "+ fromAddress +"\r\n" +
            "To: " + toAddress +"\r\n" +
            "Subject: " + subjectText +"\r\n\r\n" +
            messageText;
    
    
        // The body needs to be base64url encoded.
        const encodedMessage = btoa(message)
    
        const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
        //console.log(reallyEncodedMessage);
        gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                // same response with any of these
                raw: reallyEncodedMessage
                // raw: encodedMessage
                // raw: message
            }
        }).then(cAlert('Mail Sent!!')); 

    })    
}
/////////////////////////////////////////////////////////////////////////////////////////////////

function getDraftMsgIDs(){
    var msgIds = [];
    gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'DRAFT',
        'maxResults': '10'
    }).then(function (response) {
        for (records in response.result.messages) {
            var msgId = response.result.messages[records].id;
            msgIds.push(msgId);
        }
        //appendPre('last message snippet' + response.result.messages[4].);
        readSubjectAndSnippetsOfDraft(msgIds);
    })
}

function readSubjectAndSnippetsOfDraft(msgIds) {
    let resultDiv = document.getElementById('subjectAndSnippets');
    if(resultDiv.innerHTML !== '') resultDiv.innerHTML = '';
    var table = document.createElement('table');
    table.setAttribute('class', 'table table-hover');
    var tableBody = document.createElement('tbody');
    tableBody.id = 'tableBody';
    table.append(tableBody);
    resultDiv.append(table);
    
    for (val in msgIds) {
        gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': msgIds[val]
        }).then(res => {
            //  let msg = res.data.payload.MessagePart.body.data ;
            // let decodedMsg = btoa(msg);
            return res;

        }).then(data1 => {

            // let encodeddata = data1.result.payload.parts[1].body.data;
           // console.log(data1.result.payload.headers);
            var snippet = data1.result.snippet;
            var subject = '';
            var from = '';
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'Subject') 
                    subject= data1.result.payload.headers[val].value
            }
            for (val in data1.result.payload.headers) {
                if (data1.result.payload.headers[val].name == 'From') 
                    from = data1.result.payload.headers[val].value
            }
            var tr = document.createElement('tr');
                    var td = document.createElement('td');
                    td.innerText = from;
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = subject;
                    tr.append(td);
                    td = document.createElement('td');
                    td.innerHTML = snippet;
                    tr.append(td);
                    var button= document.createElement('a');
                    button.className="btn btn-primary";
                    button.setAttribute('data-target','#ViewEmail-modal');
                    button.setAttribute('data-toggle',"modal");
                    button.innerText= "Edit";
                    button.setAttribute('onclick',"readPrimary('"+data1.result.id+"')");
                    
                   // console.log(msgIds[i]);
                   
                    td = document.createElement('td');
                    td.append(button);
                    tr.append(td);
                    var tBody = document.getElementById('tableBody');
                    tBody.append(tr);

            // encodeddata = encodeddata.replace(/-/g, '+').replace(/_/g, '/');
            // encodeddata = atob(encodeddata);
            //console.log();
            //var encodeddata = data1.result.payload.parts[1].body.data;
            // let lmessage = document.getElementById('lastEmail');
            // lmessage.innerHTML = encodeddata;

        })

    }
    //  populatePrimaryTable(subjectAndSnippet);
}


/////////////////////////////////////////////////////////////////////////////////////////////////


let cAlert = (message)=> {
    document.getElementById('myalert-message').innerHTML = message;
    document.getElementById('myalert').style.display = 'block';
}