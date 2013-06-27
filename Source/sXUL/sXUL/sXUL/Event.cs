using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;
using SorentoLib.Services;

namespace sXUL
{
	public class Event
	{
		#region Public Static Fields

		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;

		private double _sort;

		private string _name;
		private Guid _ownerid;
		private Data _data;
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

		public double Sort
		{
			get
			{
				return this._sort;
			}
		}

		public string Name
		{
			get
			{
				return this._name;
			}
		}
		
		public Guid OwnerId
		{
			get
			{
				return this._ownerid;
			}
		}
		
		public Data Data
		{
			get
			{
				return this._data;
			}			
		}
		#endregion
		
		#region Constructor
		public Event (Guid OwnerId, string Name, Data Data)
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._sort = ((TimeSpan)(DateTime.Now - new DateTime (1970, 1, 1))).TotalMilliseconds;
			this._ownerid = OwnerId;
			this._name = Name;
			this._data = Data;
		}
		
		public Event ()
		{
			this._id = Guid.Empty;
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._sort = 0;
			this._ownerid = Guid.Empty;
			this._name = string.Empty;
			this._data = new Data ();
		}
		#endregion
		
		#region Datastore Handling.
		static public string DatastoreAisle
		{
			get
			{
				return "sxul.event";
			}
		}

		public static Event Load (Guid Id)
		{
			try
			{
				return FromData (Datastore.Get (Id).Data);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.EVENTLISTENER", exception.Message));
				
				// EXCEPTION: Excpetion.EventLoadGuid
				throw new Exception (string.Format (Strings.Exception.EventLoadGuid, Id));
			}	
		}

		public void Save ()
		{
			try
			{
				this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("updatetimestamp", this._updatetimestamp);
				meta.Add ("ownerid", this._ownerid);

				Datastore.Set (new Datastore.Item (DatastoreAisle, _id, ToData (), meta));
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (Event), exception.Message));

				// EXCEPTION: Exception.EventSave
				throw new Exception (string.Format (Strings.Exception.EventSave, this._id.ToString ()));
			}					
		}

		public static void Delete (Event Event)
		{
			Delete (Event.Id);
		}

		public static void Delete (Guid Id)
		{			
			try
			{
				SorentoLib.Services.Datastore.Delete (DatastoreAisle, Id);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (Event), exception.Message));
				
				// EXCEPTION: Exception.EventDeleteGuid
				throw new Exception (string.Format (Strings.Exception.EventDeleteGuid, Id.ToString ()));
			}			
		}

		public static List<Event> List (EventListener EventListener)
		{
			List<Event> result = new List<Event> ();

			foreach (Datastore.Item item in Datastore.List (DatastoreAisle, Datastore.Filter.Where ("ownerid", Datastore.Filter.ComparisonOperator.NotEqual, EventListener.Id), Datastore.Sort.AccendingBy ("sort")))
			{
				try
				{
					Event e = FromData (item.Data);
					if (e._updatetimestamp >= EventListener.UpdateTimestamp)
					{
						result.Add (e);
					}
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (Event), exception.Message));

					
					// LOG: LogDebug.EventList
					Logging.LogDebug (string.Format (Strings.LogDebug.EventList, item.Id));
				}
			}
			
//			result.Sort (delegate (Event e1, Event e2) { return e1.Sort.CompareTo (e2.Sort); });
			
			return result;
		}

		public static List<Event> List ()
		{
			List<Event> result = new List<Event> ();

			foreach (Datastore.Item item in Datastore.List (DatastoreAisle, Datastore.Sort.AccendingBy ("sort")))
			{
				try
				{
					result.Add (FromData (item.Data));
				}
				catch (Exception exception)
				{
					// LOG: LogDebug.ExceptionUnknown
					Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (Event), exception.Message));

					
					// LOG: LogDebug.EventList
					Logging.LogDebug (string.Format (Strings.LogDebug.EventList, item.Id));
				}
			}
			
//			result.Sort (delegate (Event e1, Event e2) { return e1.UpdateTimestamp.CompareTo (e2.UpdateTimestamp); });
			
			return result;
		}
		#endregion
		
		#region Internal Static Methods
		internal static void ServiceGarbageCollector ()
		{
			foreach (Event _event in List ())
			{
				if ((SNDK.Date.DateTimeToTimestamp (DateTime.Now) - _event._createtimestamp) > 20)
				{
					try
					{
						Delete (_event);
					}
					catch (Exception exception)
					{
						// LOG: LogDebug.ExceptionUnknown
						Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, typeof (Event), exception.Message));
					}
				}
			}			
			
			// LOG: LogDebug.SessionGarbageCollector
			SorentoLib.Services.Logging.LogDebug (Strings.LogDebug.EventGarbageCollector);
		}
		#endregion


		#region Data conversions.
		public Data ToData ()
		{
			Data result = new Data ();
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			result.Add ("name", this._name);			
			result.Add ("ownerid", this._ownerid);			
			result.Add ("data", this._data);
			return result;
		}

		public static Event FromData (Data data)
		{
			Event result = new Event ();

			if (data.ContainsKey ("id"))			
				result._id = data.Get<Guid>("id");
			else
				throw new Exception (string.Format (SorentoLib.Strings.Exception.JSONFrom, typeof (Event), "ID"));
			
			if (data.ContainsKey ("createtimestamp"))
				result._createtimestamp = data.Get<int>("createtimestamp");
				
			if (data.ContainsKey ("updatetimestamp"))
				result._updatetimestamp = data.Get<int>("updatetimestamp");

			if (data.ContainsKey ("sort"))
				result._sort = data.Get<double>("sort");

			if (data.ContainsKey ("name"))
				result._name = data.Get<string>("name");
				
			if (data.ContainsKey ("ownerid"))
				result._ownerid = data.Get<Guid>("ownerid");
				
			if (data.ContainsKey ("data"))
				result._data = data.Get<Data>("data");
			
			return result;
		}
		#endregion
	}
}

