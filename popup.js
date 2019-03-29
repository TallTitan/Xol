

var gUpdateFilterTextPort = undefined;


function SendMessage(message, responseCallback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  		chrome.tabs.sendMessage(tabs[0].id, message, responseCallback);
	});
}


function EnableControls() {
	$('#ecsAudienceFilter').prop('disabled', false);
	$('#ecsChannelFilter').prop('disabled', false);
	$('#ecsInstallTypeFilter').prop('disabled', false);
	$('#ecsPlatformFilter').prop('disabled', false);
	$('#ecsClearAllButton').prop('disabled', false);
}


function ConnectToBackground() {
	gUpdateFilterTextPort = chrome.extension.connect({
		name: "portUpdateFilterText"
 	});
 	
	gUpdateFilterTextPort.onMessage.addListener(function(message) {
		if(!message.hasOwnProperty('type')) {
			return;
		}
		
		if(message.type == "msgLoadFilterText") {
			if(message.hasOwnProperty('payload')) {
				if(message.payload.hasOwnProperty('audienceFilterText')) {
					$('#ecsAudienceFilter').val(message.payload.audienceFilterText);
				}
				if(message.payload.hasOwnProperty('channelFilterText')) {
					$('#ecsChannelFilter').val(message.payload.channelFilterText);
				}
				if(message.payload.hasOwnProperty('installTypeFilterText')) {
					$('#ecsInstallTypeFilter').val(message.payload.installTypeFilterText);
				}
				if(message.payload.hasOwnProperty('platformFilterText')) {
					$('#ecsPlatformFilter').val(message.payload.platformFilterText);
				}
				
				$('.has-clear input[type="text"]').trigger('propertychange');
				OnInputChanged();
			}
		}
	});
	
	gUpdateFilterTextPort.postMessage({ type: "msgLoadFilterText" });
}


function SaveToBackground(message) {
	if(gUpdateFilterTextPort !== undefined) {
		gUpdateFilterTextPort.postMessage(message);
	}
}


function FEcsReady() {
	SendMessage({ messageType: "queryEcsState" }, function(response) {
		if(response !== undefined && response.hasOwnProperty("fEcsReady") && response.fEcsReady) {
			EnableControls();
			ConnectToBackground();
		}
	});
}


function GetFilterTextMessage() {
	return {
		audienceFilterText: $('#ecsAudienceFilter')[0].value,
		channelFilterText: $('#ecsChannelFilter')[0].value,
		installTypeFilterText: $('#ecsInstallTypeFilter')[0].value,
		platformFilterText: $('#ecsPlatformFilter')[0].value
	};
}


function GetFilterTextMessageWithType() {
	var message = GetFilterTextMessage();
	message.messageType = "filterEcsResults";
	
	return message;
}


function OnInputChanged() {
	SendMessage(GetFilterTextMessageWithType(), function() {});
	SaveToBackground({ type: "msgUpdateFilterText", payload: GetFilterTextMessage() });
}


window.onload = function() {
	FEcsReady();
	
	$('#ecsAudienceFilter').on("change paste keyup", function() {
		OnInputChanged();
	});
	$('#ecsChannelFilter').on("change paste keyup", function() {
		OnInputChanged();
	});
	$('#ecsInstallTypeFilter').on("change paste keyup", function() {
		OnInputChanged();
	});
	$('#ecsPlatformFilter').on("change paste keyup", function() {
		OnInputChanged();
	});
	
	$('.has-clear input[type="text"]').on('input propertychange', function() {
		var $this = $(this);
		var visible = Boolean($this.val());
		$this.siblings('.form-control-clear').toggleClass('hidden', !visible);
	}).trigger('propertychange');

	$('.form-control-clear').click(function() {
		$(this).siblings('input[type="text"]').val('')
			.trigger('propertychange').focus();
	
		OnInputChanged();
	});

	$('#ecsClearAllButton').click(function() {
		$('#ecsAudienceFilter').val('');
		$('#ecsChannelFilter').val('');
		$('#ecsInstallTypeFilter').val('');
		$('#ecsPlatformFilter').val('');
		
		$('.has-clear input[type="text"]').trigger('propertychange');
		OnInputChanged();
	});
}



