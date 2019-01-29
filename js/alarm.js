var alarmHour = 0, alarmMinute = 0, alarmStation = 0, alarmOnOff = false;
var alarmRinging = false;

function loadAlarmSettings(){
	// load recorded time from text file	
	getPersistentSetting("alarmHour", getAlarmHour);
	getPersistentSetting("alarmMinute", getAlarmMinute);
	getPersistentSetting("alarmStation", getAlarmStation);
	getPersistentSetting("alarmOnOff", getAlarmOnOff);
}

// load last hour set
function getAlarmHour(value){
	if(value != undefined)
		alarmHour = parseInt(value);
}

// load last minute set
function getAlarmMinute(value){
	if (value != undefined)
		alarmMinute = parseInt(value);
}

// load last minute set
function getAlarmStation(value){
	if (value != undefined)
		alarmStation = parseInt(value);
}

// load last minute set
function getAlarmOnOff(value){
	if (value == "true")
		alarmOnOff = true;
}

function checkAlarm(){

	var alarmTime = addZero(alarmHour) + ":" + addZero(alarmMinute);
	
	// is it time for alarm to go off?
	if(currTime == alarmTime && alarmRinging == false){
		// Yes!
		alarmRinging = true;
		
		changePlayStopBtn(SHOW_STOP_BTN);
		
		alarmOnOff = false;
		setPersistentSetting("alarmOnOff", false, setCallback);
		
		$('#mainText').text('Riiinnggg!');
		mainTextLink = arrStationLink[alarmStation];
		mainImg.src = arrImageURL[alarmStation];
		mainImg.alt = arrStationName[alarmStation];
	
		Player.URL = arrStreamLink[alarmStation];
		
		led.src = "image/connecting.gif"; // set led to loading
		led.alt = 'connecting';
	}
}