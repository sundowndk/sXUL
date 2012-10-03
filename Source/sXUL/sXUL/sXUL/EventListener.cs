using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;

namespace sXUL
{
	public class EventListener
	{
		#region Public Static Fields
		public static string DatastoreAisle = "sxul_eventlistener";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		#endregion
		
		#region Public Fields
		public Guid Id
		{
			get
			{
				return this._id;
			}
		}
		
		public int CreateTimestamp
		{
			get
			{
				return this._createtimestamp;
			}
		}
		
		public int UpdateTimestamp
		{
			get
			{
				return this._updatetimestamp;
			}
		}
		#endregion
		
		#region Constructor
		public EventListener ()
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
		}
		#endregion
		
		#region Public Methods
		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				Hashtable item = new Hashtable ();
				
				item.Add ("id", this._id);
				item.Add ("createtimestamp", this._createtimestamp);
				item.Add ("updatetimestamp", this._updatetimestamp);	
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()));
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Exception.EventListenerSave
				throw new Exception (string.Format (Strings.Exception.EventListenerSave, this._id.ToString ()));
			}					
		}
		#endregion
		
		#region Public Static Methods
		public static EventListener Load (Guid Id)
		{
			EventListener result;
			
			try
			{
				Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//sxul.eventlistener)[1]")));
				result = new EventListener ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Excpetion.EventListenerLoadGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerLoadGuid, Id));
			}	
			
			return result;
		}

		private static List<EventListener> List ()
		{
			List<EventListener> result = new List<EventListener> ();
			
			foreach (string id in SorentoLib.Services.Datastore.ListOfShelfs (DatastoreAisle))
			{
				try
				{
					result.Add (EventListener.Load (new Guid (id)));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.EVENTLISTENER", exception.Message));
					
					// LOG: LogDebug.EventList
					SorentoLib.Services.Logging.LogDebug (string.Format (Strings.LogDebug.EventListenerList, id));
				}
			}
						
			return result;
		}

		public static void Delete (EventListener EventListener)
		{
			Delete (EventListener._id);
		}

		public static void Delete (Guid Id)
		{			
			try
			{
				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id.ToString ());
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Exception.EventListenerDeleteGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerDeleteGuid, Id.ToString ()));
			}			
		}
		
		public static Guid Attach ()
		{
			EventListener eventlistener = new EventListener ();
			eventlistener.Save ();
			
			return eventlistener.Id;
		}
		
		public static void Detach (Guid Id)
		{
			EventListener.Delete (Id);
		}
		
		public static List<Event> Update (Guid Id)
		{
			EventListener eventlistener = EventListener.Load (Id);
			
			List<Event> result = Event.List (eventlistener);
			
			eventlistener.Save ();
			
			foreach (Event e in result)
			{
				Console.WriteLine ("SENDING EVENT:\n");
				Console.WriteLine ("\tID:"+ e.Name);
				Console.WriteLine ("\tUPDATETIMESTAMP:"+ e.UpdateTimestamp);
				Console.WriteLine ("\tOWNERID:"+ e.OwnerId);
				Console.WriteLine ("\tDATA:"+ e.Data);
			}						
			
			return result;
		}
		
		public static void Update (Guid Id, string EventId, Hashtable EventData)
		{
			if (EventId != string.Empty)
			{
				Event e = new Event (Id, EventId, EventData);
				e.Save ();
			}
		}
		#endregion

		#region Internal Static Methods
		internal static void ServiceGarbageCollector ()
		{
			foreach (EventListener eventlistener in List ())
			{
				if ((SNDK.Date.DateTimeToTimestamp (DateTime.Now) - eventlistener._updatetimestamp) > 100)
				{
					try
					{
						Delete (eventlistener);
					}
					catch (Exception exception)
					{
						// LOG: LogDebug.ExceptionUnknown
						SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.EVENTLISTENER", exception.Message));
					}
				}
			}			
			
			// LOG: LogDebug.SessionGarbageCollector
			SorentoLib.Services.Logging.LogDebug (Strings.LogDebug.EventListenerGarbageCollector);
		}
		#endregion
	}
}

