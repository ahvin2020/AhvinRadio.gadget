var alarmHourSlider_obj, alarmMinuteSlider_obj;

// use this to populate alarm list
function populateAlarmList(){
	
	alarmHourSlider_obj = createSlider("alarmHourSlider", "alarmHourSlider_input", System.Gadget.document.parentWindow.alarmHour, alarmTimeText, HOUR_SLIDER, true);
	alarmMinuteSlider_obj = createSlider("alarmMinuteSlider", "alarmMinuteSlider_input", System.Gadget.document.parentWindow.alarmMinute, alarmTimeText, MINUTE_SLIDER, true);
		
	alarmOnOffCB.checked = System.Gadget.document.parentWindow.alarmOnOff;
	changeOnOffText("alarmOnOffText", alarmOnOffCB.checked);
	
	// populate alarm station list
	var arrStationName = System.Gadget.document.parentWindow.arrStationName;
	
	for(index=0; index<System.Gadget.document.parentWindow.stationCount; index++){
		alarmStationSelect.add(new Option( arrStationName[index], index ));
	}
	
	alarmStationSelect.value = System.Gadget.document.parentWindow.alarmStation;
}

function saveAlarmSettings(){
	var alarmHour = alarmHourSlider_obj.getValue();
	var alarmMinute = alarmMinuteSlider_obj.getValue();
	var alarmStation = alarmStationSelect.value;
	var alarmOnOff = alarmOnOffCB.checked;
	
	// write back to parent window
	System.Gadget.document.parentWindow.alarmHour = alarmHour;
	System.Gadget.document.parentWindow.alarmMinute = alarmMinute;
	System.Gadget.document.parentWindow.alarmStation = alarmStation;
	System.Gadget.document.parentWindow.alarmOnOff = alarmOnOff;
	
	// save recorded time into text file
	setPersistentSetting("alarmHour", alarmHour, setCallback);
	setPersistentSetting("alarmMinute", alarmMinute, setCallback);
	setPersistentSetting("alarmStation", alarmStation, setCallback);
	setPersistentSetting("alarmOnOff", alarmOnOff, setCallback);
}