id : null,
timer : null,


attach : function ()
{
	var request = new sorentoLib.AJAJ.request ({url: didius.runtime.ajaxUrl, method: "sXUL.EventListener.Attach"});	
	request.send ();
	
	var result = request.respons ()["result"];
	
	sXUL.eventListener.id = result;
	
	setInterval (function () {sXUL.eventListener.update ({id: sXUL.eventListener.id}) }, 3000);			

	
	//var events = sXUL.eventListener.update ({id: app.session.eventListenerId, onDone: onDone});
								
	return result;
},
	
detach : function (id)
{
	var content = new Array ();
	content["eventlistenerid"] = id;

	var request = new sorentoLib.AJAJ.request ({url: didius.runtime.ajaxUrl, method: "sXUL.EventListener.Detach", data: content});		
	request.send (content);			
},

update : function (attributes)
{
	if (!attributes)
		attributes = new Array ();
	
	if (!attributes.id)
		throw "No ID given, cannot update eventListener";
		
	//attributes.id = sXUL.eventListener.id;
				
	var content = {};
							
	content["eventlistenerid"] = attributes.id;
	
	if (attributes.eventId != null)
	{
		content["eventid"] = attributes.eventId;
	}
	
	if (attributes.eventData != null)
	{
		var test = {};
	
		for (index in attributes.eventData)
		{
			test[index] = attributes.eventData[index];
		}
	
		content["eventdata"] = test;
	}		

	var onDone = 	function (respons)
					{	
						var events = respons["sxul.events"];
															
						
							for (index in events)
							{
								events[index].data.SXULREMOTEEVENT = true;
							}
							
							for (index in events)
							{
								event = events[index]
							
								dump ("\n"+ event.name +"\n");
								dump (event.data +"\n");
									
							
								app.events[event.name].execute (event.data);
							}																																				
					};
		
	var request = new sorentoLib.AJAJ.request ({url: didius.runtime.ajaxUrl, method: "sXUL.EventListener.Update", async: true, data: content});			
	request.setAttribute ("onFinished", onDone);	
	request.send ();
}
