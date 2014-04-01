//Based on http://www.html5rocks.com/en/tutorials/webdatabase/todo/

document.addEventListener("deviceready", init, false);
//Activate :active state on device
document.addEventListener("touchstart", function() {}, false);

var app = {};
app.db = null;
      
app.openDb = function() {
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
      
app.addCub = function(todoText) {
	var db = cubDb.db;
	db.transaction(function(tx) {
		//var dob = new Date();
		tx.executeSql("INSERT INTO cub(surname, firstName, dob) VALUES (?,?,?)",
					  [surname, firstName, dob],
					  app.onSuccess,
					  app.onError);
	});
}
      
app.onError = function(tx, e) {
	console.log("Error: " + e.message);
} 
      
app.onSuccess = function(tx, r) {
	app.refresh();
}
      
app.deleteTodo = function(id) {
	var db = cubDb.db;
	db.transaction(function(tx) {
		tx.executeSql("DELETE FROM cub WHERE ID=?", [id],
					  app.onSuccess,
					  app.onError);
	});
}

app.refresh = function() {
	var renderTodo = function (row) {
		return "<li>" + "<div class='todo-check'></div>" + row.todo + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
	}
    
	var render = function (tx, rs) {
		var rowOutput = "";
		var todoItems = document.getElementById("todoItems");
		for (var i = 0; i < rs.rows.length; i++) {
			rowOutput += renderTodo(rs.rows.item(i));
		}
      
		todoItems.innerHTML = rowOutput;
	}
    
	var db = cubDb.db;
	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM todo", [], 
					  render, 
					  app.onError);
	});
}
      
function init() {
    navigator.splashscreen.hide();
	app.openDb();
	app.createTable();
	app.refresh();
}
      
function addTodo() {
	var todo = document.getElementById("todo");
	app.addTodo(todo.value);
	todo.value = "";
}