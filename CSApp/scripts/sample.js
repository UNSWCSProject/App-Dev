document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;

app.openDb = function() 
//If statement as defined by example, running in simulator actually calls the sqLite plug in
{
    if (window.sqlitePlugin !== undefined) 
    {
        app.db = window.sqlitePlugin.openDatabase("My-Database", "1.0", "SQLite Demo", 200000);
        //window.alert("Using SQLite device storage");
    } 
    else 
    {
        // For debugging in simulator fallback to native SQL Lite
        app.db = window.openDatabase("My-Database", "1.0", "Cordova Demo", 200000);
        //window.alert("Using local Cordova simulator storage");
    }
}

function init() {
    app.openDb();
    app.clearData();
    app.createTable();
    app.insertRecord("John");
    app.insertRecord("Mary");
    app.insertRecord("Lee");
    //app.selectAllRecords(getAllTheData);
    populateCubsList();
}

app.createTable = function() 
{
    //window.alert("createTable() called");
    app.db.transaction(function(tx) 
		{
            //window.alert("Transaction Opened");
        	tx.executeSql("CREATE TABLE IF NOT EXISTS MyTable (id INTEGER PRIMARY KEY ASC, text_sample TEXT)", [], 
                          app.onSuccess, app.onError);
    		//window.alert("Parsed through CREATE sql statement");
        }
	);//For the love of everything good in this world DO NOT DELETE!!!!!!
    
}

app.insertRecord = function(t) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("INSERT INTO MyTable(text_sample) VALUES (?)",
				[t]);
            //window.alert("Record inserted");
    	}
	);//For the love of everything good in this world DO NOT DELETE!!!!!!
}

app.onSuccess = function(tx, r) 
{
    console.log("Your SQLite query was successful!");
    window.alert("Your SQLite query was successful!");
}

app.onError = function(tx, e) 
{
    console.log("SQLite Error: " + e.message);
    window.alert("SQLite Error: " + e.message);
}

app.updateRecord = function(id, t) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("UPDATE MyTable SET text_sample = ? WHERE id = ?",
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
        	tx.executeSql("DELETE FROM MyTable WHERE id = ?",
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
            tx.executeSql("SELECT * FROM MyTable ORDER BY id", [],
			fn,
			app.onError);
   		}
	);
}

app.clearData = function() 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("DROP TABLE IF EXISTS MyTable");
   		}
	);
}

function populateCubsList(){
	var render = function (tx, rs) 
    {
        $('#cubsList').empty();
        var len = rs.rows.length;
        window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            $('#cubsList').append('<li><a href="#"><h3 class="ui-li-heading">'+row['text_sample']+'</a></li>');
            window.alert("Attempted to add to list: " + row['text_sample']);
        }
 
        $('#SoccerPlayerList').listview();
        window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    app.selectAllRecords(render);
}
	    

function getAllTheData() 
{
    var render = function (tx, rs) 
    {
        // rs contains our SQLite recordset, at this point you can do anything with it
        // in this case we'll just loop through it and output the results to the console
        var len = rs.rows.length;
    	window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            window.alert("Row = " + i + " ID = " + rs.rows.item(i).id + " Data =  " + row['text_sample']);
        }
    }
    app.selectAllRecords(render);
}

