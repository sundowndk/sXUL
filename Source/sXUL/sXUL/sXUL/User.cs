using System;
using System.Collections.Generic;

using SorentoLib;

namespace sXUL
{
	public class User : SorentoLib.User
	{
		public User (string username, string email)  : base (username, email)
		{
			base.Scope = Runtime.AddinId.ToString ();
		}

		new static public List<SorentoLib.User> List ()
		{
			return SorentoLib.User.List (Runtime.AddinId.ToString ());
		}
	}
}

