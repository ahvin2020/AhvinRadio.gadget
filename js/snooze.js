var SHUTDOWN = 0, SLEEP = 1, HIBERNATE = 2;
var snoozeHour = 0, snoozeMinute = 0, snoozeFunction = 0, snoozeOnOff = false;
var snoozeActivate = false;

function loadSnoozeSettings(){
	// load recorded time from text file	
	getPersistentSetting("snoozeHour", getSnoozeHour);
	getPersistentSetting("snoozeMinute", getSnoozeMinute);
	getPersistentSetting("snoozeFunction", getSnoozeFunction);
	getPersistentSetting("snoozeOnOff", getSnoozeOnOff);
}

// load last hour set
function getSnoozeHour(value){
	if(value != undefined)
		snoozeHour = parseInt(value);
}

// load last minute set
function getSnoozeMinute(value){
	if (value != undefined)
		snoozeMinute = parseInt(value);
}

// load last minute set
function getSnoozeFunction(value){
	if (value != undefined)
		snoozeFunction = parseInt(value);
}

// load last minute set
function getSnoozeOnOff(value){
	if(value == "true")
		snoozeOnOff = true;
}

/* must lower volume till shutdown time, then do snooze function */
function checkSnooze(){

	var snoozeTime = addZero(snoozeHour) + ":" + addZero(snoozeMinute);
	
	// is it time for alarm to go off?
	if(currTime == snoozeTime){
	
		snoozeActivate = true;
		
		changePlayStopBtn(SHOW_STOP_BTN);
		
		snoozeOnOff = false;		
		setPersistentSetting("snoozeOnOff", false, setCallback);
		
		var oShell = new ActiveXObject("WScript.Shell");
		
		// Yes!
		if(snoozeFunction == SHUTDOWN){ // shutdown
			$('#mainText').text('Shutdown in 30s');
			mainTextLink = "";
			setTimeout("shutdownFunction()", 30000);
		}
		else if(snoozeFunction == SLEEP){ // sleep
			$('#mainText').text('Sleep in 30s!');
			mainTextLink = "";
			setTimeout("sleepFunction()", 30000);
		}
		else{ // hibernate
			$('#mainText').text('Hibernate in 30s!');
			mainTextLink = "";
			setTimeout("hibernateFunction()", 30000);
		}
	}
}

function shutdownFunction(){
	if(snoozeActivate){
		snoozeActivate = false;
		var oShell = new ActiveXObject("WScript.Shell");
		oShell.Run("shutdown -s -t 30");	
	}
}

function sleepFunction(){
	if(snoozeActivate){
		snoozeActivate = false;
		var oShell = new ActiveXObject("WScript.Shell");
		oShell.Run("rundll32.exe PowrProf.dll, SetSuspendState Sleep");
	}
}

function hibernateFunction(){
	if(snoozeActivate){
		snoozeActivate = false;
		var oShell = new ActiveXObject("WScript.Shell");
		oShell.Run("rundll32.exe PowrProf.dll, SetSuspendState Hibernate");
	}
}