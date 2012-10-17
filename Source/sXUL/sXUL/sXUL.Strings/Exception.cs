using System;

namespace sXUL.Strings
{
	public class Exception
	{
		public static string ConfigSave = "Could not save Config with id: {0}";
		public static string ConfigLoadGuid = "Could not load Config with id: {0}";
		public static string ConfigLoadKey = "Could not load Config with key: {0}";
		public static string ConfigDeleteGuid = "Could not delete Config with id: {0}";
		public static string ConfigDeleteKey = "Could not delete Config with key: {0}";
		public static string ConfigFromXmlDocument = "Cannot create Config from XmlDocument, missing {0}";

		public static string EventListenerSave = "Could not save EventListener with id: {0}";
		public static string EventListenerLoadGuid = "Could not load EventListener with id: {0}";
		public static string EventListenerDeleteGuid = "Could not delete EventListener with id: {0}";

		public static string EventSave = "Could not save Event with id: {0}";
		public static string EventLoadGuid = "Could not load Event with id: {0}";
		public static string EventDeleteGuid = "Could not delete Event with id: {0}";
	}
}

