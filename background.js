 
 
var gFilterText = {
	audienceFilterText: "",
	channelFilterText: "",
	installTypeFilterText: "",
	platformFilterText: "",
}

   
chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
    		conditions: [new chrome.declarativeContent.PageStateMatcher({
      			pageUrl: {hostEquals: 'ecs.skype.com'},
    			})
    		],
        	actions: [new chrome.declarativeContent.ShowPageAction()]
  		}]);
		});
});


chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		if(port.name == "portUpdateFilterText") {
			if(message.type == "msgLoadFilterText") {
				port.postMessage({ type: "msgLoadFilterText", payload: gFilterText });
			}
			else if(message.type == "msgUpdateFilterText") {
				if(!message.hasOwnProperty('payload')) {
					return;
				}
				if(message.payload.hasOwnProperty('audienceFilterText')) {
					gFilterText.audienceFilterText = message.payload.audienceFilterText;
				}
				if(message.payload.hasOwnProperty('channelFilterText')) {
					gFilterText.channelFilterText = message.payload.channelFilterText;
				}
				if(message.payload.hasOwnProperty('installTypeFilterText')) {
					gFilterText.installTypeFilterText = message.payload.installTypeFilterText;
				}
				if(message.payload.hasOwnProperty('platformFilterText')) {
					gFilterText.platformFilterText = message.payload.platformFilterText;
				}
			}
		}
	});
});
