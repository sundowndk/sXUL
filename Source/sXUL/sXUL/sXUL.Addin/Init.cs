using System;
using System.Collections.Generic;

using SorentoLib;

namespace sXUL.Addin
{
	public class Init : SorentoLib.Addins.IInit
	{
		public Init ()
		{
			Runtime.Initialize ();
		}
	}
}
