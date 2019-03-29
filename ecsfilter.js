

var gVisibleState = [];


function EnsureVisibleState() {
	if(gVisibleState.length > 0)
		return;
		
	var element = $('tr[id=Audience]').last()[0]; // use #Audience for now.
	
	for(var i = 0; i < element.childElementCount; i++) {
		gVisibleState.push({ 
			audience:true, 
			channel:true, 
			installType:true, 
			platform:true
		});
	}
}


function FEcsReady() {
	if($('tr[id=Audience]').length == 0)
		return false;
		
	EnsureVisibleState();
	
	var element = $('tr[id=Audience]').last()[0];
	return element.childElementCount > 0;
}


function FVisible(visibleStateIndex) {
	var keys = Object.keys(gVisibleState[visibleStateIndex]);
	var fVisible = true;
	
	for(var i = 0; i < keys.length; i++) {
		fVisible &= gVisibleState[visibleStateIndex][keys[i]];
	}
	
	return fVisible;
}


function Filter(element, filterString, visibleStateKey) {
	for(var i = 0; i < element.childElementCount; i++) {
		child = element.children[i];
		
		var stringFormat = '.unlockedHeaderSection th:nth-child({0}),.unlockedHeaderSection td:nth-child({1}),.otherColumnsSection td:nth-child({2})';
		var jQueryString = stringFormat.replace('{0}', i + 1);
		jQueryString = jQueryString.replace('{1}', i + 1);
		jQueryString = jQueryString.replace('{2}', i + 1);
		
		if(filterString.length > 0 && child.innerText.toLowerCase().indexOf(filterString.toLowerCase()) == -1) {
			gVisibleState[i][visibleStateKey] = false;
		}
		else {
			gVisibleState[i][visibleStateKey] = true;
		}
		
		if(FVisible(i) && $(jQueryString).is(':hidden')) {
			$(jQueryString).show();
		}
		else if(!FVisible(i) && !$(jQueryString).is(':hidden')) {
			$(jQueryString).hide();
		}
	}
}


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (!request.hasOwnProperty('messageType')) {
			return;
		}
		
		if(request.messageType == "queryEcsState") {
			sendResponse({ fEcsReady: FEcsReady() });
		}
		else if(request.messageType == "filterEcsResults") {
			if(request.hasOwnProperty('audienceFilterText')) {
				Filter($('tr[id=Audience]').last()[0], request.audienceFilterText, 'audience');
			}
			if(request.hasOwnProperty('channelFilterText')) {
				Filter($('tr[id=Channel]').last()[0], request.channelFilterText, 'channel');
			}
			if(request.hasOwnProperty('installTypeFilterText')) {
				Filter($('tr[id=InstallType]').last()[0], request.installTypeFilterText, 'installType');
			}
			if(request.hasOwnProperty('platformFilterText')) {
				Filter($('tr[id=Platform]').last()[0], request.platformFilterText, 'platform');
			}
			
			sendResponse();
		}
});


