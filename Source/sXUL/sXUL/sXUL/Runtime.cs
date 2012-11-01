using System;
using System.IO;
using System.Xml;
using Mono.Unix;

using SorentoLib;

namespace sXUL
{
	public static class Runtime
	{	
		public static Guid AddinId = new Guid ("649cf81d-c266-4da5-81c7-331aac6593c0");

		public static SorentoLib.Usergroup UsergroupUser;
		public static SorentoLib.Usergroup UsergroupModerator;
		public static SorentoLib.Usergroup UsergroupAuthor;
		public static SorentoLib.Usergroup UsergroupEditor;
		public static SorentoLib.Usergroup UsergroupAdministrator;

		public static void Initialize ()
		{				
			try
			{				
				// Remove current symlinks
				//SNDK.IO.RemoveSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "sxul");

				// Create symlinks
				//SNDK.IO.CreateSymlink (SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_addins) + "sXUL/resources/html", SorentoLib.Services.Config.Get<string> (SorentoLib.Enums.ConfigKey.path_html) + "sxul");

				// Create default usergroups
				UsergroupUser =	SorentoLib.Usergroup.AddBuildInUsergroup (new Guid ("cee43668-e44b-4675-b18d-3b297a84b953"), "sXUL User", AddinId.ToString ());
				UsergroupModerator = SorentoLib.Usergroup.AddBuildInUsergroup (new Guid ("f54caf98-59ad-4082-b235-0d7965dd1816"), "sXUL Moderator", AddinId.ToString ());
				UsergroupEditor = SorentoLib.Usergroup.AddBuildInUsergroup (new Guid ("90a8ab5f-5353-416f-b245-4ad568330927"), "sXUL Editor", AddinId.ToString ());
				UsergroupAuthor = SorentoLib.Usergroup.AddBuildInUsergroup (new Guid ("573e0d91-3bee-490f-b400-6ea0ad7b5470"), "sCMS Author", AddinId.ToString ());
				UsergroupAdministrator = SorentoLib.Usergroup.AddBuildInUsergroup (new Guid ("6321156a-ff6a-4e01-a5bd-87e904baa45f"), "sCMS Administrator", AddinId.ToString ());

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
			EventListener.ServiceGarbageCollector ();
			Event.ServiceGarbageCollector ();
		}			
	}
}

