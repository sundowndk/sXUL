using System;
using System.Collections.Generic;
using System.Xml;

using SorentoLib;

namespace sXUL
{
	public class Usergroup : SorentoLib.Usergroup
	{
		public Usergroup ()  : base ()
		{
			base.Scope = Runtime.AddinId.ToString ();
		}
		
		new static public List<SorentoLib.Usergroup> List ()
		{
			return SorentoLib.Usergroup.List (Runtime.AddinId.ToString ());
		}

		new public static SorentoLib.Usergroup FromXmlDocument (XmlDocument xmlDocument)
		{
			return SorentoLib.Usergroup.FromXmlDocument (xmlDocument);
		}
	}
}

