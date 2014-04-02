//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);
//Activate :active state on device
document.addEventListener("touchstart", function() {}, false);

var app = {};
var createCub = "INSERT INTO cub(surname, firstName, phone1, phone2, dob, dateJoined, colourSix, headOfSix, secondOfSix, dateInvested, guardian1, guardian2) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
var selectCubNames = "SELECT (firstName, surname) FROM Contacts"; 
var updateCub = "UPDATE cub SET surname = ?, firstname = ?, phone1 = ?, phone2 = ?, dob = ?, dateJoined = ?, colourSix = ?, headOfSix = ?, secondOfSix = ?, dateInvested = ?, guardian1 = ?, guardian2 = ? WHERE id=?"; 
var deletecub = "DELETE FROM cub WHERE id=?"; 
var dropStatement = "DROP TABLE cub";
var db = openDatabase("cubDb", "1.0", "cubDb", 200000);  // Open SQLite Database

cubDb.db = null;
      
app.openDb = function() 
{
   if (window.navigator.simulator === true) {
        // For debugin in simulator fallback to native SQL Lite
        console.log("Use built in SQL Lite");
        cubDb.db = window.openDatabase("cubDb", "1.0", "Cordova Demo", 200000);
    }
    else {
        cubDb.db = window.sqlitePlugin.openDatabase("cubDb");
    }
}
      
app.createTable = function() {
	var db = cubDb.db;
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS cubUser(userID INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(150), password VARCHAR(150), verified TINYINT DEFAULT 0, dateJoined DATETIME)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cub(cubID INTEGER PRIMARY KEY AUTOINCREMENT, surname VARCHAR(60), firstName VARCHAR(60), phone1 VARCHAR(20), phone2 VARCHAR(20), dob DATE, dateJoined DATETIME, colourSix VARCHAR(20), headOfSix TINYINT DEFAULT 0, secondOfSix TINYINT DEFAULT 0, dateInvested DATETIME, guardian1 VARCHAR(150), guardian2 VARCHAR(150))", []);
		tx.executeSql("CREATE TABLE IF NOT EXISTS meet(meetID INTEGER PRIMARY KEY AUTOINCREMENT, nightName VARCHAR(150), venue VARCHAR(150), date DATE, time TIME, leader VARCHAR(150), notes TEXT)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS badge(badgeID INTEGER PRIMARY KEY AUTOINCREMENT, badgeName VARCHAR(150))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS section(sectionID INTEGER PRIMARY KEY AUTOINCREMENT, sectionName VARCHAR(60), compulsory TINYINT DEFAULT 0)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS category(categoryID INTEGER PRIMARY KEY AUTOINCREMENT, categoryName VARCHAR(150))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS activity(activityID INTEGER PRIMARY KEY AUTOINCREMENT, activityName VARCHAR(150))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubActivity(cubID INTEGER, activityID INTEGER, date DATE, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (activityID) REFERENCES activity(activityID))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubBadge(cubID INTEGER, badgeID INTEGER, dateCompleted DATE, completed TINYINT DEFAULT 0, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (badgeID) REFERENCES badge(badgeID), PRIMARY KEY(cubID, badgeID))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubSectionCategory(cubID INTEGER, sectionID INTEGER, categoryID INTEGER, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (sectionID) REFERENCES section(sectionID), FOREIGN KEY (categoryID) REFERENCES category(categoryID) PRIMARY KEY(cubID, sectionID, categoryID))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS sectionActivity(sectionID INTEGER, activityID INTEGER, FOREIGN KEY (sectionID) REFERENCES section(sectionID), FOREIGN KEY (achievementID) REFERENCES achievement(achievementID), PRIMARY KEY(sectionID, achievementID))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS meetActivity(meetID INTEGER, activityID INTEGER, FOREIGN KEY (meetID) REFERENCES meet(meetID), FOREIGN KEY (activityID) REFERENCES activity(activityID), PRIMARY KEY(meetID, activityID))", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS cubActivity(cubID INTEGER, activityID INTEGER, dateCompleted DATETIME, FOREIGN KEY (cubID) REFERENCES cub(cubID), FOREIGN KEY (activityID) REFERENCES activity(activityID), PRIMARY KEY(cubID, activityID))", []);   
    });
}
      
app.createCub = function(createCub) 
{
	var db = cubDb.db;
	db.transaction(function(tx) {
		//var dob = new Date();
		tx.executeSql("INSERT INTO cub(firstName, surname, dob, guardian1, guardian2, phone1, phone2, dateJoined) VALUES (?,?,?,?,?,?,?,?)",
					  [firstName, surname, dob, guardian1, guardian2, phone1, phone2, dateJoined],
					  app.onSuccess,
					  app.onError);
	});
}
            
function createCub() 
{
    var cubFirstNameTemp = $('input:text[id=firstName]').val();
    var cubSurnameTemp = $('input:text[id=surname]').val();
    db.transation(function (tx) {tx.executeSql(insertStatement, [cubFirstNameTemp, cubSurnameTemp], loadAndReset, on Error); });
}

function loadCub(i) // Function for display records which are retrived from database.
{ 
    var item = dataset.item(i);
    $("#firstName").val((item['firstName']).toString()); 
    $("#surname").val((item['surname']).toString()); 
    $("#cubID").val((item['cubID']).toString()); 
}

function showRecords() // Function For Retrive data from Database Display records as list 
{ 
    $("#results").html('') 
    db.transaction(function (tx) { 
        tx.executeSql(selectAllStatement, [], function (tx, result) { 
            dataset = result.rows; 
            for (var i = 0, item = null; i < dataset.length; i++) { 
                item = dataset.item(i); 
                var linkeditdelete = '<li>' + item['firstName'] + ' , ' + item['surname'] + '    ' + '<a href="#" onclick="loadRecord(' + i + ');">edit</a>' + '    ' +
                                            '<a href="#" onclick="deleteRecord(' + item['id'] + ');">delete</a></li>';
                $("#results").append(linkeditdelete); 
            } 
        }); 
    }); 
}

$(document).ready(function () // Call function when page is ready for load.. 
{
;
    $("body").fadeIn(2000); // Fede In Effect when Page Load.. 
    initDatabase(); 
    $("#submitButton").click(createCub);  // Register Event Listener when button click. 
    $("#btnUpdate").click(updateCub);
    $("#btnReset").click(deleteCub); 
    $("#btnDrop").click(dropTable);
 
});