var HOUR_SLIDER = 0, MINUTE_SLIDER = 1;
var SHUTDOWN = 0, SLEEP = 1, HIBERNATE = 2;

var snoozeTabVisited = false;

// this is called when settings is selected
$(function(){

	// create tabs
	$(".tabLink").each(function(){
		$(this).click(function(){
			tabId = $(this).attr('id');
			$(".tabLink").removeClass("activeLink");
			$(this).addClass("activeLink");
			$(".tabcontent").addClass("hide");
			$("#"+tabId+"-1").removeClass("hide");

			// hack because second tab cannot load slider
			if(snoozeTabVisited == false){ 
	
				var tempValue;

				// set hour
				tempValue = parseInt(System.Gadget.document.parentWindow.snoozeHour);

				// value 0 will make slider missing in the beginning
				if(tempValue == 0)
					snoozeHourSlider_obj.setValue(1);
	
				snoozeHourSlider_obj.setValue(tempValue);

				// set minute
				tempValue = parseInt(System.Gadget.document.parentWindow.snoozeMinute);

				if(tempValue == 0)
					snoozeMinuteSlider_obj.setValue(1);

				snoozeMinuteSlider_obj.setValue(tempValue);

				snoozeTabVisited = true;
			}

			return false;	  
		});
	});

	// alarm on off checkbox
	$('#alarmOnOffCB').click(function(){
		changeOnOffText('alarmOnOffText', this.checked);
	});

	// snooze on off checkbox
	$('#snoozeOnOffCB').click(function(){
		changeOnOffText('snoozeOnOffText', this.checked);
	});

	// populate lists
	populateAlarmList();
	populateSnoozeList();
});
  
// this is called just before settings is closed
System.Gadget.onSettingsClosing = function (event)
{
    if (event.closeAction == event.Action.commit)
    {
		saveAlarmSettings();
		saveSnoozeSettings();

		event.cancel = false; 
	}
}

// use this to add 0 to front of time to make double digit
function addZero(i){
	var text = i;
	if(text < 10)
		text = "0" + text;
	
	return text;
}

function setCallback(){
}

function createSlider(slider, sliderInput, savedValue, sliderText, sliderType, canSetValue){

	var sliderOrientation = "horizontal";
	var sliderObject = new Slider(document.getElementById(slider), document.getElementById(sliderInput), sliderOrientation);
	
	// load saved value
	if(canSetValue){ // hack because second tab cannot load tab
		sliderObject.setValue(savedValue);
		$('#' + sliderText.id).text(sliderObject.getValue());
	}
	
	switch(sliderType){
		case HOUR_SLIDER:
			sliderObject.setMaximum(23);
			
			// change text when slider moves
			sliderObject.onchange = function(){
				convertTime(sliderText);
			}
			break;
			
		case MINUTE_SLIDER:
			sliderObject.setMaximum(59);
			convertTime(sliderText);
			
			// change text when slider moves
			sliderObject.onchange = function(){
				convertTime(sliderText);
			}
			break;
	}
	
	return sliderObject;
}

// convert 24 hour format to 12 hour format
function convertTime(timeText){
	var tempHour;
	var tempMinute;
	
	// get alarm hour
	if(timeText.id == "alarmTimeText"){
		if(alarmHourSlider_obj && alarmMinuteSlider_obj){
			tempHour = alarmHourSlider_obj.getValue();
			tempMinute = alarmMinuteSlider_obj.getValue();
		}
		else{
			tempHour = System.Gadget.document.parentWindow.alarmHour;
			tempMinute = System.Gadget.document.parentWindow.alarmMinute;
		}
	}
	// get snooze hour
	else{
		if(snoozeHourSlider_obj && snoozeMinuteSlider_obj){
			tempHour = snoozeHourSlider_obj.getValue();
			tempMinute = snoozeMinuteSlider_obj.getValue();
		}
		else{
			tempHour = System.Gadget.document.parentWindow.snoozeHour;
			tempMinute = System.Gadget.document.parentWindow.snoozeMinute;
		}
	}

	// output time
	
	// before noon, am
	if(tempHour < 12)
		$('#' + timeText.id).text(tempHour + ':' + addZero(tempMinute) + ' AM');
	
	// noon
	else if(tempHour == 12)
		$('#' + timeText.id).text(tempHour + ':' + addZero(tempMinute) + ' noon');
	
	// after noon, pm
	else
		$('#' + timeText.id).text((tempHour - 12) + ':' + addZero(tempMinute) + ' PM');
}

// onclick toggle on off text
function changeOnOffText(onOffText, isChecked){

	if(isChecked){
		$("#"+onOffText).text('On');
		$("#"+onOffText).css({color:"green"});
	}
	else{
		$("#"+onOffText).text('Off');
		$("#"+onOffText).css({color:"red"});
	}
}