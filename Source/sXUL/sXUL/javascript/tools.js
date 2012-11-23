fileToString : function (aURL)
{	
	var ioService=Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
 	
	var scriptableStream=Components.classes["@mozilla.org/scriptableinputstream;1"].getService(Components.interfaces.nsIScriptableInputStream);

	var channel=ioService.newChannel(aURL,null,null);	
  	var input=channel.open();
  	scriptableStream.init(input);
  	var str=scriptableStream.read(input.available());
  	scriptableStream.close();
  	input.close();
  	return str;
},

fileDelete : function (path)
{
	var file = Components.classes['@mozilla.org/file/local;1'].createInstance (Components.interfaces.nsILocalFile);
	file.initWithPath (path);
	if (file.exists ())
		file.remove (false);
},

print : function (contentWindow, nsiPrintSettings, onDone, listener)
{
	nsiPrintSettings.headerStrLeft = "";
	nsiPrintSettings.headerStrCenter = "";
	nsiPrintSettings.headerStrRight = "";
	nsiPrintSettings.footerStrLeft = "";
	nsiPrintSettings.footerStrCenter = "";
	nsiPrintSettings.footerStrRight = "";

  	var req = contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
    if (!listener)
    {
		listener = 
		{
			onStateChange: function(aWebProgress, aRequest, aStateFlags, aStatus) 
      		{
				if (aStateFlags & Ci.nsIWebProgressListener.STATE_STOP && aStateFlags & Ci.nsIWebProgressListener.STATE_IS_NETWORK) 
      			{
      				onDone ();
	 			}
        	},		
        						
        	onProgressChange : function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) 
        	{
        	},

       		// stubs for the nsIWebProgressListener interfaces which nsIWebBrowserPrint doesn't use.
        	onLocationChange : function() { throw "Unexpected onLocationChange"; },
        	onStatusChange     : function() { throw "Unexpected onStatusChange"; },
        	onSecurityChange : function() { throw "Unexpected onSecurityChange"; }
    	};
    }    
    
    wbprint.print(nsiPrintSettings, listener);				
},

getLocalDirectory : function () 
{ 
    var directoryService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties); 
    var localDir = directoryService.get("ProfD", Components.interfaces.nsIFile); 
    return localDir; 
},

fileUpload : function (attributes)
{
	if (!attributes)
		throw "sXUL.tools.fileUpload: no attributes given";
		
	if (!attributes.postUrl)
		throw "sXUL.tools.fileUpload: postUrl missing";
		
	if (!attributes.fieldName)
		throw "sXUL.tools.fileUpload: fieldName missing";
		
	if (!attributes.filePath)
		throw "sXUL.tools.fileUpload: filePath missing";
	
	if (!attributes.additionalFields)
		attributes.additionalFields = {};
									
	var data = new FormData ();
	
	try
	{
		data.append (attributes.fieldName, new File (attributes.filePath));
	}
	catch (exception)
	{
		throw "sXUL.tools.fileUpload: "+ exception.message;		
	}
	
	for (var idx in attributes.additionalFields)
	{
		var value = attributes.additionalFields[idx];
		data.append (idx, value);
	}															
 
  	var request = new XMLHttpRequest ();
  	request.open ("POST", attributes.postUrl);
  	
  	// Events
  	request.onload = function (event) { sXUL.console.log ("onload"); if (attributes.onLoad != null) attributes.onLoad (event.target.responseText); };
  	request.onError = function (event) { sXUL.console.log ("onerror"); if (attributes.onError != null) attributes.onError (event); };	
	request.upload.addEventListener ("progress", function (event) { sXUL.console.log ("onprogress"); if (attributes.onProgress != null) attributes.onProgress (event); }, false);
	request.upload.addEventListener ("error", function (event) { sXUL.console.log ("onerror"); if (attributes.onError != null) attributes.onError (event); }, false);	
  								
  	// Send request							
  	request.send (data);  	  	  									
}