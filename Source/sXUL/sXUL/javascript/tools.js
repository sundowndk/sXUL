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

print : function (contentWindow, nsiPrintSettings, listener)
{
	nsiPrintSettings.headerStrLeft = "";
	nsiPrintSettings.headerStrCenter = "";
	nsiPrintSettings.headerStrRight = "";
	nsiPrintSettings.footerStrLeft = "";
	nsiPrintSettings.footerStrCenter = "";
	nsiPrintSettings.footerStrRight = "";

  	var req = contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
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
  	request.onload = function (event) { if (attributes.onLoad != null) attributes.onLoad (event.target.responseText); };
  	request.onError = function (event) { if (attributes.onError != null) attributes.onError (event); };	
	request.upload.addEventListener ("progress", function (event) { if (attributes.onProgress != null) attributes.onProgress (event); }, false);
	request.upload.addEventListener ("error", function (event) { if (attributes.onError != null) attributes.onError (event); }, false);	
  								
  	// Send request							
  	request.send (data);  	  	  									
}