//Use http://jsfiddle.net/ to run code sections and tidy up the layout

document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;

app.openDb = function() 
//If statement as defined by example, running in simulator actually calls the sqLite plug in
{
    if (window.sqlitePlugin !== undefined) 
    {
        app.db = window.sqlitePlugin.openDatabase("My-Database", "1.0", "SQLite Demo", 200000);
    } 
    else 
    {
        // For debugging in simulator fallback to native SQL Lite
        app.db = window.openDatabase("My-Database", "1.0", "Cordova Demo", 200000);
    }
}

function init() {
    //-----Create the database-----//
    app.openDb();
    //-----Create the Cub Information-----//
    app.clearData();
    app.createTable();
    app.insertRecord("John");
    app.insertRecord("Mary");
    app.insertRecord("Lee");
    populateCubsList();
    //-----Create User Information-----//
    //Comment out this line when you are happy to make the user data permanent
    //app.clearUserData();
    app.createLoginTable();
    firstUse(); 
}

app.createTable = function() 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("CREATE TABLE IF NOT EXISTS cubTable (id INTEGER PRIMARY KEY ASC, text_sample TEXT)", [], 
                          app.onSuccess, app.onError);
        }
	)
    
}

app.insertRecord = function(t) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("INSERT INTO cubTable(text_sample) VALUES (?)",
				[t]);
    	}
	)
}

app.onSuccess = function(tx, r) 
{
    console.log("Your SQLite query was successful!");
    //window.alert("Your SQLite query was successful!");
}

app.onError = function(tx, e) 
{
    console.log("SQLite Error: " + e.message);
    //window.alert("SQLite Error: " + e.message);
}

app.updateRecord = function(id, t) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("UPDATE cubTable SET text_sample = ? WHERE id = ?",
				[t, id],
				app.onSuccess,
				app.onError);
    	}
	);
}

app.deleteRecord = function(id) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("DELETE FROM cubTable WHERE id = ?",
        		[id],
        		app.onSuccess,
        		app.onError);
        }
	);
}

app.selectAllRecords = function(fn) 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("SELECT * FROM cubTable ORDER BY id", [],
			fn,
			app.onError);
   		}
	);
}

app.clearData = function() 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("DROP TABLE IF EXISTS cubTable");
   		}
	);
}

function populateCubsList(){
	var render = function (tx, rs) 
    {
        $('#cubsList').empty();
        var len = rs.rows.length;
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            $('#cubsList').append('<li><a href="#"><h3 class="ui-li-heading">'+row['text_sample']+'</a></li>');
            //window.alert("Attempted to add to list: " + row['text_sample']);
        }
 
        //$('#SoccerPlayerList').listview();
        //window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    app.selectAllRecords(render);
}

//------------Login Table Section-------------------------//

function firstUse() 
{
    var render = function (tx, rs) 
    {
       var len = rs.rows.length;      
 	   if (len == 0)
    	{
        	$.mobile.changePage("#createUser", {
            	transition: "slide",
            	reverse: false
        	});
    	}
    }
    app.getLoginRecords(render);
}

function createUser(username, password, confirmPassword) 
{
    if (password == confirmPassword)
    {
        app.insertLoginNameRecord(username, password);
        $.mobile.changePage("#login", {
            	transition: "slide",
            	reverse: false
        	});
    }
    else
    {
        window.alert("Your passwords do not match. Please try again");
    }
}

function verifyUser(username, password) 
{
    var render = function (tx, rs) 
    {
       var len = rs.rows.length;
       var row = rs.rows.item(0);
        
 	   if (username == row['userName'] && password == row['userPass'])
    	{
        	$.mobile.changePage("#home", {
            	transition: "slide",
            	reverse: false
        	});
    	} 
    	else 
    	{
        	window.alert("Incorrect username or password");
    	}
    }
    app.getLoginRecords(render);
}

app.createLoginTable = function() 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("CREATE TABLE IF NOT EXISTS userTable (id INTEGER PRIMARY KEY ASC, userName TEXT, userPass TEXT)", [], 
                          app.onSuccess, app.onError);
        }
	);
}

app.insertLoginNameRecord = function(t, s) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("INSERT INTO userTable(userName, userPass) VALUES (?, ?)",
				[t, s]);
    	}
	);
}

app.getLoginRecords = function(fn) 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("SELECT * FROM userTable ORDER BY id", [],
			fn,
			app.onError);
   		}
	);
}

app.clearUserData = function() 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("DROP TABLE IF EXISTS userTable");
   		}
	);
}
                          


