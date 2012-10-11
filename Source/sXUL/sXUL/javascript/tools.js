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

print : function (contentWindow, nsiPrintSettings)
{
	nsiPrintSettings.headerStrLeft = "";
	nsiPrintSettings.headerStrCenter = "";
	nsiPrintSettings.headerStrRight = "";
	nsiPrintSettings.footerStrLeft = "";
	nsiPrintSettings.footerStrCenter = "";
	nsiPrintSettings.footerStrRight = "";

  	var req = contentWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
    var wbprint = req.getInterface(Components.interfaces.nsIWebBrowserPrint);
    
    wbprint.print(nsiPrintSettings, null);				
}