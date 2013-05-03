tree : function (attributes)
{
	var _attributes = attributes;				
	var _elements = new Array ();
	var _rows = new Array ();
	
	var _temp = {};			
	_temp.refresh = true;
	_temp.filterColumns = new Array ();
	_temp.visibleRows = 0;
	_temp.breakRefresh = false;
	_temp.refreshInProgress = false;
	
	this.addRow = addRow;
	this.removeRow = removeRow;
	
	this.setRow = setRow;
	this.getRow = getRow;
	
	this.select = select;
	
	this.enableRefresh = enableRefresh;
	this.disableRefresh = disableRefresh;
							
	this.sort = sort;		
	this.filter = filter;							
	
	this.clear = clear2;
	
	this.getCurrentIndex = getCurrentIndex;
	this.setCurrentIndex = setCurrentIndex;
	
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
		
		
		var oldView = _elements.tree.view;									
		var newView = 
		{
			DROP_BEFORE : -1,
			DROP_ON : 0,
			DROP_AFTER : 1,
			PROGRESS_NORMAL : 1, 	
		 	PROGRESS_UNDETERMINED : 2,
		 	PROGRESS_NONE : 3,  
    		
    		selection :  oldView.selection,
    		
    		canDrop : function (index, orientation, dataTransfer)
    		{
    			return oldView.canDrop (index, orientation, dataTrasnfer);
    		},
    		
    		canDropBeforeAfter : function (index, before)
    		{
    			return oldView.canDropBeforeAfter (index, before);
    		},
    		
    		canDropOn : function (index)
    		{
    			return oldView.canDropOn (index);
    		},
    		
    		cycleCell : function (index)
    		{
    			return oldView.cycleCell (index);
    		},
    					
			cycleHeader : function (col)
			{
				return oldView.cycleHeader (col);
			},
			
			drop : function (row, orientation, dataTransfer)
			{
				return oldView.drop (row, orientation, dataTransfer);
			},
			
			getCellProperties : function (row, col, properties)
			{
				return oldView.getCellProperties (row, col, properties)
			},
			
			getCellText : function (row, col)
			{
				return oldView.getCellText (row, col);
			},
					
			getCellValue : function (row, col)
			{				
				return oldView.getCellValue (row, col);
			},
			
			getColumnProperties : function (col, properties)
			{
				return oldView.getColumnProperties (col, properties);
			},
			
			getImageSrc : function (row, col)
			{
				return oldView.getImageSrc (row, col);
			},
			
			getLevel : function (index)
			{
				return oldView.getLevel (index);
			},
			
	 		getParentIndex : function (rowIndex)
			{
				return oldView.getParentIndex (rowIndex);
			},
						
	 		getProgressMode : function (row, col)
			{	
				return oldView.getProgressMode (row, col);
			},
			
	 		getRowProperties : function (index, properties)
			{
				return oldView.getRowProperties (index, properties);
			},
			
		 	hasNextSibling : function (rowIndex, afterIndex)
			{	
				return oldView.hasNextSibling (rowIndex, afterIndex);
			},
			
		 	isContainer : function (index)
			{
				return oldView.isContainer (index);
			},
					
		 	isContainerEmpty : function (index)
			{
				return oldView.isContainerEmpty (index);
			},
			
		 	isContainerOpen : function (index)
			{
				return oldView.isContainerOpen (index);
			},
			
		 	isEditable : function (row, col)
			{
				return oldView.isEditable (row, col);
			},
			
		 	isSelectable : function (row, col)
			{
				return oldView.isSelectable (row, col);
			},
			
		 	isSeparator : function (index)
			{
				return oldView.isSeparator (index);
			},
			
		 	isSorted : function ()
			{
				return oldView.isSorted ();
			},
						
			performAction : function (action)
			{
				return oldView.performAction (action);
			},
			
			performActionOnCell : function (action, row, col)
			{
				return oldView.performActionOnCell (action, row, col);
			},
			
	 		performActionOnRow : function (action, row)
			{
				return oldView.performActionOnRow (action, row);
			},
			
	 		selectionChanged : function ()
			{
				return oldView.selectionChanged ();
			},			
		
	 		setCellText : function (row, col, value)
			{								
//				sXUL.console.log (col +" - "+ col.id);
//				_rows[row][col.id] = value;
			
				return oldView.setCellText (row, col, value);
				
				eventOnCellChange (row, col, value);
			},
			
	 		setCellValue : function (row, col, value)
			{								
//				sXUL.console.log (row +" - "+ col.id +" "+ value);				
//				_rows[row].data[col.id] = value;
							
				return oldView.setCellValue (row, col, value);
				
				eventOnCellChange (row, col, value);
			},
			
	 		setTree : function (tree)
			{
				return oldView.setTree (tree);
			},
			
	 		toggleOpenState : function (index)
			{
			//sXUL.console.log (oldView.toggleOpenState)
				return oldView.toggleOpenState (index)
			}		
		};
		
		newView.__defineGetter__("rowCount", function() { return _temp.visibleRows; });		
		
		_elements.tree.view = newView;
	};
	
	
	function select (row)
	{
		if (row == -1)
		{
			_elements.tree.view.selection.clear ();
		}
		
		//sXUL.console.log (row +" "+ _elements.tree.view.rowCount)
		
		if (row > -1 && row <= (_elements.tree.view.rowCount - 1))		
		{
			_elements.tree.view.selection.select (row);	
			
			var boxobject = _elements.tree.boxObject;
  			boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
  			boxobject.ensureRowIsVisible(row);			
		}
	}
	
	
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
			_temp.refreshInProgress = true;
		
			_temp.visibleRows = 0;
		// Clear all rows.
		var visiblerow = _elements.tree.treeBoxObject.getFirstVisibleRow ();
		var currentrow = _elements.tree.currentIndex;
		
		var onselect = _elements.tree.onselect;
		_elements.tree.onselect = null;
		
		//_elements.treeChildren.collapsed = true;
		
		clear ();
		
		var compareFunc;
		if (_temp.sortDirection == "ascending") 
		{
			compareFunc = function (second, first) 
			{
				var a = first.data[_temp.sortColumn].toLowerCase ();
				var b = second.data[_temp.sortColumn].toLowerCase ();
			
				function chunkify (t) 
				{
    				var tz = [], x = 0, y = -1, n = 0, i, j;

    				while (i = (j = t.charAt(x++)).charCodeAt(0)) 
    				{
      					var m = (i == 46 || (i >=48 && i <= 57));
      					if (m !== n) 
      					{
        					tz[++y] = "";
        					n = m;
      					}
      					tz[y] += j;
    				}
    				return tz;
  				}

  				var aa = chunkify(a+"".toLowerCase ());
  				var bb = chunkify(b+"".toLowerCase ());

  				for (x = 0; aa[x] && bb[x]; x++) 
  				{
    				if (aa[x] !== bb[x]) 
    				{
      					var c = Number(aa[x]), d = Number(bb[x]);
      					if (c == aa[x] && d == bb[x]) 
      					{
       					return c - d;
      					} else return (aa[x] > bb[x]) ? 1 : -1;
    				}
  				}
  				return aa.length - bb.length;
		};
		
		
//		compareFunc = 	function (second, first) 
//						{    									
//							
//							if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
//							{
//								return -1;	
//							}
//							
//							if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
//							{
//								return 1;	
//							}
//						}
		} 
		else 
		{  	
		compareFunc = function (first, second) 
			{
				var a = first.data[_temp.sortColumn].toLowerCase ();
				var b = second.data[_temp.sortColumn].toLowerCase ();
			
				function chunkify (t) 
				{
    				var tz = [], x = 0, y = -1, n = 0, i, j;

    				while (i = (j = t.charAt(x++)).charCodeAt(0)) 
    				{
      					var m = (i == 46 || (i >=48 && i <= 57));
      					if (m !== n) 
      					{
        					tz[++y] = "";
        				n = m;
      					}
      					tz[y] += j;
    				}
    				return tz;
  				}

  				var aa = chunkify(a+"".toLowerCase ());
  				var bb = chunkify(b+"".toLowerCase ());

  				for (x = 0; aa[x] && bb[x]; x++) 
  				{
    				if (aa[x] !== bb[x]) 
    				{
      					var c = Number(aa[x]), d = Number(bb[x]);
      					if (c == aa[x] && d == bb[x]) 
      					{
        					return c - d;
      					} else return (aa[x] > bb[x]) ? 1 : -1;
    				}
  				}
  				return aa.length - bb.length;
			};
								
//		compareFunc = 	function (first, second) 
//						{       	
						//	
						//	
						//	if (first.data[_temp.sortColumn].toLowerCase () < second.data[_temp.sortColumn].toLowerCase ())
						//	{
						//		return -1;	
						//	}
						//	
						//	if (first.data[_temp.sortColumn].toLowerCase () > second.data[_temp.sortColumn].toLowerCase ())
						//	{
						//		return 1;	
						//	}
						//	return 0;      								
						//};
		}
		
		// Sort rows.
		if (_temp.sortColumn != null)
		{
			_rows.sort (compareFunc);
			

			
			
			//_rows.sort (naturalSort);
			
//			if (_temp.sortDirection != "ascending") 
//			{
//				_rows.reverse ();
//			}
			
//			sXUL.console.log (_temp.sortDirection)
						
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
						_temp.visibleRows++;
						
					}
					catch (Exception)
					{							
					}							
				}
			}
			
		}
		
		//_elements.treeChildren.collapsed = false;
		
			if (currentrow >= 0)
			{
				_elements.tree.view.selection.select (currentrow);				
			}
			
			
  			_elements.tree.treeBoxObject.scrollToRow (visiblerow);				
  			_elements.tree.onselect = onselect;
  			
  			_temp.refreshInProgress = false;
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
				document.getElementById (attributes.isChildOfId +"-treeitem").setAttribute ("open", false);						
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
				if (treeColumn.editable == false)
				{
					treeCell.setAttribute ('editable', false);
				}
				treeCell.setAttribute ('label', attributes.data[treeColumn.id]);
				treeRow.appendChild (treeCell);
			}
		}			
		
		//app.thread.update ();																
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
			
			
		if (_temp.filterValue.length > 1 || _temp.filterValue.length == 0)
		{	
			refresh ();
		}
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
	 	else
	 	{
	 		setRow (attributes);
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
			var ok = false;
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
							ok = true;
							///break;
						}
					}		
					break;										
				}
			}
			if (!ok)
			{
				addRow (attributes);
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
				if (treeColumn.type == 1)
				{
					result[treeColumn.id] = _elements.tree.view.getCellText (row, treeColumn);
				}
				else if (treeColumn.type == 2)
				{
					result[treeColumn.id] = _elements.tree.view.getCellValue (row, treeColumn);
				}
				
			}				
			
//			for (idx in _rows[row].data)
//			{
//				result[idx] = _rows[row].data[idx];
				//sXUL.console.log (idx)
//			}
//						result = _rows[row].data;
		}
		
		return result;
	}
			
			
			
			
			
	function getCurrentIndex ()
	{
		return _elements.tree.view.selection.currentIndex; //returns -1 if the tree is not focused
	}						
	
	function setCurrentIndex (value)
	{
		_elements.tree.view.selection.currentIndex = value;
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
		
	function eventOnCellChange (row, col, value)
	{
		if (attributes.onCellChange != null)
		{
			setTimeout (function () { attributes.onCellChange (row, col.id, value)}, 1);
		}
	}
}	