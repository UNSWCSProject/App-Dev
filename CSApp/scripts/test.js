/*document.addEventListener("deviceready", init, false);

var app = {};
app.db = null;

app.openDb = function() {
    if (window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("My Database", "1.0", "SQLite Demo", 200000);
        window.alert("SQLite!");
    } else {
        // For debugging in simulator fallback to native SQL Lite
        app.db = window.openDatabase("My Database", "1.0", "Cordova Demo", 200000);
        window.alert("Cordova!");
    }
}

function init() {
    app.openDb();
    app.createTable();
    app.insertRecord("Patrick");
    getAllTheData();
}

app.createTable = function() {
    app.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS SampleTable (id INTEGER PRIMARY KEY ASC, text_sample TEXT, date_sample DATETIME)", []);
    });
}

app.insertRecord = function(t) {
    app.db.transaction(function(tx) {
        var cDate = new Date();
        tx.executeSql("INSERT INTO SampleTable(text_sample, date_sample) VALUES (?,?)",
                      [t, cDate],
                      app.onSuccess,
                      app.onError);
    });
}

app.selectAllRecords = function(fn) {
    app.db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM SampleTable ORDER BY id", [],
                      fn,
                      app.onSelectError);
    });
}

function getAllTheData() {
    var render = function (tx, rs) {
        // rs contains our SQLite recordset, at this point you can do anything with it
        // in this case we'll just loop through it and output the results to the console
        for (var i = 0; i < rs.rows.length; i++) {
            console.log(rs.rows.item(i));
            var row = rs.rows.item(i);
            window.alert("Value: "+row['text_sample']);
        }
    }

    app.selectAllRecords(render);
}

app.onSuccess = function(tx, r) {
    console.log("Your SQLite query was successful!");
    window.alert("Your SQLite query was successful!");
}

app.onError = function(tx, e) {
    console.log("SQLite Error: " + e.message);
    window.alert("SQLite Error: " + e.message);
}

app.onSelectError = function(tx, e) {
    console.log("SQLite Error: " + e.message);
    window.alert("Select() SQLite Error: " + e.message);
}*/