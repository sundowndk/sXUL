attach : function ()
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Attach", "data", "POST", false);	
	request.send ();
	
	var result = request.respons ()["value"];
								
	return result;
},
	
detach : function (id)
{
	var content = new Array ();
	content["eventlistenerid"] = id;

	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Detach", "data", "POST", false);		
	request.send (content);			
},

update : function (attributes)
{
	if (!attributes)
		attributes = new Array ();
	
	if (!attributes.id)
		throw "No ID given, cannot update eventListener";
				
	var content = new Array ();			
							
	content["eventlistenerid"] = attributes.id;
	
	if (attributes.eventId != null)
	{
		content["eventid"] = attributes.eventId;
	}
	
	if (attributes.eventData != null)
	{
		content["eventdata"] = attributes.eventData;
	}		

	var onDone = 	function (respons)
					{						
						if (attributes.onDone)
						{
							attributes.onDone (respons["sxul.events"]);
						}
					};
		
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.EventListener.Update", "data", "POST", true);			
	request.onLoaded (onDone);
	request.send (content);													
}
