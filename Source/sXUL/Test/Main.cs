using System;

using SorentoLib;
using SNDK;
using SNDK.DBI;
using System.Xml;
using sXUL;

namespace Test
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			SorentoLib.Services.Database.Connection = new Connection (SNDK.Enums.DatabaseConnector.Mysql,
			                                                          "10.0.0.40",
			                                                          //			                                                            "10.0.0.40",
			                                                          //			                                                            "sorento",
			                                                          "sorentotest.sundown.dk",
			                                                          "sorentotest",
			                                                          "qwerty",
			                                                          true);
			
			SorentoLib.Services.Database.Prefix = "sorento_";
			SorentoLib.Services.Database.Connection.Connect ();
					

			bool testuser = false;
			bool testusergroup = true;

			if (testuser)
			{			
				sXUL.User u1 = new sXUL.User ("rasmus1", "blabla1");
				u1.Save ();

				foreach (SorentoLib.User user in sXUL.User.List ())
				{
					Console.WriteLine (user.Username);
				}

				sXUL.User.Delete (u1.Id);
			}

			if (testusergroup)
			{			
				sXUL.Usergroup u1 = new sXUL.Usergroup ();
				u1.Name = "Test Usergroup";
				u1.Save ();			

				foreach (SorentoLib.Usergroup usergroup in SorentoLib.Usergroup.List ())
				{
					Console.WriteLine (usergroup.Name);
				}

				foreach (SorentoLib.Usergroup usergroup in sXUL.Usergroup.List ())
				{
					Console.WriteLine (usergroup.Name);
				}

				XmlDocument xml = u1.ToXmlDocument ();

				Console.WriteLine (xml.InnerXml);

//				sXUL.Usergroup u2 = sXUL.Usergroup.FromXmlDocument (xml);
//				Console.WriteLine (u2.Id);
				
				sXUL.Usergroup.Delete (u1.Id);
			}
		
		}
	}
}
