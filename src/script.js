


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
    let i=0;
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
                    let mID = msgIds[i];
                    button.setAttribute('onclick',"readPrimary('"+mID+"')");
                    
                   // console.log(msgIds[i]);
                    i++;
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
    console.log(messageID);
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

function sendMail() {
    var toAddress = document.getElementById('compose-to').value;
    var subjectText = document.getElementById('compose-subject').value;
    var messageText = document.getElementById('compose-message').value;
    const message =
        "From: iamdharanidharan@gmail.com\r\n" +
        "To: " + toAddress +"\r\n" +
        "Subject: " + subjectText +"\r\n\r\n" +
        messageText;


    // The body needs to be base64url encoded.
    const encodedMessage = btoa(message)

    const reallyEncodedMessage = encodedMessage.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    console.log(reallyEncodedMessage);
    gapi.client.gmail.users.messages.send({
        userId: 'me',
        resource: {
            // same response with any of these
            raw: reallyEncodedMessage
            // raw: encodedMessage
            // raw: message
        }
    }).then(function () { console.log("Mail sending done!") });
}