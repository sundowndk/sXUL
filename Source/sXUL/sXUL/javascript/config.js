set : function (attributes)
{
	if (!attributes)
		throw "sXUL.config.set: attributes missing.";
	
	if (attributes.key != null)
	{
		var content = {}
		content["key"] = attributes.key;
		content["value"] = attributes.value;
	
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.Config.Set", "data", "POST", false);	
		request.send (content);									
	}
	else if (attributes.configs != null)
	{
	
	}	
	else
	{
		throw "sXUL.config.set: key or configs missing.";
	}
},

get : function (attributes)
{
	if (!attributes)
		throw "sXUL.config.get: attributes missing.";
		
	if (attributes.key != null)
	{
		var content = {}
		content["key"] = attributes.key;		
	
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=sXUL.Config.Get", "data", "POST", false);	
		request.send (content);									
		
		return request.respons ()["value"];
	}
	else if (attributes.configs != null)
	{
	
	}	
	else
	{
		throw "sXUL.config.get: key or configs missing.";
	}	
}
