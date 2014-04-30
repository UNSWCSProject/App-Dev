//Event listener to call init() once the device is ready and has loaded
document.addEventListener("deviceready", init, false);

//Global variables
var app = {};
app.db = null;

//This function 
app.openDb = function() 
{
    if (window.sqlitePlugin !== undefined) 
    {
        app.db = window.sqlitePlugin.openDatabase("cubDb");
        //window.alert("SQLite");
    } 
    else 
    {
        app.db = window.openDatabase("cubDb", "1.0", "Cordova Demo", 200000);
        //window.alert("Cordova");
    }
}

function init() {
    //-----Create the database-----//
    app.openDb();
    //-----Create the Cub Information-----//
    //app.clearData();
    app.createTable();
    populateCubsList();
    
    //-----Create User Information-----//
    //Comment out this line when you are happy to make the user data permanent
    //app.clearUserData();
    app.createLoginTable();
    
    //-----Create Activity Information-----//
    app.clearActivityData();
    app.createActivityTable();
    app.insertActivityInfo();
    populateActivityList();
    app.insertActivityInfo();
    
    firstUse(); 
}


app.testPop = function(t)
{
    window.alert("POP: "+t);
}

app.createTable = function() 
{
    app.db.transaction(function(tx)
		{
            tx.executeSql("CREATE TABLE IF NOT EXISTS cubTable(cubID INTEGER PRIMARY KEY ASC, surname VARCHAR(60), firstName VARCHAR(60), "+
            	"phone1 VARCHAR(20), phone2 VARCHAR(20), dob DATE, dateJoined DATETIME, colourSix VARCHAR(20), headOfSix TINYINT DEFAULT 0, secondOfSix "+
                "TINYINT DEFAULT 0, dateInvested DATETIME, guardian1 VARCHAR(150), guardian2 VARCHAR(150), address VARCHAR(500), cubLevel VARCHAR(10), "+
                "cubPosition VARCHAR(10))", [], app.onSuccess, app.onError);
            //tx.executeSql("CREATE TABLE IF NOT EXISTS cubTable(cubID INTEGER PRIMARY KEY ASC, firstName TEXT, surname TEXT)", [], app.onSuccess, app.onError);
            //Kyle has replaced headOfSix 0/1 and secondOfSix 0/1 with cubPosition, the input is restricted by dropdown boxes in the build menu
        	//window.alert("Table built");
        }
	)    
}

app.insertRecord = function(tFirst, tLast, tDob, tGuardian1, tPhone1, tGuardian2, tPhone2, tAddress, 
					tCubLevel, tcubPosition, tCubColor, tDateJoined, tDateInvested) 
{
    //window.alert("Insert called");
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("INSERT INTO cubTable(firstName, surname, dob, guardian1, phone1, guardian2, phone2, address, cubLevel, cubPosition, colourSix, "+
                          "dateJoined, dateInvested) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
				[tFirst, tLast, tDob, tGuardian1, tPhone1, tGuardian2, tPhone2, tAddress, tCubLevel, tcubPosition, tCubColor, tDateJoined, tDateInvested]);
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

app.updateRecord = function(cubID, t) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("UPDATE cubTable SET firstName = ? WHERE cubID = ?",
				[t, cubID],
				app.onSuccess,
				app.onError);
    	}
	);
}

app.deleteRecord = function(cubID) 
{
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("DELETE FROM cubTable WHERE cubID = ?",
        		[cubID],
        		app.onSuccess,
        		app.onError);
        }
	);
}

app.selectAllRecords = function(fn) 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("SELECT * FROM cubTable ORDER BY firstName", [],
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
        //window.alert("Populated called");
        $('#cubsList').empty();
        var len = rs.rows.length;
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            /*$('#cubsList').append('<li><a href="#"><h3 class="ui-li-heading"></h3></a></li>');
            window.alert("Attempted to add to list: " + row['firstName']);
            */
               $('#cubsList').append('<li><div class="checkBoxLeft"><input type="checkbox" /></div> <a href="#" data-transition="slide"><h3 class="pushRight">'+row['firstName']+' '+row['surname']+' '+row['cubID']+'</h3></a></li>');
        }
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
    //window.alert("attempting to build user...");
    if (password == confirmPassword)
    {
        //window.alert("running create statement...");
        app.insertLoginNameRecord(username, password);
        $.mobile.changePage("#login", {
            	transition: "slide",
            	reverse: false
        	});
        //window.alert("user built...");
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
       	for (var i = 0; i < len; i++)
        {
       		var row = rs.rows.item(i);
 	   		if (username == row['userName'] && password == row['userPass'])
    		{
        		$.mobile.changePage("#home", {
            		transition: "slide",
            		reverse: false
        		});
                break;
    		}
    		else if ((i + 1) == len)
            {    
        		window.alert("Incorrect username or password");
            }
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
                          
//------------Activity Table Section-------------------------//


app.createActivityTable = function() 
{
    app.db.transaction(function(tx) 
		{
            window.alert("ActivityTable created");
        	tx.executeSql("CREATE TABLE IF NOT EXISTS activityTable (id INTEGER PRIMARY KEY ASC, activityName TEXT)", [], 
                          app.onSuccess, app.onError);
        }
	);
}


app.insertActivityInfo = function(fn)
{
    app.db.transaction(function(tx)
        {            
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Health & First Aid');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Saftey');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Ropes');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Outdoor Scouting');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Our Cub Scout Traditions');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Symbols of Australia');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Promise and Law');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Fitness');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('People and Cultures');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Scientific Discovery');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('The Natural Environment');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Self Expression');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Handcraft');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName) VALUES ('Your Community');", [],
                         app.onSuccess, app.onError);
            window.alert("Activities inserted");
        }
    );
}


app.getActivityRecords = function(fn) 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("SELECT activityName FROM activityTable ORDER BY activityName", [],
			fn,
			app.onError);
   		}
	);
}

function populateActivityList(){
    window.alert("populateActivityList function entered");
	var render = function (tx, rs) 
    {
        window.alert("Activity called");                                                                                                                                                                                                                                                                                                                                                                                 
        $('#activityList').empty();
        var len = rs.rows.length;
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            $('#activityList').append('<li><a href="#"><h3 class="ui-li-heading">'+row['activityName']+'</h3></a></li>');
            //window.alert("Attempted to add to list: " + row['activityName']);
        }        
        window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    
    //HOLMES FUCKING AROUND
    /*
    {
        window.alert("Holmes Activity called");                                                                                                                                                                                                                                                                                                                                                                                 
        $('#activityList').empty();
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
           $('#activityList').append('<li><h3>'+ row['activityName'] + '</h3><ul id = '+ row['activityName'] + '></ul></li>'); 
           $().append('<li><a href="#"><h3 class="ui-li-heading">'+row['activityName']+'</h3></a></li>');
            
            window.alert("Attempted to add to list: " + row['activityName']);
        }        
        window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    */
    //END HOLMES
    
    app.getActivityRecords(render);
}

app.clearActivityData = function() 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("DELETE FROM activityTable");
   		}
	);
}

