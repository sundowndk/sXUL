using System;
using System.Collections.Generic;
using System.Collections;
using System.Xml;

using SorentoLib;

namespace sXUL.Addin
{
	public class Ajax : SorentoLib.Addins.IAjaxBaseClass, SorentoLib.Addins.IAjax		
	{
		#region Constructor
		public Ajax ()
		{
			base.NameSpaces.Add ("sxul");
		}
		#endregion
		
		#region Public Methods
		new public SorentoLib.Ajax.Respons Process (SorentoLib.Session Session, string Fullname, string Method)
		{
			SorentoLib.Ajax.Respons result = new SorentoLib.Ajax.Respons ();
			SorentoLib.Ajax.Request request = new SorentoLib.Ajax.Request (Session.Request.QueryJar.Get ("data").Value);
			
			switch (Fullname.ToLower ())
			{		
				#region sXUL.EventListener
				case "sxul.eventlistener":
				{	
					switch (Method.ToLower ())
					{					
						case "attach":
						{
							result.Add (EventListener.Attach ());
							break;
						}
							
						case "detach":
						{
							EventListener.Detach (request.getValue<Guid> ("eventlistenerid"));
							break;
						}	
							
						case "update":
						{
							if (request.ContainsXPath ("eventid"))
							{
//								Console.WriteLine (request.XmlDocument.InnerXml);

								Hashtable item = (Hashtable)SNDK.Convert.FromXmlDocument (SNDK.Convert.XmlNodeToXmlDocument (request.GetXml ("eventdata") .SelectSingleNode ("(//eventdata)[1]")));


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

								EventListener.Update (request.getValue<Guid> ("eventlistenerid"), request.getValue<string> ("eventid"), item);
							}
							else
							{
								result.Add (EventListener.Update (request.getValue<Guid> ("eventlistenerid")));
							}
							break;
						}
					}
					break;
				}
				#endregion

				#region sXUL.Confog
				case "sxul.config":
				{	
					switch (Method.ToLower ())
					{					
						case "set":
						{
							Config.Set (request.getValue<string> ("key"), request.getValue<string> ("value"));
							break;
						}
							
						case "get":
						{
							result.Add (Config.Get (request.getValue<string> ("key")));
							break;
						}	
					}
					break;
				}
				#endregion
			}
			
			return result;
		}
		#endregion
	}
}
