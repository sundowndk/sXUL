using System;
using System.Xml;
using System.Collections;
using System.Collections.Generic;

using SNDK;
using SorentoLib;
using SorentoLib.Services;

namespace sXUL
{
	public class Config
	{
		#region Public Static Fields
		public static string DatastoreAisle = "sxul_config";
		#endregion
		
		#region Private Fields
		private Guid _id;
		
		private int _createtimestamp;
		private int _updatetimestamp;
		
		private string _key;		
		private object _value;
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
		
		public string Key
		{
			get
			{
				return this._key;
			}
		}
		
		public object Value
		{
			get
			{
				return this._value;
			}

		}
		#endregion
		
		#region Constructor
		public Config (string Key, object Value)
		{
			this._id = Guid.NewGuid ();
			this._createtimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._updatetimestamp = SNDK.Date.CurrentDateTimeToTimestamp ();
			this._key = Key;
			this._value = Value;
		}
		
		public Config ()
		{
			this._id = Guid.Empty;
			this._createtimestamp = 0;
			this._updatetimestamp = 0;
			this._key = string.Empty;
			this._value = null;
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
				item.Add ("key", this._key);
				item.Add ("value", this._value);
				
				SorentoLib.Services.Datastore.Meta meta = new SorentoLib.Services.Datastore.Meta ();
				meta.Add ("key", this._key);
				
				SorentoLib.Services.Datastore.Set (DatastoreAisle, this._id.ToString (), SNDK.Convert.ToXmlDocument (item, this.GetType ().FullName.ToLower ()), meta);
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.CONFIG", exception.Message));
				
				// EXCEPTION: Exception.ConfigSave
				throw new Exception (string.Format (Strings.Exception.ConfigSave, this._id.ToString ()));
			}					
		}
		
		public XmlDocument ToXmlDocument ()
		{
			Hashtable result = new Hashtable ();
			
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			
			result.Add ("key", this._key);			
			result.Add ("value", this._value);			
			
			return SNDK.Convert.ToXmlDocument (result, this.GetType ().FullName.ToLower ());
		}
		#endregion
		
		#region Public Static Methods
		public static void Set (string Key, object Value)
		{
			Config config;

			try
			{
				config = Load (Guid.Empty, Key);
				config._value = Value;
			}
			catch (Exception Exception)
			{
				config = new Config (Key, Value);
			}

			config.Save ();
		}

		public static object Get (string Key)
		{
			return Config.Load (Guid.Empty, Key).Value;
		}

		public static Config Load (Guid Id, string Key)
		{
			Config result;
			
			try
			{
				Hashtable item;

				if (Id != Guid.Empty)
				{
					item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, Id.ToString ()).SelectSingleNode ("(//sxul.config)[1]")));
				}
				else
				{
					item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (SorentoLib.Services.Datastore.Get<XmlDocument> (DatastoreAisle, new SorentoLib.Services.Datastore.MetaSearch ("key", SorentoLib.Enums.DatastoreMetaSearchComparisonOperator.Equal, Key)).SelectSingleNode ("(//sxul.config)[1]")));
				}
					
				result = new Config ();
				
				result._id = new Guid ((string)item["id"]);
				
				if (item.ContainsKey ("createtimestamp"))
				{
					result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
				}
				
				if (item.ContainsKey ("updatetimestamp"))
				{
					result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
				}
								
				if (item.ContainsKey ("key"))
				{
					result._key = (string)item["key"];
				}
				
				if (item.ContainsKey ("value"))
				{
					result._value = (object)item["value"];
				}
			}
			catch (Exception exception)
			{
				// LOG: LogDebug.ExceptionUnknown
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "DIDIUS.CONFIG", exception.Message));

				if (Id != Guid.Empty)
				{
					// EXCEPTION: Excpetion.ConfigLoadGuid
					throw new Exception (string.Format (Strings.Exception.ConfigLoadGuid, Id));
				}
				else
				{
					throw new Exception (string.Format (Strings.Exception.ConfigLoadKey, Key));
				}
			}	
			
			return result;
		}
					
		public static void Delete (Config Config)
		{
			Delete (Config.Id);
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
				SorentoLib.Services.Logging.LogDebug (string.Format (SorentoLib.Strings.LogDebug.ExceptionUnknown, "SXUL.CONFIG", exception.Message));
				
				// EXCEPTION: Exception.ConfigDeleteGuid
				throw new Exception (string.Format (Strings.Exception.ConfigDeleteGuid, Id.ToString ()));
			}			
		}

		public static Config FromXmlDocument (XmlDocument xmlDocument)
		{
			Hashtable item;
			Config result = new Config ();
			
			try
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.config)[1]")));
			}
			catch
			{
				item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
			}
			
			if (item.ContainsKey ("id"))
			{
				result._id = new Guid ((string)item["id"]);
			}
			else
			{
				throw new Exception (string.Format (Strings.Exception.ConfigFromXmlDocument, "ID"));
			}
			
			if (item.ContainsKey ("createtimestamp"))
			{
				result._createtimestamp = int.Parse ((string)item["createtimestamp"]);
			}
			
			if (item.ContainsKey ("updatetimestamp"))
			{
				result._updatetimestamp = int.Parse ((string)item["updatetimestamp"]);
			}
			
			if (item.ContainsKey ("key"))
			{
				result._key = (string)item["key"];
			}

			if (item.ContainsKey ("value"))
			{
				result._value = (object)item["value"];
			}

			return result;
		}
		#endregion		


		#region Data conversions.
		/// <summary>
		/// Convert <see cref="SorentoLib.User"/> to <see cref="SorentoLib.Data"/>.
		/// </summary>
		public Data ToData ()
		{
			return ToData (false);
		}

		/// <summary>
		/// Convert <see cref="SorentoLib.User"/> to <see cref="SorentoLib.Data"/>.
		/// </summary>
		private Data ToData (bool Internal)
		{
			Data result = new Data ();
			result.Add ("id", this._id);
			result.Add ("createtimestamp", this._createtimestamp);
			result.Add ("updatetimestamp", this._updatetimestamp);
			result.Add ("usergroupids", this._usergroupids);
			result.Add ("username", this._username);
			result.Add ("realname", this._realname);
			result.Add ("email", this._email);		
			
			if (Internal)
				result.Add ("password", this._password);
			
			result.Add ("status", SNDK.Convert.EnumToString (this._status));
			
			return result;
		}

		/// <summary>
		/// Convert from <see cref="SorentoLib.Data"/> string to <see cref="SorentoLib.User"/>.
		/// </summary>
		public static User FromData (Data Data)
		{
			return FromData (Data, false);
		}

		/// <summary>
		/// Convert from <see cref="SorentoLib.Data"/> string to <see cref="SorentoLib.User"/>.
		/// </summary>
		private static User FromData (Data Data, bool Internal)
		{
			User result = new User ();

			if (Data.ContainsKey ("id"))			
				result._id = Data.Get<Guid>("id");
			else
				throw new Exception (string.Format (Strings.Exception.JSONFrom, typeof (User), "ID"));
			
			if (Data.ContainsKey ("createtimestamp"))
				result._createtimestamp = Data.Get<int> ("createtimestamp");				
			
			if (Data.ContainsKey ("updatetimestamp"))
				result._updatetimestamp = Data.Get<int> ("updatetimestamp");
			
			if (Data.ContainsKey ("usergroupids"))
				foreach (Guid id in Data.Get<List<Guid>>("usergroupids"))
					result._usergroupids.Add (id);
			
			if (Data.ContainsKey ("username"))
				result._username = Data.Get<string>("username");

			if (Data.ContainsKey ("email"))
				result._email = Data.Get<string>("email");

			if (Data.ContainsKey ("realname"))
				result._realname = Data.Get<string>("realname");

			if (Internal)
				if (Data.ContainsKey ("password"))
					result._password = Data.Get<string>("password");
			else
				result._password = User.Load (result._id)._password;
			
			if (Data.ContainsKey ("status"))
				result._status = Data.Get<Enums.UserStatus> ("status");
			
			return result;
		}
		#endregion
	}
}

