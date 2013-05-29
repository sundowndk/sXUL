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

//print : function (contentWindow, nsiPrintSettings, onDone, onError)
print : function (attributes)
{
	attributes.settings.headerStrLeft = "";
	attributes.settings.headerStrCenter = "";
	attributes.settings.headerStrRight = "";
	attributes.settings.footerStrLeft = "";
	attributes.settings.footerStrCenter = "";
	attributes.settings.footerStrRight = "";

  	var req = attributes.contentWindow.QueryInterface (Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface( Components.interfaces.nsIWebBrowserPrint);
    
    if (!attributes.listener)
    {
		attributes.listener = 
		{
			onStateChange: function (aWebProgress, aRequest, aStateFlags, aStatus) 
      		{
      				sXUL.console.log (aStateFlags);
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_REQUEST)
      			{
      				sXUL.console.log ("STATE_IS_REQUEST")
      			}
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT)
      			{
      				sXUL.console.log ("STATE_IS_DOCUMENT")
      			}
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_NETWORK)
      			{
      				sXUL.console.log ("STATE_IS_NETWORK")
      			}
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_WINDOW)
      			{
      				sXUL.console.log ("STATE_IS_WINDOW")
      			}
      			
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_START)
      			{
     				sXUL.console.log ("STATE_START")
      			}
      			
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP)
      			{
      				sXUL.console.log ("STATE_STOP")
      			}
      			
      			if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP && aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_DOCUMENT) 
      			{
      				sXUL.console.log ("STATE_STOP + STATE_DOCUMENT")
//  				if (attributes.onDone != null)
//  				{    					
//    					setTimeout (attributes.onDone, 1);
//    				}
      			}
      		
				if (aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_STOP && aStateFlags & Components.interfaces.nsIWebProgressListener.STATE_IS_NETWORK) 
      			{
      				sXUL.console.log ("DONE");      				      				
      				if (attributes.onDone != null)
    				{    					
    					setTimeout (attributes.onDone, 1);
    				}      				
	 			}
        	},		
        						
        	onProgressChange : function (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) 
        	{
        	},

       		// stubs for the nsIWebProgressListener interfaces which nsIWebBrowserPrint doesn't use.
        	onLocationChange : function() { throw "Unexpected onLocationChange"; },
        	onStatusChange     : function() { throw "Unexpected onStatusChange"; },
        	onSecurityChange : function() { throw "Unexpected onSecurityChange"; }
    	};
    }    
    
	try
   {
  		wbprint.print (attributes.settings, attributes.listener);				
  	}
    catch (exception)
    {
    	sXUL.console.log (exception.message.indexOf ("0x80004004 (NS_ERROR_ABORT)"))	
    	
    	if (exception.message.indexOf ("0x80004004 (NS_ERROR_ABORT)") == -1)
    	{
    		if (attributes.onError != null)
    		{
	   			setTimeout (attributes.onError, 1);
   			}	
    	}   
 	  	else
    	{
    		if (attributes.onDone != null)
    		{
	   			setTimeout (attributes.onDone, 1);
   			}	
    	}     	        	
    }
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
	
//	 var request = new XMLHttpRequest ();  	
 // 	request.open ("POST", attributes.postUrl, false);
 
  	var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
  	request.open ("POST", attributes.postUrl, true);
  	
  	// Events
  	request.onload = function (event) { if (attributes.onLoad != null) attributes.onLoad (event.target.responseText); };
  	request.onError = function (event) { if (attributes.onError != null) attributes.onError (event); };	
	request.upload.addEventListener ("progress", function (event) { if (attributes.onProgress != null) attributes.onProgress (event); }, false);
	request.upload.addEventListener ("error", function (event) {  if (attributes.onError != null) attributes.onError (event); }, false);	
  								
  	// Send request							
  	request.send (data);  	  	  									
}