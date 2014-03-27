document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide();
	localStorageApp = new localStorageApp();
	localStorageApp.run();
}

function localStorageApp() {
}

localStorageApp.prototype = {
	run:function() {
		var that = this;
		document.getElementById("insertVariable").addEventListener("click", function() {
			that._insertVariable.apply(that, arguments);
		});
		document.getElementById("searchVariable").addEventListener("click", function() {
			that._getVariable.apply(that, arguments);
		});
		document.getElementById("clearLocalStorage").addEventListener("click", function() {
			that._clearLocalStorage.apply(that, arguments);
		});
		document.getElementById("removeVariable").addEventListener("click", function() {
			that._removeVariable.apply(that, arguments);
		});
	},
    
    
	_insertVariable:function() {
		var variableNameInput = document.getElementById("variableNameInput"),
		valueInput = document.getElementById("valueInput");
        
		localStorage.setItem(variableNameInput.value, valueInput.value);
		variableNameInput.value = "";
		valueInput.value = "";
	},
    
	_getVariable:function() {
		var getRemoveVariableNameInput = document.getElementById("getRemoveVariableNameInput"),
		result = document.getElementById("result");
		if (localStorage.getItem(getRemoveVariableNameInput.value) != undefined) {
			result.value = localStorage.getItem(getRemoveVariableNameInput.value);
		}
		else {
			result.value = "No such record!"
		}
	},
    
	_removeVariable:function() {
		var searchRemoveNameInput = document.getElementById("getRemoveVariableNameInput"),
		result = document.getElementById("result");
		if (localStorage.getItem(searchRemoveNameInput.value) != undefined) {
			localStorage.removeItem(searchRemoveNameInput.value);
			result.value = "Deleted";
		}
		else {
			result.value = "No such record!";
		}
	},
    
	_clearLocalStorage:function() {
		localStorage.clear();
	}
}