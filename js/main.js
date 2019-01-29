/*
References:
MC Radio Gadget   			: http://gallery.live.com/liveitemdetail.aspx?bt=1&li=364690c1-1b50-4cbc-b08b-1c99321ec0fe
Scroll Menu Jquery		    : http://valums.com/scroll-menu-jquery/
Populating list dynamically : http://stackoverflow.com/questions/2200231/populating-a-list-dynamically-jquery
Create tab					: http://www.developnew.com/resources/how-to-create-tab-with-javascript.php
Slider						: http://webfx.eae.net/dhtml/slider/slider.html
Auto update					: http://www.innovatewithgadgets.com/2009/02/auto-update-for-vista-gadget.html
*/

var allowUpdate = true; // do we allow update of stations?
var currStation = 0; // what is the current station?
var arrStationName = new Array(); // what are the stations names?
var arrStationLink = new Array(); // what are the station links?
var arrStreamLink = new Array(); // what are the streaming links?
var arrImageURL = new Array(); 	// where are the station images?
var stationCount; // how many stations are there?

var SHOW_STOP_BTN = true;
var SHOW_PLAY_BTN = false; // determines whether to hide play or stop button
var currentPlayStopStatus; // play or stop, which button is being shown now?

var currTime; // current cpu time

var mainTextLink = "http://ahvin2020.netne.net/programs/radio-gadget/";
var updateGadgetXML = "http://ahvin2020.netne.net/archive/programs/LucahRadio.gadget/gadget.xml";

// this is called when radio is turned on
$(function(){
	checkUpdate(); // check for updates
	loadStation(); // loads list of stations
	Player.settings.setMode("loop", true);
	getPersistentSetting("currStation", loadSavedStation); // loads last radio tuned in
	
	led.src = "image/normal.gif"; // set led to ready
	led.alt = 'ready'; // displays ready

	loadAlarmSettings();
	loadSnoozeSettings();
	setTimeout('updateTime()', 2000); // update time 2 seconds later

	changePlayStopBtn(SHOW_PLAY_BTN);

	// image event
	$('#mainImg').click(function(){
		if(mainTextLink != "")
			window.open(mainTextLink);
	});

	// stop button
	$('#playStopBtn').bind({
		click: function(){
			if(currentPlayStopStatus == SHOW_PLAY_BTN)
				play();
			else
				stop();
		},
		'mouseenter mouseup': function(){
			if(currentPlayStopStatus == SHOW_PLAY_BTN)
				this.src = 'image/btnPlayHover.gif';
			else
				this.src = 'image/btnStopHover.gif';
		},
		'mousedown mouseleave': function(){
			if(currentPlayStopStatus == SHOW_PLAY_BTN)
				this.src = 'image/btnPlay.gif';
			else
				this.src = 'image/btnStop.gif';
		}
	});

	// tune button
	$('#tuneBtn').bind({
		click: function(){
			chooseStation();
		},
		'mouseenter mouseup': function(){
			this.src = 'image/btnTuneHover.gif';
		},
		'mousedown mouseleave': function(){
			this.src = 'image/btnTune.gif';
		}
	});

	/*** player events ***/
	// current item change
	Player.attachEvent('currentItemChange', onCurrentItemChange);

	// play state change
	Player.attachEvent('PlayStateChange', onPlayStateChange);
		
	// error
	Player.attachEvent('Error', onError);
});

/**** event listeners ****/

// write in last played station
function onCurrentItemChange(){
	if (allowUpdate){
        allowUpdate = false;
        setPersistentSetting( "currStation", currStation, setCallback );    
        allowUpdate = true;
    }  
}

function onPlayStateChange(newState){
	switch(newState){
		case 3: // playing
			onPlaying();
			break;
		case 6: // buffering
			onBuffering();
			break;
	}
}

// changes status led to error
function onError(){
	led.src = "image/error.gif";
	led.alt = 'error';
	
	changePlayStopBtn(SHOW_PLAY_BTN);
}

/**** end of event listeners ****/

// checks whether a newer version is available
function checkUpdate(){
	
	try{
		if(window.ActiveXObject){
			var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.load(updateGadgetXML);
			var gadget = xmlDoc.selectNodes("gadget");
			var version = gadget[0].childNodes[2].text;
			var updateURL = gadget[0].childNodes[3].childNodes[0].getAttribute("url");
			// release memory
			xmlDoc = null;
			
			// is newer version available?
			if(version > System.Gadget.version)
				// yes! notify user
				$('#mainText').text("Update available");
		}
	}catch(e){
		return;
	}
}

// reads in radio stations from stations.xml
function loadStation(){
	try{
		if(window.ActiveXObject){
			// load xml
			var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.load("stations.xml");
			
			var loadedStations = xmlDoc.getElementsByTagName('station');
			stationCount = loadedStations.length;
			
			// read station stuff from xml
			for(i=0; i<stationCount; i++){
				arrStationName[i] = loadedStations[i].childNodes.item(0).text.substring(0, 15); // station name
				arrStationLink[i] = loadedStations[i].childNodes.item(1).text; // station link
				arrStreamLink[i] = loadedStations[i].childNodes.item(2).text; // station stream link
				arrImageURL[i] = loadedStations[i].childNodes.item(3).text;	// station image url
			}
			
			// release memory
			xmlDoc = null;
		}
	}catch(e){
		return;
	}
}

// loads last radio tuned in
function loadSavedStation(value){
	if (value != undefined)
		currStation = parseInt(value);
	else
		currStation = 0;
}

// updates current time
function updateTime(){
	var alarmSnoozeIsOn = false; // is alarm or snooze on?
	var date = new Date();
	currTime = addZero(date.getHours()) + ":" + addZero(date.getMinutes());

	// is alarm on?
	if(alarmOnOff){
		checkAlarm();
		alarmSnoozeIsOn = true;
	}
		
	// is snooze on?
	if(snoozeOnOff){
		checkSnooze();
		alarmSnoozeIsOn = true;
	}
		
	// if either is on, we set timeout
	if(alarmSnoozeIsOn){
		var timeoutTime = (60 - date.getSeconds()) * 1000;
		setTimeout('updateTime()', timeoutTime); // update time every 60 seconds	
	}
}

// use this to add 0 to front of time to make double digit
function addZero(i){
	var text = i;
	if(text < 10)
		text = "0" + text;
	
	return text;
}

// stop button
function stop(){
	Player.controls.stop(); // stop radio
	
	led.src = "image/normal.gif"; // set led to ready
	led.alt = 'ready'; // display ready
	
	changePlayStopBtn(SHOW_PLAY_BTN);
	
	// turn off alarm if ringing
	if(alarmRinging){
		alarmRinging = false;
		$('#mainText').text('Alarm stopped');
		mainTextLink = "";
		
		// return back to original station in 2 seconds
		setTimeout('updateText()', 1500);
	}
	
	// stop snooze if activated
	if(snoozeActivate){
		snoozeActivate = false;
		$('#mainText').text('Snooze stopped');
		mainTextLink = "";
		
		// return back to original station in 1.5 seconds
		setTimeout('updateText()', 1500);
	}
}

// play button
function play(){
	updateText();
	Player.URL = arrStreamLink[currStation];
	
	onBuffering();
}

// next button
function chooseStation(){
	if (System.Gadget.Flyout.show==false) {
        System.Gadget.Flyout.file = "flyout.html";
        System.Gadget.Flyout.show=true;
        //System.Gadget.Flyout.onHide = blankFunction;
    } else 
        System.Gadget.Flyout.show=false;
}

// this is called when player presses left/right to update display
function updateText(){
	$('#mainText').text(arrStationName[currStation]);
	mainTextLink = arrStationLink[currStation];
	mainImg.src = arrImageURL[currStation];
	mainImg.alt = arrStationName[currStation];
}

// changes status led to playing
function onPlaying(){
	led.src = "image/playing.gif";
	led.alt = 'playing';
	
	changePlayStopBtn(SHOW_STOP_BTN);
}

// changes status led to connecting
function onBuffering(){
	led.src = "image/connecting.gif";
	led.alt = 'connecting';
	
	changePlayStopBtn(SHOW_STOP_BTN);
}

// this is called when after settings is closed, use this to set alarm time
function settingsClosed(event){
	if(event.closeAction == event.Action.commit){
		$('#mainText').text('Settings updated');
		mainTextLink = "";
		
		setTimeout("updateText()", 1500);
		setTimeout("updateTime()", 2000);
	}
}

// change playback buttons depending whether radio is in effect
function changePlayStopBtn(radioInEffect){
	
	// change status
	currentPlayStopStatus = radioInEffect;
	
	if(currentPlayStopStatus == SHOW_PLAY_BTN)
		playStopBtn.src = 'image/btnPlay.gif';
	else
		playStopBtn.src = 'image/btnStop.gif';
}

function setCallback(){
}

System.Gadget.settingsUI = "settings.html";
System.Gadget.onSettingsClosed = settingsClosed;