tree : function (attributes)
{
	var _attributes = attributes;				
	var _elements = new Array ();
	var _rows = new Array ();
	
	var _temp = {};			
	_temp.refresh = true;
	_temp.filterColumns = new Array ();
	
	this.addRow = addRow;
	this.removeRow = removeRow;
	
	this.setRow = setRow;
	this.getRow = getRow;
	
	this.enableRefresh = enableRefresh;
	this.disableRefresh = disableRefresh;
							
	this.sort = sort;		
	this.filter = filter;							
	
	this.clear = clear2;
	
	this.getCurrentIndex = getCurrentIndex;
	
	init ();
		
	function init ()
	{
		if (!_attributes)
			_attributes = new Array ();
					
		if (!_attributes.element)
			throw "Need an treeview element to attatch to.";
	
		_elements.tree = _attributes.element;				
		_elements.treeChildren = document.createElement ("treechildren");
		_elements.tree.appendChild (_elements.treeChildren);
													
		// Check if Id TreeColumn exists
		var treeColumns = _elements.tree.columns;
		if (!treeColumns.getNamedColumn ("id"))
		{
			throw "No Id column found.";
		}				
				
		_elements.tree.ondblclick = onDoubleClick;
						
		if (attributes.sortColumn)
		{
			_temp.sortColumn = _attributes.sortColumn;
			_temp.sortDirection = _attributes.sortDirection;
			
			// Set sortdirection on newly sorted column.	
			document.getElementById (_temp.sortColumn).setAttribute ("sortDirection", _temp.sortDirection);									
		}
														
		if (attributes.filter)
		{
			_temp.filterColumn = _attributes.filter;
			_temp.filterValue = _attributes.filterValue;
			_temp.filterDirection = _attributes.filterDirection;
		}									
		
		_elements.tree.addEventListener ("keypress", onKeypress, true);
	};
	
	function onDoubleClick (event)
	{
		var index = _elements.tree.treeBoxObject.getRowAt (event.clientX,event.clientY)
		
		if (_attributes.onDoubleClick != null && index != -1)
		{			
			_attributes.onDoubleClick (index);
		}
	}
	
	function onKeypress (event)
	{
		// Editable
		if (_temp.editable)
		{		
			if ((e.keyCode == KeyEvent.DOM_VK_TAB) || (e.keyCode == KeyEvent.DOM_VK_RETURN))
			{				
			}
		}
	}
	
	function enableRefresh ()
	{
		_temp.refresh = true;
		refresh ();
	}
	
	function disableRefresh ()
	{
		_temp.refresh = false;
	}
	
						
	function refresh ()
	{				
		if (_temp.refresh)					
		{
		// Clear all rows.
		clear ();
		
		var compareFunc;
		if (_temp.sortDirection == "ascending") 
		{
		compareFunc = 	function (second, first) 
						{    									    							
							if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
							{
								return -1;	
							}
							
							if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
							{
								return 1;	
							}
						}
		} 
		else 
		{  				
		compareFunc = 	function (first, second) 
						{       									
							if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
							{
								return -1;	
							}
							
							if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
							{
								return 1;	
							}
							return 0;      								
						}
		}
		
		// Sort rows.
		if (_temp.sortColumn != null)
		{
			_rows.sort (compareFunc);
		}
		
		var filterColumnsLength = _temp.filterColumns.length;
	
		for (var idx = 0; idx < 11; idx++) 
		{
			for (index in _rows)
			{	
				if (filterColumnsLength > 0)
				{	
					var skip = true;
												
					if (_temp.filterDirection == "in")
					{								
						for (column = 0; column < filterColumnsLength; column++)	
						{													
							if (_rows[index].data[_temp.filterColumns[column]].toLowerCase ().indexOf(_temp.filterValue.toLowerCase ()) != -1)
							{	
								skip = false;			
								break;								
							}	
						}												
					}
					else if (_temp.filterDirection == "out")
					{							
						for (column = 0; column < filterColumnsLength; column++)	
						{
							if (_rows[index].data[_temp.filterColumns[column]].toLowerCase ().indexOf(_temp.filterValue.toLowerCase ()) == -1)
							{
								skip = false;
								break;								
							}	
						}
					}
					
					if (skip)
					{
						continue;
					}
				}				
											
				if (_rows[index].level == idx)
				{
					try
					{
						drawRow (_rows[index]);
					}
					catch (Exception)
					{							
					}							
				}
			}
		}	
		}			
	}	
	
	function drawRow (attributes)
	{							
		// Create new TreeItem.
		var treeItem = document.createElement ('treeitem');				
		treeItem.setAttribute ("id", attributes.data.id +"-treeitem");
									
		// If isChildOfId is set, append TreeItem to correct TreeChildren.
		if (attributes.isChildOfId)
		{														
			if (!_elements[attributes.isChildOfId] +"-treeChildren")
			{						
				var treeChildren = document.createElement ("treechildren");
				treeChildren.setAttribute ("id", attributes.isChildOfId +"-treechildren");	
				
				document.getElementById (attributes.isChildOfId +"-treeitem").appendChild (treeChildren);
				document.getElementById (attributes.isChildOfId +"-treeitem").setAttribute ("container", true);						
			}
			
			document.getElementById (attributes.isChildOfId +"-treechildren").appendChild (treeItem);
		}
		else
		{		
			_elements.treeChildren.appendChild (treeItem)
		}		
		
		// Get treelevel.
		attributes.level = getLevel (treeItem);
										
		// Create TreeRow.
		var treeRow = document.createElement ('treerow');
		treeItem.appendChild (treeRow);
																
		// Find TreeColumns and fill them with data.
		var treeColumns = _elements.tree.columns;											
		for (var idx = 0; idx < treeColumns.length; idx++)
		{
			var treeColumn = treeColumns.getColumnAt (idx);					
			
			if (attributes.data[treeColumn.id] != null)
			{
				var treeCell = document.createElement ('treecell');
				treeCell.setAttribute ('label', attributes.data[treeColumn.id]);
				treeRow.appendChild (treeCell);
			}
		}																			
	}	
	
	function clear ()
	{				
		while (_elements.treeChildren.firstChild) 
		{
			_elements.treeChildren.removeChild (_elements.treeChildren.firstChild);
		}
		
	//	_rows = new Array ();
	}
	
	function clear2 ()
	{
		clear ()
		_rows = new Array ();
	}
			
	function sort (attributes)
	{
		if (!attributes)
			attributes = new Array ();
			
		if (!attributes.direction)
			attributes.direction = null;
								
		// Remove sortdirection on currently sorted column.
		if (_temp.sortColumn != null)
		{
			document.getElementById (_temp.sortColumn).removeAttribute ("sortDirection");
		}
																		 
		// Figure out sortdirection.
		// If its the same column we are sorting, just reverse sort direction.
		// If its not the same, we start with ascending.  							
		if (attributes.direction == null)
		{
			if (_temp.sortColumn == attributes.column)
			{
				if (_temp.sortDirection == "ascending")
				{
					attributes.direction = "descending";
				}
				else
				{
					attributes.direction = "ascending";
				}
			}
			else
			{
				attributes.direction = "ascending";
			}
		}  				
		
		_temp.sortColumn = attributes.column;
		_temp.sortDirection = attributes.direction; 
  				  																		
		// Refresh rows.
		refresh ();
													
		// Set sortdirection on newly sorted column.	
		document.getElementById (attributes.column).setAttribute ("sortDirection", _temp.sortDirection);				 												
	}
	
	function filter (attributes)
	{
		if (!attributes)
			attributes = new Array ();
			
		if (!attributes.direction)
			attributes.direction = "in";
					
		_temp.filterColumns = attributes.columns.split (",");
		_temp.filterValue = attributes.value;
		_temp.filterDirection = attributes.direction;
		
		refresh ();
	}
			
	function addRow (attributes)
	{
		// Set attributes.
		if (!attributes)
			attributes = new Array ();
			
		if (!attributes.id)
			attributes.id = SNDK.tools.newGuid ();
			
		if (!attributes.data)
			attributes.data = new Array ();
			
		if (!attributes.data.id)
			throw "Data does not container Id key.";
								
		if (!attributes.isOpen)
			attributes.isOpen = false;
			
		if (attributes.isChildOfId)
		{
			attributes.level = getLevel2 (attributes.isChildOfId);
			
			dump (attributes.level +"\n");
		}
		else
		{
			attributes.level = 0;
		}
		
		var checkforrow =	function (id)
							{
							    for (var idx = 0; idx < _rows.length; idx++) 
							    {
								if (_rows[idx].id == id) 
								{
								return true;
								}
							}    									
							return false;
							};		
				
		if (!checkforrow (attributes.id))
		{
	 		_rows[_rows.length] = attributes;
	 	}
	 		 		 				 
	 	refresh ();
	 	
	 	return attributes.id;
	}	
	
	function removeRow (attributes)
	{
		var row = -1;

		if (!attributes)
			attributes = new Array ();
							
		if (!attributes.data)
			attributes.data = new Array ();
		
		
																										
		if (!attributes.id)
		{
			row = _elements.tree.currentIndex;
		}
		else
		{				
			for (var idx in _rows)
			{
				if (_rows[idx].data.id == attributes.id)
				{			
					_rows.splice (idx, 1);
					break;										
				}
			}											
		//	for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
		//	{
		//		if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
		//		{					
		//			row = idx;				
		//			break;
		//		}
		//	}
		}
		
		refresh ();
		//if (row != -1)
		//{
		//	_elements.tree.view.getItemAtIndex (row).parentNode.removeChild (_elements.tree.view.getItemAtIndex (row));
		//}
	}
			
	function setRow (attributes)
	{
		var row = -1;
	
		if (!attributes)
			attributes = new Array ();
				
		if (!attributes.data)
			attributes.data = new Array ();
								
		if (!attributes.data.id)
		{
		
		}
		else
		{
			for (idx in _rows)
			{
				if (_rows[idx].data.id == attributes.data.id)
				{
					// Find TreeColumns and change data.
					var treeColumns = _elements.tree.columns;											
					for (var idx2 = 0; idx2 < treeColumns.length; idx2++)
					{
						var treeColumn = treeColumns.getColumnAt (idx2);
						if (attributes.data[treeColumn.id] != null)
						{
							_rows[idx].data[treeColumn.id] = attributes.data[treeColumn.id];									
						}
					}		
					break;										
				}
			}
		}
		
		refresh ();				
	}		
	
	function getRow (attributes)
	{
		var result = new Array ();
		var row = -1;
		
		if (!attributes)
			attributes = new Array ();
			
		if (!attributes.id)
		{
			row = _elements.tree.currentIndex;
		}
		else
		{
			for (var idx = 0; idx < _elements.tree.view.rowCount; idx++) 
			{
				if (_elements.tree.view.getCellText (idx, _elements.tree.columns.getNamedColumn ('id')) == attributes.id)
				{					
					row = idx;
					break;
				}
			}	
		}
							
		if (row != -1)
		{	
			// Find TreeColumns and fill result with data.
			var treeColumns = _elements.tree.columns;											
			for (idx = 0; idx < treeColumns.length; idx++)
			{
				var treeColumn = treeColumns.getColumnAt (idx);																	
				result[treeColumn.id] = _elements.tree.view.getCellText (row, treeColumn);													
			}				
		}
		
		return result;
	}
			
			
			
			
			
	function getCurrentIndex ()
	{
		return _elements.tree.view.selection.currentIndex; //returns -1 if the tree is not focused
	}						
												
	function getLevel (element)
	{				
		var parser =	function (element, count)
						{
							//dump (element.parentNode.nodeName +" : "+ count +"\n");
							if (element.parentNode.nodeName != "tree")
							{
								if (element.parentNode.nodeName != "treechildren")
								{
									count++;
								}
								
								return parser (element.parentNode, count++)
							}
							return count;				
						};
	
		return parser (element, 0);				
	}
			
	function getLevel2 (id)
	{
		var parser =	function (id, count)
						{
							count++;
							for (index in _rows)
							{
								//dump (id +" "+ _rows[index].data.id +" "+ _rows[index].data.parentid +"\n")
								
								if ((_rows[index].data.id == id) && (_rows[index].data.parentid != SNDK.tools.emptyGuid))
								{																					
									return parser (_rows[index].data.parentid, count)
								}
							}
							return count;
						};
						
		return parser (id, 0)
	}
}	