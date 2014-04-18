<!--

//Test the connection from index.html to the main.js file
//window.alert("Connected to main.js");

    
    
//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/
//window.alert("About to declare event Listeners");
document.addEventListener("deviceready", onDeviceReady, false);
//window.alert("Event Listener 1/2 enabled");
//Activate :active state on device
document.addEventListener("touchstart", function() {}, false);
//window.alert("Event Listener 2/2 enabled");


//declaring the variables for the functions
var cubDb = {};
cubDb.db = null;
var createCub = "INSERT INTO cub(surname, firstName, phone1, phone2, dob, dateJoined, colourSix, headOfSix, secondOfSix, dateInvested, guardian1, guardian2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
var selectCubNames = "SELECT (firstName, surname) FROM Contacts"; 
var updateCub = "UPDATE cub SET surname = ?, firstname = ?, phone1 = ?, phone2 = ?, dob = ?, dateJoined = ?, colourSix = ?, headOfSix = ?, secondOfSix = ?, dateInvested = ?, guardian1 = ?, guardian2 = ? WHERE id=?"; 
var deletecub = "DELETE FROM cub WHERE id=?"; 
var dropStatement = "DROP TABLE cub";
//var cubDb = openDatabase("cubDb", "1.0", "Cordova", 200000);  // Open SQLite Database
var dataset;

//window.alert("Variables declared");

//device ready test
function onDeviceReady()
{
    window.alert("onDeviceReady() being called");
    cubDb.openDb();
    cubDb.createTable();
    //cubDb.createCub(createCub);
    app.selectAllRecords(getAllTheData);
    
   // showRecords();
    //loadCub();
   // displayCubs();
    
    //WRITE cubDb.REFRESH
    //cubDb.refresh();
}

//opens up the database on initialisation
cubDb.openDb = function() 
{
   //if (window.navigator.simulator === true) {
    if (window.sqlitePlugin == undefined){
        // For debugin in simulator fallback to native SQL Lite
        window.alert("Use built in Cordova");
        cubDb.db = window.openDatabase("cubDb", "1.0", "Cordova", 200000);
    }
    else {
        window.alert("Use SQLite");
        cubDb.db = window.sqlitePlugin.openDatabase("cubDb");
    }
	
	//window.alert("Database opened");
}

//creates the tables of the database if the tables don't already exist
cubDb.createTable = function() 
{
    //window.alert("createTable() has been called");
	//var cubDb = cubDb.db;
    //window.alert("createTable() variables have been declared");
	cubDb.db.transaction(function(tx) 
    {
        window.alert("transaction opened");
		tx.executeSql("CREATE TABLE IF NOT EXISTS cubUser(userID INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(150), password VARCHAR(150), verified TINYINT DEFAULT 0, dateJoined DATETIME)", []);
        //window.alert("1 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS cub(cubID INTEGER PRIMARY KEY AUTOINCREMENT, surname VARCHAR(60), firstName VARCHAR(60), phone1 VARCHAR(20), phone2 VARCHAR(20), dob DATE, dateJoined DATETIME, colourSix VARCHAR(20), headOfSix TINYINT DEFAULT 0, secondOfSix TINYINT DEFAULT 0, dateInvested DATETIME, guardian1 VARCHAR(150), guardian2 VARCHAR(150))", []);
		//window.alert("2 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS meet(meetID INTEGER PRIMARY KEY AUTOINCREMENT, nightName VARCHAR(150), venue VARCHAR(150), date DATE, time TIME, leader VARCHAR(150), notes TEXT)", []);
        //window.alert("3 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS badge(badgeID INTEGER PRIMARY KEY AUTOINCREMENT, badgeName VARCHAR(150))", []);
        //window.alert("4 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS section(sectionID INTEGER PRIMARY KEY AUTOINCREMENT, sectionName VARCHAR(60), compulsory TINYINT DEFAULT 0)", []);
        //window.alert("5 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS category(categoryID INTEGER PRIMARY KEY AUTOINCREMENT, categoryName VARCHAR(150))", []);
        //window.alert("6 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS activity(activityID INTEGER PRIMARY KEY AUTOINCREMENT, activityName VARCHAR(150))", []);
        //window.alert("7 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubActivity(cubID INTEGER, activityID INTEGER, date DATE, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (activityID) REFERENCES activity(activityID))", []);
        //window.alert("8 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubBadge(cubID INTEGER, badgeID INTEGER, dateCompleted DATE, completed TINYINT DEFAULT 0, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (badgeID) REFERENCES badge(badgeID), PRIMARY KEY(cubID, badgeID))", []);
        //window.alert("9 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubSectionCategory(cubID INTEGER, sectionID INTEGER, categoryID INTEGER, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (sectionID) REFERENCES section(sectionID), FOREIGN KEY (categoryID) REFERENCES category(categoryID) PRIMARY KEY(cubID, sectionID, categoryID))", []);
        //window.alert("10 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS sectionActivity(sectionID INTEGER, activityID INTEGER, FOREIGN KEY (sectionID) REFERENCES section(sectionID), FOREIGN KEY (achievementID) REFERENCES achievement(achievementID), PRIMARY KEY(sectionID, achievementID))", []);
        //window.alert("11 SQL command");
        tx.executeSql("CREATE TABLE IF NOT EXISTS meetActivity(meetID INTEGER, activityID INTEGER, FOREIGN KEY (meetID) REFERENCES meet(meetID), FOREIGN KEY (activityID) REFERENCES activity(activityID), PRIMARY KEY(meetID, activityID))", []);
        //window.alert("12 SQL command");
        //Possibly delete this next call - confirm it is a copy of the one above
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubActivity(cubID INTEGER, activityID INTEGER, dateCompleted DATETIME, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (activityID) REFERENCES activity(activityID), PRIMARY KEY(cubID, activityID))", []);   
    	//window.alert("13 SQL command");
        
        //insert into cub table
        tx.executeSql("INSERT INTO cub(surname, firstName) VALUES ('smith', 'john')");
        window.alert("cub inserted");
    });
	window.alert("Tables created");
}


/*
//A test to add cub data straight to the database
cubDb.addTest = function(addTest) 
{
  var db = cubDb.db;
  db.transaction(function(tx) {
    tx.executeSql("INSERT INTO cub (surname, firstName, phone1, phone2) VALUES (john, smith, 04419333, 3993388,", [], cubDb.onSuccess, cubDb.onError);
  });
}
*/
/*
//function for the cubDb to create a cub, inputting values into the specified columns in the cub table
cubDb.createCub = function(t) 
{
	cubDb.db.transaction(function(tx) {
        window.alert("CC Transaction initialised")
		//var dob = new Date();
		tx.executeSql("INSERT INTO cub(firstName, surname, dob, guardian1, guardian2, phone1, phone2, dateJoined) VALUES (?,?,?,?,?,?,?,?)",
					  [firstName, surname, dob, guardian1, guardian2, phone1, phone2, dateJoined],
					  cubDb.onSuccess,
					  cubDb.onError);
	});
	window.alert("Cub created");
}
*/
cubDb.onSuccess = function(tx, r) {
    console.log("Your SQLite query was successful!");
}

cubDb.onError = function(tx, e) {
    console.log("SQLite Error: " + e.message);
}
/*
function showRecords() // Function For Retrive data from Database Display records as list 
{ 
    $("#results").html('') 
    cubDb.transaction(function (tx) { 
        tx.executeSql(selectAllStatement, [], function (tx, result) { 
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) { 
                item = dataset.item(i); 
                var linkeditdelete = '<li>' + item['firstName'] + ' , ' + item['surname'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").cubDbend(linkeditdelete); 
            } 
        }); 
    }); 
	//window.alert("Records retrieved");
}
*/

cubDb.selectAllRecords = function(fn) {
    window.alert("select all records called");
    cubDb.db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM cub ORDER BY cubID", [],
                      fn,
                      app.onError);
         window.alert("sql executed");
    });
}

function getAllTheData() {
    window.alert("getAllTheData called");
    var render = function (tx, rs) {
        window.alert("render called");
        // rs contains our SQLite recordset, at this point you can do anything with it
        // in this case we'll just loop through it and output the results to the console
        for (var i = 0; i < rs.rows.length; i++) {
            window.alert("rs iterated");
            window.alert(rs.rows.item(i));
        }
    }

    cubDb.selectAllRecords(render);
}
/*
function displayCubs()
{
    var displayCub = function(row) 
    {
    	return "<li>" + "<div class='cub-list'></div>" + row.cub + "<a class='button delete' href='javascript:void(0);'  onclick='cubDb.deleteCub(" + row.cubID + ");'><p class='cub-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
    }
    
    var disp = function (tx, rs) 
    {
        window.alert("disp function called");
        var rowOutput = "";
        var cubsList = document.getElementById("cubsList");        
       
        for (var i = 0; i < dataset.length; i++) //error unless table populated
        {
       		window.alert("disp function called3");
            rowOutput += displayCub(rs.rows.item(i));
            window.alert("disp function called4");
        }
        cubsList.innerHTML = rowOutput;
        //window.alert("disp function completed");
    }
    
    window.alert("displayCubs called");
    var cubDb = cubDb.db;
    cubDb.transaction(function(tx) { 
        tx.executeSql("SELECT firstName, surname FROM cub", [],
                      disp,
                      cubDb.onError)
    window.alert("cubs are displayed");
    });                       
}
*/

/*
function loadCub(i) // Function for display records which are retrived from database.
{ 
    window.alert("loadCub Called")
    var cubItem = cub.item(i);
    $("#firstName").val((item['firstName']).toString()); 
    $("#surname").val((item['surname']).toString()); 
    $("#cubID").val((item['cubID']).toString()); 
	window.alert("Cub loaded");
}


*/
















/*
//*****The below function needs to be properly defined as it crashes the 
//main.js file*****

//this should be taking the inputs from the index file (referenced as variables such as cubFirstNameTemp). 
//the index.html used to have the cubFirstNameTemp in the input field on the add cub page, but it's been removed
//for the presentation for kathryn

function createCub() 
{
    var cubFirstNameTemp = $('input:text[id=firstName]').val();
    var cubSurnameTemp = $('input:text[id=surname]').val();
	
	THIS LINE IS CAUSING THE JS FILE TO CORRUPT
    db.transaction(function (tx) {
		tx.executeSql(insertStatement, 
						[cubFirstNameTemp, cubSurnameTemp], 
						loadAndReset, on Error); 
	});
}
*/
/*
//This should grab specified columns of the cub table and insert them into a string
function loadCub(i) // Function for display records which are retrived from database.
{ 
    var item = cub.item(i);
    $("#firstName").val((item['firstName']).toString()); 
    $("#surname").val((item['surname']).toString()); 
    $("#cubID").val((item['cubID']).toString()); 
	window.alert("Cub loaded");
}

//This is meant to display all the information from a given table
//I haven't done much to this as I've been trying to get other stuff to work
function showRecords() // Function For Retrive data from Database Display records as list 
{ 
    $("#results").html('') 
    cubDb.transaction(function (tx) { 
        tx.executeSql(selectAllStatement, [], function (tx, result) { 
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) { 
                item = dataset.item(i); 
                var linkeditdelete = '<li>' + item['firstName'] + ' , ' + item['surname'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").cubDbend(linkeditdelete); 
            } 
        }); 
    }); 
	window.alert("Records retrieved");
}

function displayCub()
{
    var cubDb = cubDb.db;
    cubDb.transaction(function (tx) { 
        tx.executeSql() { 
            
            } 
        }); 
    }); 
                     
    window.alert()
}

//This function is designed to designate the buttons on the index.html to interact with database
$(document).ready(function () // Call function when page is ready for load.. 
{
   // initDatabase(); 
    $("#submitButton").click(createCub);  // Register Event Listener when button click. 
    $("#btnUpdate").click(updateCub);
    $("#btnReset").click(deleteCub); 
    $("#btnDrop").click(dropTable);
 
	window.alert("Waiting for events...");
});
*/
-->
