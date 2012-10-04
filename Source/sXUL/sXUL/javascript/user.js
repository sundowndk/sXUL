create : function (username)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.New", "data", "POST", false);			
	
	var content = new Array ();
	content["username"] = username;	
	request.send (content);
	
	return request.respons ()["sorentolib.user"];		
},

load : function (id)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Load", "data", "POST", false);	
	
	var content = new Array ();
	content["id"] = id;
				
	request.send (content);
	
	return request.respons ()["sorentolib.user"];
},

save : function (user)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Save", "data", "POST", false);				
	
	var content = new Array ();
	content["sorentolib.user"] = user;
		
	request.send (content);				
},

delete : function (id)
{
	var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.Delete", "data", "POST", false);	
	
	var content = new Array ();
	content["id"] = id;
	
	request.send (content);				
	
	return true;
},

list : function (attributes)
{	
	if (!attributes) 
		attributes = new Array ();
				
	if (attributes.async)
	{
		var onDone = 	function (respons)
						{
							attributes.onDone (respons["sorentolib.users"]);
						};
		
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.List", "data", "POST", true);
		request.onLoaded (onDone);
		request.send ();						
	}
	else
	{
		var request = new SNDK.ajax.request (didius.runtime.ajaxUrl, "cmd=Ajax;cmd.function=SorentoLib.User.List", "data", "POST", false);		
		request.send ();

		return request.respons ()["sorentolib.users"];		
	}
},

changePassword : function (userid, newPassword, oldPassword)
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.ChangePassword", "data", "POST", false);
	
	var content = new Array ();
	content["userid"] = userid;
	content["newpassword"] = newPassword;
	if (oldPassword != null)
	{
		content["oldpassword"] = oldPassword;
	}
		
	request.send (content);
	
	return request.respons ()["result"];	
},

isUsernameInUse : function (username, id)
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsUsernameInUse", "data", "POST", false);	

	var content = new Array ();	
	content['username'] = username;		
	if (id != null)
	{
		content['id'] = id;
	}
	
	request.send (content);

 	return request.respons ()["result"];
},

isEmailInUse : function (email, id)
{
	var request = new SNDK.ajax.request ("/", "cmd=Ajax;cmd.function=SorentoLib.User.IsEmailInUse", "data", "POST", false);	

	var content = new Array ();

	content["email"] = email;
	if (id != null)
	{
		content["id"] = id;
	}

	request.send (content);

	return request.respons ()["result"];
}		

