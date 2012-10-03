event : function (attributes)
{
	var _attributes = attributes;
	var _eventHandlers = new Array ();
	

	init ();

	function init ()
	{
		if (!_attributes)
			_attributes = new Array ();
		
		if (_attributes.remotePropagation)
		{
			if (!_attributes.id)
			{
				throw "No ID specified for remote event.";
			}
			
			var remotePropagation =	function (eventData)
									{		
									//sXUL.eventListener.update ({id: app.session.eventListenerId, eventId: _attributes.id, eventData: eventData});	
										if (!eventData.SXULREMOTEEVENT)																
											sXUL.eventListener.update ({id: sXUL.eventListener.id, eventId: _attributes.id, eventData: eventData});
									};
								
			addHandler (remotePropagation);
		}
	}

	this.addHandler = addHandler;
	this.removeHandler = removeHandler;
	this.execute = execute;
			
	function addHandler (eventHandler)
	{
		_eventHandlers.push (eventHandler);
	}
	
	function removeHandler (eventHandler)
	{
		for (var idx in _eventHandlers) 
		{	
			if (_eventHandlers[idx] === eventHandler) 
			{			
				_eventHandlers.splice (idx, 1);
				return;
			}	
		}
	}
	
	function execute (eventData)
	{
		for (var idx = 0; idx < _eventHandlers.length; idx++)
		{
			_eventHandlers[idx] (eventData);
		}
	}
}
