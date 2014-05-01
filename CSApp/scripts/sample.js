//Event listener to call init() once the device is ready and has loaded
document.addEventListener("deviceready", init, false);

//Global variables
var app = {};
app.db = null;

//This function creates the database
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

//When the device is initialised, run these functions
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

app.testPop = function(t)
{
    window.alert("POP: "+t);
}
//------------Cub Table Section-------------------------//

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
            $('#cubsList').append('<li id = "cubID' +row['cubID']+'"><a id = '+ row['cubID'] +' onclick="editCub(id)"><div><div class="checkBoxLeft"><input type="checkbox" class="checkCub" /></div><h3 class="pushRight">'+row['firstName']+' '+row['surname']+' '+row['cubID']+'</h3></div></a></li>');
        }
        //window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    app.selectAllRecords(render);
}

function editCub(id)
{
	//window.alert(id);
    $.mobile.changePage("#new-cub", {
            	transition: "slide",
            	reverse: false
        	});
    
    
    //Chnage header to say 
    $("#heading").text("Edit Cub");
    //Fill the existing inputs
    
    //INSERT CODE TO MAKE IT GET THE INFO FROM THE ROWS
    
    $("#firstName").val(id);
    $("#lastName").val(id);
    $("#dob").val(id);
    $("#guardian1").val(id);
    $("#phone1").val(id);
    $("#guardian2").val(id);
    $("#phone2").val(id);
    $("#address").val(id);
    $("#cubLevel").val(id);
    $("#cubPosition").val(id);
    $("#cubColor").val(id);
    $("#dateJoined").val(id);
    $("#dateInvested").val(id);    
    
}

function gotoAddCub()
{
	$("#heading").text("Add Cub");
    $.mobile.changePage("#new-cub", {
            	transition: "slide",
            	reverse: false
        	});
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
            //window.alert("ActivityTable created");
        	tx.executeSql("CREATE TABLE activityTable (activityID INTEGER PRIMARY KEY ASC, activityName TEXT, categoryName TEXT, categoryLevel TEXT)", [], 
                          app.onSuccess, app.onError);
        }
	);
}

app.insertActivityInfo = function(fn)
{
    app.db.transaction(function(tx)
        {  
            //Bronze below
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Health and First Aid', 'Health and First Aid', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Safety', 'Safety', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ropes', 'Ropes', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Scouting', 'Outdoor Scouting', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Our Cub Scout Traditions','Our Cub Scout Traditions', 'Bronze');", [],
                         app.onSuccess, app.onError)
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Symbols of Australia','Symbols of Australia', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law','Promise and Law', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fitness','Fitness', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('People and Cultures','People and Cultures', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scientific Discovery','Scientific Discovery', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Natural Environment','The Natural Environment', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Self Expression','Self Expression', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Handcraft','Handcraft', 'Bronze');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Your Community','Your Community', 'Bronze');", [],
                         app.onSuccess, app.onError);
            
            //Silver below
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Health and First Aid', 'Health and First Aid', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Safety', 'Safety', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ropes', 'Ropes', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Scouting', 'Outdoor Scouting', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Our Cub Scout Traditions','Our Cub Scout Traditions', 'Silver');", [],
                         app.onSuccess, app.onError)
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Symbols of Australia','Symbols of Australia', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law','Promise and Law', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fitness','Fitness', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('People and Cultures','People and Cultures', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scientific Discovery','Scientific Discovery', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Natural Environment','The Natural Environment', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Self Expression','Self Expression', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Handcraft','Handcraft', 'Silver');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Your Community','Your Community', 'Silver');", [],
                         app.onSuccess, app.onError);
            
            //Gold below
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Health and First Aid', 'Health and First Aid', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Safety', 'Safety', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ropes', 'Ropes', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Scouting', 'Outdoor Scouting', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Our Cub Scout Traditions','Our Cub Scout Traditions', 'Gold');", [],
                         app.onSuccess, app.onError)
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Symbols of Australia','Symbols of Australia', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law','Promise and Law', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fitness','Fitness', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('People and Cultures','People and Cultures', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scientific Discovery','Scientific Discovery', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Natural Environment','The Natural Environment', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Self Expression','Self Expression', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Handcraft','Handcraft', 'Gold');", [],
                         app.onSuccess, app.onError);
            tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Your Community','Your Community', 'Gold');", [],
                         app.onSuccess, app.onError);
            //End activity Table insert
        }
    );
}

app.getActivityRecords = function(fn) 
{
    app.db.transaction(function(tx) 
    	{
            tx.executeSql("SELECT * FROM activityTable ORDER BY activityName", [],
			fn,
			app.onError);
   		}
	);
}

function populateActivityList(){
    //window.alert("populateActivityList function entered");
	var render = function (tx, rs)       
    {
        //window.alert("Holmes Activity called");                                                                                                                                                                                                                                                                                                                                                                                 
        $('#activityListBronze').empty();
        $('#activityListSilver').empty();
        $('#activityListGold').empty();
       // window.alert("SQLite Table: " + rs.rows.length + " rows found.");
       
        //FILLS all lists
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            
           	$('#activityList'+ row['categoryLevel']).append('<div data-role="collapsible"><h3>'+ row['categoryName'] + '</h3><p id =cat1'+ row['activityID'] + '></p></div>'); 
           	$('#cat1' + row['activityID']).append('<div class="checkBoxLeft"><input type="checkbox" class = "checkAct" id = '+row['activityID']+'/></div><p class="pushRight">'+row['activityName']+' '+ row['categoryLevel']+'</p>');
            
           // window.alert("Attempted to add to list: " + row['categoryName']);
        }
        //window.alert("Attempted to store the query result in an array and display in activitylistView() style");   
	}
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

//-----------------------------Calendar-------------------------------//

function editAct()
{
	var dateString = $("#targetDate").val();
    
    //Purely for the Window Alert - use the datestring for any work
    var date = new Date(dateString);
    var bob = date.toString();	
    window.alert(bob);
    
    //Plan - changepage to bronze activities
    // deselect all actvities in lists
    /*
            $('.checkAct').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkAct"                       
            });
            */
    /*
    //Insert code to select all actvities that are already in the table
    
    $("#SUBMISSION BUTTON ID").click( function() {
 
        $("# input:checked").each(function() {
 
            window.alert( $(this).attr('id') );
            
            tx.executeSql("SELECT * FROM activityTable WHERE activityID = ?", [checkboxID],
				app.onSuccess,
				app.onError);
                
           	$('#activityListConfirm').append(<p>activityName</p>); 
 
        });
 
    });
*/
    //Submit/BRONZE?SILVER/GOLD Button Code
    //Needs the wrapping app.function code
    /* tx.executeSql("INSERT INTO meetActivityJoin (date,activityID) VALUES (?,?)", [dateString, checkboxID],
				app.onSuccess,
				app.onError);
    */
}    

function rollCall()
{
	var dateString = $("#targetDate").val();
    
    //Purely for the Window Alert - use the datestring for any work
    var date = new Date(dateString);
    var bob = date.toString();	
    window.alert(bob);

    //Plan - changepage to cub-list
    // deselect all cubs in list
     /*
            $('.checkCub').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkCub"                       
            });
            */
    //Insert code which selects cub if exists in table where date = dateString
    
    // on checkbox select, insert cubID into table
    /* tx.executeSql("INSERT INTO cubMeetJoin (date, cubID) VALUES (?,?)", [dateString, checkboxID],
				app.onSuccess,
				app.onError);
    */ 
    // on checkbox deselect, delete cubID from table
    /* tx.executeSql("DELETE * FROM cubMeetJoin WHERE date = ? AND cubID = ?", [dateString, checkboxID],
				app.onSuccess,
				app.onError);
    */
}    
    
    
    