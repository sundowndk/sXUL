using System;
using System.Collections.Generic;
using System.Collections;
using System.Xml;

using SorentoLib;

namespace sXUL.Addin
{
	public class AJAJ : SorentoLib.Addins.IAJAJBaseClass, SorentoLib.Addins.IAJAJ
	{
		#region Constructor
		public AJAJ ()
		{
			base.NameSpaces.Add ("sxul");
		}
		#endregion
		
		#region Public Methods
		new public SorentoLib.AJAJ.Respons Process (SorentoLib.Session Session, string Fullname, string Method)
		{
			SorentoLib.AJAJ.Respons result = new SorentoLib.AJAJ.Respons ();
			SorentoLib.AJAJ.Request request = new SorentoLib.AJAJ.Request (Session.Request.QueryJar.Get ("data").Value);
			
			switch (Fullname.ToLower ())
			{		
				#region sXUL.EventListener
				case "sxul.eventlistener":
				{	
					switch (Method.ToLower ())
					{					
						case "attach":
						{
							result.Add ("result", EventListener.Attach ());
							break;
						}
							
						case "detach":
						{
							EventListener.Detach (request.Data.Get<Guid> ("eventlistenerid"));
							break;
						}	
							
						case "update":
						{
							if (request.Data.ContainsKey ("eventid"))
							{
//								Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (request.GetXml ("eventdata") .SelectSingleNode ("(//eventdata)[1]")));


//								try
//								{
//									item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (xmlDocument.SelectSingleNode ("(//didius.customer)[1]")));
//								}
//								catch
//								{
//									item = (Hashtable)SNDK.Convert.FromXmlDocument (xmlDocument);
//								}

//								XmlDocument test1 = request.GetXml ("eventdata");
//								Console.WriteLine (test1.InnerXml);
//								Hashtable test2 = (Hashtable)SNDK.Convert.FromXmlDocument (test1);
//								string test2 = test1.InnerXml;
//								Console.WriteLine (test2);
//								object test = request.getValue<object> ("eventdata");

								EventListener.Update (request.Data.Get<Guid> ("eventlistenerid"), request.Data.Get<string> ("eventid"), request.Data.Get<Data> ("eventdata"));
							}
							else
							{
								List<Data> events = new List<Data> ();
								foreach (Event event_ in EventListener.Update (request.Data.Get<Guid> ("eventlistenerid")))
									events.Add (event_.ToData ());

								result.Add ("sxul.events", events);
							}
							break;
						}
					}
					break;
				}
				#endregion

//				#region sXUL.Confog
//				case "sxul.config":
//				{	
//					switch (Method.ToLower ())
//					{					
//						case "set":
//						{
//							Config.Set (request.getValue<string> ("key"), request.getValue<string> ("value"));
//							break;
//						}
//							
//						case "get":
//						{
//							result.Add (Config.Get (request.getValue<string> ("key")));
//							break;
//						}	
//					}
//					break;
//				}
//				#endregion
			}
			
			return result;
		}
		#endregion
	}
}
