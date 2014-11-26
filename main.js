/**
 * @author  Ikaros Kappler
 * @date    2014-08-31
 * @version 1.0.0
 **/

var dbName          = "ikrs_memodb";
var initialMemoText = "Enter your memo here";

function initApp() {
    //window.alert( "X" );
    setInitialMemoText();
    init_myCouch();
    try {
	init_DB();
    } catch( e ) {
	console.log( e );
    }
}

function setInitialMemoText() {
    //window.alert( "X: " + JSON.stringify($("#memo_text")) );
    $("textarea#memo_text").val( initialMemoText );
    //document.getElementById("memo_text").value = "test";
    //window.alert( $("#memo_text").val() ); 
    //$("#memo_text").value = "A";
}

function memotext_focussed() {
    //window.alert( "Y" );
    var elem = $("textarea#memo_text");
    if( elem.val().trim() == initialMemoText )
        $("textarea#memo_text").val("");
}

function memotext_blurred() {
    var elem = $("textarea#memo_text");
    if( elem.val() == "" ) 
        setInitialMemoText();
    
}


function init_myCouch() {
    // Configure the API URL
    $.couch.urlPrefix = "http://127.0.0.1:5984";
    //window.alert( $.couch.urlPrefix );
}

function init_DB() {
    $.couch.db( dbName ).create({
	success: function(data) {
            console.log("Database created: " + data );
	},
	error: function(status) {
            console.log("Failed to create database '" + dbName + "' (status=" + status + "). Does it already exist?" );
	}
    });
}

//window.addEventListener( 'load', init_myCouch, true );


function getServerInfo() {
    // Note that 'cross-domain' requests don't work without CORS
    //  $ sudo apt-get install node.js node npm
    //  $ npm install -g add-cors-to-couchdb
    //  $ add-cors-to-couchdb

    // Found at
    //   http://bradley-holt.com/2011/07/couchdb-jquery-plugin-reference/
    
    // Note that if the couchDB domain the HTTP domain differ, you have to enable CORS.
    //   edit /etc/couchdb/default.ini
    // Set in the [httpd] section:
    //   enable_cors = true
    // And set in the [cors] section:
    //   origins = *
    // (or the domain you want to use; otherwise _ever domain_ can read/modify your couchdb).
    //  
    // Eventually add the same items/sections to the local.ini file.
    // Restart the server. 
    // Note: restarting only apache and/or couchDB somehow does not do the job.
    // Restart the whole system. (really?? dafuq?!)
    $.couch.info({
	// GET http://localhost:5984/
	success: function(data) {
            window.alert( JSON.stringify(data) );
	}
    });
}

function allDBs() {
    // GET http://localhost:5984/_all_dbs
    $.couch.allDbs({
	success: function(data) {
            window.alert( JSON.stringify(data) );
	}
    });
}

/*
function signup() {
    // PUT http://localhost:5984/_users/org.couchdb.user%3Abob 201 Created
    var userDoc = {
	_id: "org.couchdb.user:bob",
	name: "bob"
    };
    $.couch.signup(userDoc, "supersecurepassword", {
	success: function(data) {
            window.alert( "[success] " + JSON.stringify(data) );
	},
	error: function(status) {
            window.alert( "[error] " + JSON.stringify(status) );
	}
    });
}
*/

function login() {
    // POST http://localhost:5984/_session 200 OK
    $.couch.login({
	name: "bob",
	password: "supersecurepassword",
	success: function(data) {
            window.alert( "[success] " + JSON.stringify(data) );	
	},
	error: function(status) {
            window.alert( "[error] " + JSON.stringify(status) );
	}
    });
}

function session() {
    // couchDB's default session length is 10 minutes
    //   couch_httpd_auth.timeout

    // GET http://localhost:5984/_session
    $.couch.session({
	success: function(data) {
            console.log(data);
	}
    });
}

function logout() {
    // DELETE http://_:_@localhost:5984/_session 200 OK
    $.couch.logout({
	success: function(data) {
            window.alert( JSON.stringify(data) );
	}
    });
}


function storeMemo() {
    //window.alert( "X" );

    var text = $("textarea#memo_text").val().trim();
    if( text == "" || text == initialMemoText ) {
	setStatus("Please enter a memo text." );
	return false;
    }

    // ...
    // window.alert( "Storing memo ... " );

    var doc = { conent: text };
    $.couch.db(dbName).saveDoc(doc, {
	success: function(data) {
	    //window.alert( "Success" );
            console.log( "Document stored: " + JSON.stringify(data) );
	    setStatus( "Document stored: " + JSON.stringify(data) );
	},
	error: function(status) {
	    //window.alert( "Error" );
            console.log( "Failed to store document: " + JSON.stringify(status) );
	    setStatus( "Failed to store document: " + JSON.stringify(status) );
	}
    });

    //setStatus( "Memo stored." );
}

function listMemos() {
    displayData( "", false );
    $.couch.db(dbName).allDocs({
	success: function( data ) {
            console.log(data);
	    //$("div#memos").html( JSON.stringify(data) );

	    var result = "";
	    for( i = 0; i < data.rows.length; i++ ) {
		var row = data.rows[i];
		$.couch.db( dbName ).openDoc( row.id,
					      { success: function(data) {
						  console.log(data);
						  displayData( data.conent + "<br/>\n",
							          // + " " + JSON.stringify(data) + "<br/>\n", 
							       true ); // append
					      },
						error: function(status) {
						    console.log(status);
						    displayData( JSON.stringify(data), 
								 true ); // append
						}
					      }
					    );
	    }

	    setStatus( "Memos listed." );
	},
	error: function( data ) {
	    console.log("Error: " + data );
	    setStatus( "Error: " + data );
	}
    });
}

function setStatus( msg ) {
    if( msg )
	$("div#status").html( "$status: " + msg );
    else
	$("div#status").html( "$status" );
}

function displayData( msg, append ) {
    if( append )
	$("div#memos").append( msg );	
    else
	$("div#memos").html( msg );
}

window.addEventListener( "load", initApp(), false );

//$("#memo_text").ready( function() { this.value = "test"; return this; } );
