using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;
using SorentoLib.Services;

namespace sXUL
{
	public class EventListener
	{	
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
		
		#region Datastore Handling.
		static public string DatastoreAisle
		{
			get
			{
				return "sxul.eventlistener";
			}
		}

		public static EventListener Load (Guid Id)
		{
			try
			{
				return FromData (Datastore.Get (DatastoreAisle, Id).Data);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (EventListener), exception.Message));

				// EXCEPTION: Excpetion.EventListenerLoadGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerLoadGuid, Id));
			}	
		}

		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				SorentoLib.Services.Datastore.Set (new Datastore.Item (DatastoreAisle, this._id, ToData ()));
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (EventListener), exception.Message));

				
				// EXCEPTION: Exception.EventListenerSave
				throw new Exception (string.Format (Strings.Exception.EventListenerSave, this._id.ToString ()));
			}					
		}

		public static void Delete (EventListener EventListener)
		{
			Delete (EventListener._id);
		}

		public static void Delete (Guid Id)
		{			
			try
			{
				Datastore.Delete (DatastoreAisle, Id);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (EventListener), exception.Message));

				// EXCEPTION: Exception.EventListenerDeleteGuid
				throw new Exception (string.Format (Strings.Exception.EventListenerDeleteGuid, Id.ToString ()));
			}			
		}

		private static List<EventListener> List ()
		{
			List<EventListener> result = new List<EventListener> ();
			
			foreach (Datastore.Item item in Datastore.List (DatastoreAisle))
			{
				try
				{
					result.Add (FromData (item.Data));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (EventListener), exception.Message));

					// LOG: LogDebug.EventList
					Logging.LogDebug (string.Format (Strings.LogDebug.EventListenerList, item.Id));
				}
			}
						
			return result;
		}
		#endregion
		
		#region Public Static Methods
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
				Console.WriteLine ("\tSORT:"+ e.Sort);
				Console.WriteLine ("\tLISTENER:"+ Id);
				Console.WriteLine ("\tOWNERID:"+ e.OwnerId);
				Console.WriteLine ("\tDATA:"+ e.Data);
			}						
			
			return result;
		}
		
		public static void Update (Guid Id, string EventId, Data EventData)
		{
			if (EventId != string.Empty)
			{
				Event e = new Event (Id, EventId, EventData);
				e.Save ();
			}
		}
		#endregion

		#region Housekeeping.
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
						Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (EventListener), exception.Message));
					}
				}
			}			
			
			// LOG: LogDebug.SessionGarbageCollector
			Logging.LogDebug (Strings.LogDebug.EventListenerGarbageCollector);
		}
		#endregion

		#region Data conversions.
		public Data ToData ()
		{
			Data result = new Data ();
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);	
			return result;
		}

		public static EventListener FromData (Data data)
		{
			EventListener result = new EventListener ();

			if (data.ContainsKey ("id"))			
				result._id = data.Get<Guid>("id");
			else
				throw new Exception (string.Format (SorentoLib.Strings.Exception.JSONFrom, typeof (Event), "ID"));
			
			if (data.ContainsKey ("createtimestamp"))
				result._createtimestamp = data.Get<int>("createtimestamp");
				
			if (data.ContainsKey ("updatetimestamp"))
				result._updatetimestamp = data.Get<int>("updatetimestamp");
			
			return result;
		}
		#endregion
	}
}

