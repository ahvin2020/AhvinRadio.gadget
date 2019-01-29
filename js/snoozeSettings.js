var snoozeHourSlider_obj, snoozeMinuteSlider_obj;

// use this to populate snooze list
function populateSnoozeList(){
	snoozeHourSlider_obj = createSlider("snoozeHourSlider", "snoozeHourSlider_input", System.Gadget.document.parentWindow.snoozeHour, snoozeTimeText, HOUR_SLIDER, false);
	snoozeMinuteSlider_obj = createSlider("snoozeMinuteSlider", "snoozeMinuteSlider_input", System.Gadget.document.parentWindow.snoozeMinute, snoozeTimeText, MINUTE_SLIDER, false);
		
	snoozeOnOffCB.checked = System.Gadget.document.parentWindow.snoozeOnOff;
	changeOnOffText("snoozeOnOffText", snoozeOnOffCB.checked);
	
	// populate snooze function list
	snoozeFunctionSelect.add(new Option( "Shutdown", SHUTDOWN ));
	snoozeFunctionSelect.add(new Option( "Sleep", SLEEP ));
	snoozeFunctionSelect.add(new Option( "Hibernate", HIBERNATE ));

	snoozeFunctionSelect.value = System.Gadget.document.parentWindow.snoozeFunction;
}

function saveSnoozeSettings(){
	var snoozeHour = snoozeHourSlider_obj.getValue();
	var snoozeMinute = snoozeMinuteSlider_obj.getValue();
	var snoozeFunction = snoozeFunctionSelect.value;
	var snoozeOnOff = snoozeOnOffCB.checked;
	
	// write back to parent window
	System.Gadget.document.parentWindow.snoozeHour = snoozeHour;
	System.Gadget.document.parentWindow.snoozeMinute = snoozeMinute;
	System.Gadget.document.parentWindow.snoozeFunction = snoozeFunction;
	System.Gadget.document.parentWindow.snoozeOnOff = snoozeOnOff;	
	
	// save recorded time into text file
	setPersistentSetting("snoozeHour", snoozeHour, setCallback);
	setPersistentSetting("snoozeMinute", snoozeMinute, setCallback);
	setPersistentSetting("snoozeFunction", snoozeFunction, setCallback);
	setPersistentSetting("snoozeOnOff", snoozeOnOff, setCallback);
}