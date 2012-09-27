using System;
using System.IO;
using System.Xml;
using Mono.Unix;

using SorentoLib;

namespace sXUL
{
	public static class Runtime
	{	
		public static void Initialize ()
		{				
			try
			{				
				// Remove current symlinks
				SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "sxul");

				// Create symlinks
				SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sXUL/resources/html", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "sxul");

				// GARBAGE COLLECTOR
				SorentoLib.Services.Events.ServiceGarbageCollector += EventhandlerServiceGarbageCollector;
				
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.INITIALIZE", exception.Message));
			}				
		}
				
		static void EventhandlerServiceGarbageCollector (object Sender, EventArgs E)
		{
//			Global.ServiceGarbageCollector ();
		}			
	}
}

