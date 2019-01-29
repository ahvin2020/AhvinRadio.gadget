// document ready
$(function(){
	var stationCount;
	
	// populate station list
	if(document.readyState == "complete"){
		stationCount = populateStationList();
	}
	
	//Get our elements for faster access and set overlay width
	var div = $('div.station_menu'),
				ul = $('ul.list'),
				ulPadding = 15; // unordered list's left margin
				
	var newWidth = 128 * stationCount;

	$('ul.list').css('width', newWidth);
		
	//Get menu width
	var divWidth = div.width();
	
	//Remove scrollbars
	div.css({overflow: 'hidden'});
	
	//Find last image container
	var lastLi = ul.find('li:last-child');

	//When user move mouse over menu
	div.mousemove(function(e){
	
	//As images are loaded ul width increases, so we recalculate it each time
	var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + ulPadding;
	
	var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;
		div.scrollLeft(left);
	});
});

// populate stations for selection
function populateStationList(){
	var arrStationName = System.Gadget.document.parentWindow.arrStationName;
	var arrImageURL = System.Gadget.document.parentWindow.arrImageURL;

	// populate station
	for(index = 0; index<System.Gadget.document.parentWindow.stationCount; index++){
		if(index == System.Gadget.document.parentWindow.currStation)
			continue;
		
		$('.list').append('<li><a href="#" onclick="tuneRadio(' + index + '); return false"><img src=' + arrImageURL[index] + ' width="64" height="64"/>' + 
			'<span>' + arrStationName[index] + '</span></a></li>');
	}
	
	return System.Gadget.document.parentWindow.stationCount-1;
}

// save selected radio
function tuneRadio(index){
	System.Gadget.document.parentWindow.currStation = index;
	System.Gadget.document.parentWindow.updateText();
	
	System.Gadget.document.parentWindow.play();
	
	// close flyout
	System.Gadget.Flyout.show=false;
}