//Event listener to call init() once the device is ready and has loaded
document.addEventListener("deviceready", init, false);

//Global variables
var app = {};
app.db = null;

//This function creates the database
app.openDb = function() 
{
    /*if (window.sqlitePlugin !== undefined) 
    {
        app.db = window.sqlitePlugin.openDatabase("cubDb");
        //window.alert("SQLite");
    } 
    else 
    {
        app.db = window.openDatabase("cubDb", "1.0", "Cordova Demo", 200000);
        //window.alert("Cordova");
    */
    
	//Temporary fix to allow to run on device.
    app.db = window.openDatabase("cubDb2", "1.0", "Cordova", 200000);
}

//When the device is initialised, run these functions
function init() {
    //-----Create the database-----//
    app.openDb();
    
    //-----Create the Cub Information-----//
    //app.clearData();
    app.createTable();
    populateCubsList();
    populateRollCall();

    //-----Create User Information-----//
    //Comment out this line when you are happy to make the user data permanent
    //app.clearUserData();
    app.createLoginTable();
    
    //-----Create Activity Information-----//
    app.clearActivityData();
    app.createActivityTable();
    app.insertActivityInfo();
    
    populateCategoriesList();
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
    window.alert("SQLite Error: " + e.message);
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

function populateRollCall(){
	var render = function (tx, rs) 
    {
        //window.alert("Populated called");
        $('#cubsRoll').empty();
        //var len = rs.rows.length;
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            $('#cubsRoll').append('<li id = "cubID' +row['cubID']+'"><div class="checkboxleft"><input type="checkbox" id="rollCheck" class="checkbox"/></div><h3 class="pushRight">'+row['firstName']+' '+row['surname']+' '+row['cubID']+'</h3><div class="select Right"></div></div></li>');
        }
        //window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    app.selectAllRecords(render);
}


function populateCubsList(){
	var render = function (tx, rs) 
    {
        //window.alert("Populated called");
        $('#cubsList').empty();
        //var len = rs.rows.length;
        //window.alert("SQLite Table: " + len + " rows found.");
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            $('#cubsList').append('<li id = "cubID' +row['cubID']+'"><a id = '+ row['cubID'] +' onclick="editCub(id)"><h3 class="pushRight">'+row['firstName']+' '+row['surname']+' '+row['cubID']+'</h3><div class="select Right"></div></div></a></li>');
        }
        //window.alert("Attempted to store the query result in an array and display in listView() style");
	}
    app.selectAllRecords(render);
}

function editCub(id)
{
	//window.alert(id);
    $.mobile.changePage("#edit-cub", {
            	transition: "slide",
            	reverse: false
        	});

    //Change header to say 
    
    //Fill the existing inputs
    var render = function (tx, rs)
                {
                	var row = rs.rows.item(0);
                	$("#eFirstName").val(row['firstName']);
                    $("#eLastName").val(row['surname']);
                    $("#eDob").val(row['dob']);
                    $("#eGuardian1").val(row['guardian1']);
                    $("#ePhone1").val(row['phone1']);
                    $("#eGuardian2").val(row['guardian2']);
                    $("#ePhone2").val(row['phone2']);
                    $("#eAddress").val(row['address']);
                    $("#eCubLevel").val(row['cubLevel']);
                    $("#eCubPosition").val(row['cubPosition']);
                    $("#eCubColor").val(row['cubColor']);
                    $("#eDateJoined").val(row['dateJoined']);
                    $("#eDateInvested").val(row['dateInvested']);
            	}
    app.getThisCub(render, id);
    $("#saveChanges").on("click", function(event){
  		app.editRecord($("#eFirstName").val(), $("#eLastName").val(), $("#eDob").val(), $("#eGuardian1").val(), $("#ePhone1").val(), $("#eGuardian2").val(), $("#ePhone2").val(), $("#eAddress").val(), $("#eCubLevel").val(), $("#eCubPosition").val(), $("#eCubColor").val(), $("eDateJoined").val(), $("#eDateInvested").val(), id);
	});
    /*populateCubsList();
    $('#cubsList').listview('refresh');*/
}


app.getThisCub = function(fn, id)
{
    //INSERT CODE TO MAKE IT GET THE INFO FROM THE ROWS
    //APRA'S ATTEMPT
    //window.alert("Inside getThisCub(): " +id);
    app.db.transaction(function(tx) 
		{
            //window.alert("Inside the transaction");
            tx.executeSql("SELECT * FROM cubTable WHERE cubID = ?", [id], 
                         fn, app.onError);
            //window.alert("Transaction complete");
        });
}
                 
function goToAddCub()
{
    $.mobile.changePage("#new-cub", {
            	transition: "slide",
            	reverse: false
        	});
    
    //null all fields
    $("#firstName").val("");
    $("#lastName").val("");
    $("#dob").val("");
    $("#guardian1").val("");
    $("#phone1").val("");
    $("#guardian2").val("");
    $("#phone2").val("");
    $("#address").val("");
    $("#cubLevel").val("");
    $("#cubPosition").val("");
    $("#cubColor").val("");
    $("#dateJoined").val("");
    $("#dateInvested").val("");
}

//Save Changes to cubs details

app.editRecord = function(eFirstName, eLastName, eDob, eGuardian1, ePhone1, eGuardian2, ePhone2, eAddress, eCubLevel, eCubPosition, eCubColor, eDateJoined, eDateInvested, id) 
{
    //window.alert("Insert called" + id + "" +firstName);
    app.db.transaction(function(tx) 
		{
        	tx.executeSql("UPDATE cubTable SET firstName = ?, surname = ?, dob = ?, guardian1 = ?, phone1 = ?, guardian2 = ?, phone2 = ?, address = ?, cubLevel = ?, cubPosition = ?, colourSix = ?, "+
                          "dateJoined = ?, dateInvested = ? WHERE cubID = ?",
				[eFirstName, eLastName, eDob, eGuardian1, ePhone1, eGuardian2, ePhone2, eAddress, eCubLevel, eCubPosition, eCubColor, eDateJoined, eDateInvested, id]);
    	}
       		//window.alert("updated cub details" + )
	)
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
        	tx.executeSql("CREATE TABLE IF NOT EXISTS activityTable (activityID INTEGER PRIMARY KEY ASC, activityName TEXT, categoryName TEXT, categoryLevel TEXT)", [], 
                          app.onSuccess, app.onError);
        }
	);
}

app.insertActivityInfo = function(fn)
{
    app.db.transaction(function(tx)
        {  
           //Bronze below
                //Health Below
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 1', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 2', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 3', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 1', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 2', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Infections', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 1', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 2', 'Health and First Aid', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                
                //Safety Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Buddy System', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Road', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Water 1', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Water 2', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 1', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 2', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire 1', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire 2', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal', 'Safety', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Ropes Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 1', 'Ropes', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 2', 'Ropes', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Use of Knots', 'Ropes', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Care of Ropes', 'Ropes', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Outdoor Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 1', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 2', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking 1', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking 2', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire Lighting 1', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire Lighting 2', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Cooking', 'Outdoor Scouting', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                
                //Our Cub Scout Traditions Below         
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Jungle Books 1','Our Cub Scout Traditions', 'Bronze');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Jungle Books 2','Our Cub Scout Traditions', 'Bronze');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 1','Our Cub Scout Traditions', 'Bronze');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 2','Our Cub Scout Traditions', 'Bronze');", [],
                                         app.onSuccess, app.onError)
                // Symbols Below           
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flags','Symbols of Australia', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Emblems','Symbols of Australia', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Promise Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Duty to Your God','Promise and Law', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law 1','Promise and Law', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law 2','Promise and Law', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law 3','Promise and Law', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Good Turn and Service','Promise and Law', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Fitness Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 1','Fitness', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 2','Fitness', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Athletic Skills','Fitness', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Strength and Stamina','Fitness', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //People Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Indigenous Australians','People and Cultures', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('International Cultures','People and Cultures', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 1','People and Cultures', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 2','People and Cultures', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Scientific Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Biology','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Geology','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Physics 1','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Physics 2','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 1','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 2','Scientific Discovery', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Natural Environment             
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 1','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 2','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 1','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 2','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Habitat Destruction 1','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Habitat Destruction 2','The Natural Environment', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Self Expression Below            
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Performing Arts','Self Expression', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Visual Arts','Self Expression', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Creative Writing','Self Expression', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Music','Self Expression', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Handcraft Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Make an Item','Handcraft', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                //Your Community Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 1','Your Community', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 2','Your Community', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Community 1','Your Community', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Community 2','Your Community', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Organisation','Your Community', 'Bronze');", [],
                                         app.onSuccess, app.onError);
                
         //Silver Below
                
                //Health Below
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 1', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 2', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 3', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 4', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 1', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 2', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 3', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Infections', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 1', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 2', 'Health and First Aid', 'Silver');", [],
                                         app.onSuccess, app.onError);
                
                //Safety Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Buddy System', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Road', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Water 1', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Water 2', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 1', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 2', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire 1', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire 2', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal', 'Safety', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Ropes Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 1', 'Ropes', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 2', 'Ropes', 'Silver');", [],
                                         app.onSuccess, app.onError);      
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 3', 'Ropes', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Use of Knots', 'Ropes', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Care of Ropes', 'Ropes', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Outdoor Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 1', 'Outdoor Scouting', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 2', 'Outdoor Scouting', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking', 'Outdoor Scouting', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire Lighting', 'Outdoor Scouting', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Cooking', 'Outdoor Scouting', 'Silver');", [],
                                         app.onSuccess, app.onError);
                
                //Our Cub Scout Traditions Below         
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Jungle Books 1','Our Cub Scout Traditions', 'Silver');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Jungle Books 2','Our Cub Scout Traditions', 'Silver');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 1','Our Cub Scout Traditions', 'Silver');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 2','Our Cub Scout Traditions', 'Silver');", [],
                                         app.onSuccess, app.onError)
                // Symbols Below           
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flags','Symbols of Australia', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Emblems','Symbols of Australia', 'Silver');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flora and Fauna','Symbols of Australia', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Promise Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Duty to Your God','Promise and Law', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law','Promise and Law', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Good Turn and Service','Promise and Law', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Fitness Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 1','Fitness', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 2','Fitness', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Athletic Skills','Fitness', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Strength and Stamina','Fitness', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //People Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Indigenous Australians','People and Cultures', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('International Cultures','People and Cultures', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 1','People and Cultures', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 2','People and Cultures', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Scientific Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Biology 1','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Biology 2','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Geology','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Physics 1','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Physics 2','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 1','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 2','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 3','Scientific Discovery', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Natural Environment             
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 1','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 2','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 1','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 2','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 3','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Habitat Destruction 1','The Natural Environment', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Self Expression Below            
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Performing Arts','Self Expression', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Visual Arts','Self Expression', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Creative Writing','Self Expression', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Music','Self Expression', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Handcraft Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Make an Item 1','Handcraft', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Make an Item 2','Handcraft', 'Silver');", [],
                                         app.onSuccess, app.onError);
                //Your Community Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 1','Your Community', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 2','Your Community', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Community 1','Your Community', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Community 2','Your Community', 'Silver');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Organisation','Your Community', 'Silver');", [],
                                         app.onSuccess, app.onError);
                
         //Gold Below
                //Health Below
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 1', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal Health 2', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 1', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 2', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 3', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 4', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Basic First Aid 5', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Infections 1', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Infections 2', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 1', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 2', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Adult Help 3', 'Health and First Aid', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                //Safety Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Buddy System', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 1', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home 2', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Road', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Water', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 1', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Bush 2', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Personal', 'Safety', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Ropes Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 1', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 2', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 3', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots 4', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots Gadget', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Tying Knots Teach Reef Knot', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Use of Knots', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Care of Ropes', 'Ropes', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Outdoor Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 1', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 2', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Compass and Navigation 3', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking 1', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking 2', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Maps and Hiking 3', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Fire Lighting', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Outdoor Cooking', 'Outdoor Scouting', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                //Our Cub Scout Traditions Below         
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('The Jungle Books','Our Cub Scout Traditions', 'Gold');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 1','Our Cub Scout Traditions', 'Gold');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 2','Our Cub Scout Traditions', 'Gold');", [],
                                         app.onSuccess, app.onError)
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting History 3','Our Cub Scout Traditions', 'Gold');", [],
                                         app.onSuccess, app.onError)
                // Symbols Below           
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flags 1','Symbols of Australia', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flags 2','Symbols of Australia', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Emblems','Symbols of Australia', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Flora and Fauna','Symbols of Australia', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Promise Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Duty to Your God','Promise and Law', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law 1','Promise and Law', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Promise and Law 2','Promise and Law', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Good Turn and Service','Promise and Law', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Fitness Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 1','Fitness', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Ball Skills 2','Fitness', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Athletic Skills','Fitness', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Strength and Stamina','Fitness', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //People Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Indigenous Australians','People and Cultures', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('International Cultures 1','People and Cultures', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('International Cultures 2','People and Cultures', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 1','People and Cultures', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Scouting 2','People and Cultures', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Scientific Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Biology','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Chemistry 1','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Chemistry 2','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Geology 1','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Geology 2','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Physics','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 1','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 2','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Estimations 3','Scientific Discovery', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Natural Environment             
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 1','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Recycling 2','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 1','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 2','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Pollution 3','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Habitat Destruction','The Natural Environment', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Self Expression Below            
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Performing Arts','Self Expression', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Visual Arts','Self Expression', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Creative Writing','Self Expression', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Music','Self Expression', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Handcraft Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Make an Item 1','Handcraft', 'Gold');", [],
                                         app.onSuccess, app.onError);
                
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Make an Item 2','Handcraft', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //Your Community Below            
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Home','Your Community', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Community','Your Community', 'Gold');", [],
                                         app.onSuccess, app.onError);
                tx.executeSql("INSERT INTO activityTable (activityName, categoryName, categoryLevel) VALUES ('Local Organisation','Your Community', 'Gold');", [],
                                         app.onSuccess, app.onError);
                //END LIST
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

app.getCategories = function(fn)
{
    app.db.transaction(function(tx)
        {
         	tx.executeSql("SELECT DISTINCT categoryName FROM activityTable ORDER By categoryName",[],
                         fn,
                         app.onError);                  
        }
    );
}
//This now makes the categories in the activitylists
function populateCategoriesList(){
    var render = function (tx,rs)
    {
        $('#activityListBronze').empty();
        $('#activityListSilver').empty();
        $('#activityListGold').empty();
    
    
    //Fills all Lists with Categories
    for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            //id must not contain spaces
            var long = row['categoryName'];
            var shortcat = long.substring(0,3);
            
            //Hardcoded due to using single table
            $('#activityListBronze').append('<div data-role="collapsible"><h2>'+row['categoryName']+'</h2><ul id="catB'+shortcat+'" data-role="listview"></ul></div>');
       		$('#activityListSilver').append('<div data-role="collapsible"><h2>'+row['categoryName']+'</h2><ul id="catS'+shortcat+'" data-role="listview"></ul></div>');
			$('#activityListGold').append('<div data-role="collapsible"><h2>'+row['categoryName']+'</h2><ul id="catG'+shortcat+'" data-role="listview"></ul></div>');

        }
    }
    app.getCategories(render);
}
//This now fills after the categories have been made
function populateActivityList(){
    //window.alert("populateActivityList function entered");
	var render = function (tx, rs)       
    {
        //window.alert("SQLite Table: " + rs.rows.length + " rows found.");
       
        //FILLS all lists
        for (var i = 0; i < rs.rows.length; i++) 
        {
            var row = rs.rows.item(i);
            //id must not contain spaces
            var long = row['categoryName'];
            var shortcat = long.substring(0,3);
            
            //needs an if statement to filter between bronze/silver/gold
            if(row['categoryLevel']=='Bronze')
            {
            $('#catB' + shortcat).append('<li><div class="checkBoxLeft"><input type="checkbox" class = "checkAct" id = '+row['activityID']+'/></div><h3 class="pushRight">'+row['activityName']+'</h3></li>');
            }
            else if(row['categoryLevel']=='Silver')
            {
            $('#catS' + shortcat).append('<li><div class="checkBoxLeft"><input type="checkbox" class = "checkAct" id = '+row['activityID']+'/></div><h3 class="pushRight">'+row['activityName']+'</h3></li>');
            }
            else if(row['categoryLevel']=='Gold')
            {
            $('#catG' + shortcat).append('<li><div class="checkBoxLeft"><input type="checkbox" class = "checkAct" id = '+row['activityID']+'/></div><h3 class="pushRight">'+row['activityName']+'</h3></li>');
            }
            
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
    var shortbob = bob.substring(0,15);
    //window.alert(bob);
    
   $.mobile.changePage("#activity-list-bronze", {
            	transition: "slide",
            	reverse: false
        	});
    
    $("#bronzeHead").text("Bronze Activities " + shortbob);
    $("#silverHead").text("Silver Activities " + shortbob);
    $("#goldHead").text("Gold Activities " + shortbob);
    $("#confirmHead").text("Gold Activities " + shortbob);
    
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
    var shortbob = bob.substring(0,15);
  
    //window.alert(bob);
    //populateRollCall();
    
    $.mobile.changePage("#rollCall", {
            	transition: "slide",
            	reverse: false
        	});
    
    
    $("#rollHead").text("Roll Call " + shortbob);
    //$('#rollCall').listview('refresh');

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
     
    
    
    