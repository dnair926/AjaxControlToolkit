


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />


Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.VisibilityControlType = function() {
    /// <summary>
    /// The VisibilityControlType enumeration describes the type of parent control
    /// </summary>
    /// <field name="DropdownList" type="Number" integer="true" />
    /// <field name="RadiobuttonList" type="Number" integer="true" />
    /// <field name="CheckBox" type="Number" integer="true" />
    throw Error.invalidOperation();
};
Sys.Extended.UI.VisibilityControlType.prototype = {
    DropdownList : 0,
    RadiobuttonList : 1,
    CheckBox : 2,
    Panel : 3,
    TextBox : 4,
    Label : 5,
    LinkButton : 6,
    TableRow : 7,
    TableCell : 8,
    Table: 9,
    CheckBoxList: 10
}
Sys.Extended.UI.VisibilityControlType.registerEnum('Sys.Extended.UI.VisibilityControlType');
Sys.Extended.UI.VisibilityAction = function() {
    throw Error.invalidOperation();
}
Sys.Extended.UI.VisibilityAction.prototype = {
    Hide : 0,
    Show : 1
}
Sys.Extended.UI.VisibilityAction.registerEnum('Sys.Extended.UI.VisibilityAction');

Sys.Extended.UI.VisibilityBehavior = function(element) {
    /// <summary>
    /// The VisibilityBehavior allows you to add collapsible sections to your page
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Element to associate the behavior with
    /// </param>
    Sys.Extended.UI.VisibilityBehavior.initializeBase(this, [element]);
    
    // property values
    this._collapsed = false;    
    this._disableClientEvent = false;
    this._parentControlType = Sys.Extended.UI.VisibilityControlType.DropdownList;
    this._targetControlType = Sys.Extended.UI.VisibilityControlType.Panel;
    this._actionOnValueSelected =  Sys.Extended.UI.VisibilityAction.Show;
    this._parentControlID = null;
    this._focusControlID = null;
    this._valuesToCheck = null;
   
    //handler delegates
    this._eventHandler = null;
}
Sys.Extended.UI.VisibilityBehavior.prototype = {    
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.VisibilityBehavior.callBaseMethod(this, 'initialize');
        
        var element = this.get_element();
        var parentElement = $get(this._parentControlID);

        if (!parentElement) {
            throw Error.argument('ParentControlID', String.format(Sys.Extended.UI.Resources.Visibility_NoControlID, this._parentControlID));
        } else if (parentElement !== null) {
            if (!this._disableClientEvent) {
                this._eventHandler = Function.createDelegate(this, this._toggle);

                switch (this._parentControlType) {
                    case Sys.Extended.UI.VisibilityControlType.DropdownList: //DropdownList
                        $addHandler(parentElement, 'change', this._eventHandler);
                        break;
                    case Sys.Extended.UI.VisibilityControlType.TextBox: //DropdownList
                        $addHandler(parentElement, 'blur', this._eventHandler);
                        break;
                    case Sys.Extended.UI.VisibilityControlType.RadiobuttonList:  //RadiobuttonList
                    case Sys.Extended.UI.VisibilityControlType.CheckBox: //CheckBox
                    case Sys.Extended.UI.VisibilityControlType.CheckBoxList:
                        $addHandler(parentElement, 'click', this._eventHandler);
                        break;
                }
            }

            //if (this.isValueSelected()) {
            //    if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Show) {
            //        this._collapsed = false;
            //    } else if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Hide) {
            //        this._collapsed = true;
            //    }
            //} else {
            //    if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Show) {
            //        this._collapsed = true;
            //    } else if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Hide) {
            //        this._collapsed = false;
            //    }
            //}
            
            //// setup the initial size and state
            //var e = this.get_element();
            //if (this._collapsed) {
            //    e.style.display = 'none';
            //} else {            
            //    e.style.display = '';
            //} 
        }
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        
        var parentElement = $get(this._parentControlID);
               
        if ((this._eventHandler)&&(parentElement)) {
            switch (this._parentControlType) {
                case Sys.Extended.UI.VisibilityControlType.DropdownList:
                    $removeHandler(parentElement, 'change', this._eventHandler);
                    break;
                case Sys.Extended.UI.VisibilityControlType.TextBox:
                    $removeHandler(parentElement, 'blur', this._eventHandler);
                    break;
                case Sys.Extended.UI.VisibilityControlType.RadiobuttonList:
                case Sys.Extended.UI.VisibilityControlType.CheckBox:
                case Sys.Extended.UI.VisibilityControlType.CheckBoxList:
                    $removeHandler(parentElement, 'click', this._eventHandler);
                    break;
            }
        }
        
        Sys.Extended.UI.VisibilityBehavior.callBaseMethod(this, 'dispose');
    },

    _doClose : function() {
        /// <summary>
        /// Collapse the panel. Internal function, to close call "collapsePanel".
        /// </summary>
        /// <param name="eventObj" type="Sys.UI.DomEvent" mayBeNull="true" optional="true">
        /// Event Info
        /// </param>
        
        var eventArgs = new Sys.CancelEventArgs();
        if (eventArgs.get_cancel()) {
            return;
        }

        var e  = this.get_element();
        e.style.display = 'none';
    },
    
    _doOpen : function() {
        /// <summary>
        /// Expand the Panel. Internal function, to close call "expandPanel".
        /// </summary>
        /// <param name="eventObj" type="Sys.UI.DomEvent" mayBeNull="true" optional="true">
        /// Event Info
        /// </param>

        var eventArgs = new Sys.CancelEventArgs();
        if (eventArgs.get_cancel()) {
            return;
        }

        var e  = this.get_element();
        e.style.display = '';
        //Set focus to the control specified
        this.setFocus();
    },
    
    _toggle : function(eventObj) {
        /// <summary>
        /// Event handler to epxand or collapse the panel (based on its current state)
        /// Internal function. Please use "togglePanel(eventObj)" to get same functionality.
        /// </summary>
        /// <param name="eventObj" type="Sys.UI.DomEvent" mayBeNull="true" optional="true">
        /// Event Info
        /// </param>          
        this.changeControlMode();
        this.raiseValueChanged(new Sys.EventArgs());
    },
    
    changeControlMode : function() {
        if (this.isValueSelected()) {
            if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Show) {
                this._collapsed = true;
            } else if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Hide) {
                this._collapsed = false;
            }
        } else {
            if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Show) {
                this._collapsed = false;
            } else if (this._actionOnValueSelected == Sys.Extended.UI.VisibilityAction.Hide) {
                this._collapsed = true;
            }
        }
//        if (this.isValueSelected()) {
//            this._collapsed = true;
//        } else {
//            this._collapsed = false;
//        }

        if (this._collapsed) {
            return this._doOpen();
        } else {
            //Clear values from controls being hid.
            this.clearControlsHiding();
            return this._doClose();
        }
    },
        
    clearControlsHiding : function() {
        /// <summary>
        /// Clear Textboxes, Dropdowns, Multiline Textboxes, Checkboxes.
        /// </summary>

        var e = this.get_element();
        
        switch (this._targetControlType) {
            case Sys.Extended.UI.VisibilityControlType.Panel:
            case Sys.Extended.UI.VisibilityControlType.Table:
            case Sys.Extended.UI.VisibilityControlType.TableRow:
            case Sys.Extended.UI.VisibilityControlType.TableCell:
                $common.clearInputElementsInsideContainer(e);
                break;
            case Sys.Extended.UI.VisibilityControlType.DropdownList:
            case Sys.Extended.UI.VisibilityControlType.RadiobuttonList:
            case Sys.Extended.UI.VisibilityControlType.CheckBox:
            case Sys.Extended.UI.VisibilityControlType.TextBox:
                $common.clearControl(e);
                break;
        }
    },
    
    setFocus : function() {
        $common.setFocus(this._focusControlID);
    },

    isValueSelected : function() {
        var valueList = this._valuesToCheck;
        var values = '';
        if (valueList !== null) {
            values = valueList.split(',');
        }
        var valueFound = false;
        var parentElement = $get(this._parentControlID);
        var i = 0;

        if (parentElement !== null) {
            switch (this._parentControlType) {
                case Sys.Extended.UI.VisibilityControlType.DropdownList:
                    if (values.length > 0) {
                        for(i = 0; i < values.length; i++){
                            if (parentElement.value == values[i]) {
                                return true;
                            }
                        }
                    }
                    break;
                case Sys.Extended.UI.VisibilityControlType.RadiobuttonList:
                    if (values.length > 0) {
                        var inputNodes = parentElement.getElementsByTagName('INPUT');
                        for (i = 0; i < inputNodes.length; i++) {
                            if ((inputNodes[i]) && (inputNodes[i].type = 'radio') && (inputNodes[i].checked)) {
                                for (j = 0; j < values.length; j++) {
                                    if (inputNodes[i].value == values[j]) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case Sys.Extended.UI.VisibilityControlType.CheckBoxList:
                    if (values.length > 0) {
                        var inputNodes = parentElement.getElementsByTagName('INPUT');
                        for (i = 0; i < inputNodes.length; i++) {
                            if ((inputNodes[i]) && (inputNodes[i].type = 'checkbox') && (inputNodes[i].checked)) {
                                for (j = 0; j < values.length; j++) {
                                    if (inputNodes[i].value == values[j]) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    break;
                case Sys.Extended.UI.VisibilityControlType.CheckBox:
                    if ((parentElement) && (parentElement.checked)) {
                        return true;
                    }
                    break;
            }
        }
        return false;
    },
    add_valueChanged : function(handler) {
        /// <summary>
        /// Add an event handler for the valueChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('valueChanged', handler);
    },
    remove_valueChanged : function(handler) {
        /// <summary>
        /// Remove an event handler from the valueChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('valueChanged', handler);
    },
    raiseValueChanged : function(eventArgs) {
        /// <summary>
        /// Raise the valueChanged event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.AutoCompleteItemEventArgs" mayBeNull="false">
        /// Event arguments for the itemSelected event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('valueChanged');
        if (handler) {
            handler(this, eventArgs);
            //If the text is used, should HtmlEncode to format all ASCII codes back to normal.
//            this.get_Value.HtmlEncode();
        }
    },
    get_Collapsed : function() {
        /// <value type="Boolean">
        /// Whether or not the panel is collapsed
        /// </value>
        return this._collapsed;        
    },    
    set_Collapsed : function(value) {
        // if we're changing values, and we're live, togglePanel.
        if (this.get_isInitialized() && this.get_element() && value != this._collapsed()) {
            this._toggle();
        }
        else {
            this._collapsed = value;
            this.raisePropertyChanged('Collapsed');
        }
    },
    get_DisableClientEvent: function () {
        /// <value type="Boolean">
        /// Whether or not to disable client actions
        /// </value>
        return this._disableClientEvent;
    },
    set_DisableClientEvent: function (value) {
        if (this._disableClientEvent != value) {
            this._disableClientEvent = value;
            this.raisePropertyChanged('disableClientEvent');
        }
    },

    get_ParentControlID : function() {
        /// <value type="String">
        /// ID of the control used to collapse the target when clicked
        /// </value>
        return this._parentControlID;
    },
    set_ParentControlID: function(value) {
        if (this._parentControlID != value) {
            this._parentControlID = value;
            this.raisePropertyChanged('parentControlID');
        }
    },

    get_FocusControlID : function() {
        /// <value type="String">
        /// ID of the control used to collapse the target when clicked
        /// </value>
        return this._focusControlID;
    },
    set_FocusControlID: function(value) {
        if (this._focusControlID != value) {
            this._focusControlID = value;
            this.raisePropertyChanged('focusControlID');
        }
    },

    get_ValuesToCheck : function() {
        /// <value type="String">
        /// ID of the control used to collapse the target when clicked
        /// </value>
        return this._valuesToCheck;
    },
    set_ValuesToCheck : function(value) {
        if (this._valuesToCheck != value) {
            this._valuesToCheck = value;
            this.raisePropertyChanged('valuesToCheck');
        }
    },

    get_ActionOnValueSelected : function() {
        /// <value type="String">
        /// ID of the control used to collapse the target when clicked
        /// </value>
        return this._actionOnValueSelected;
    },
    set_ActionOnValueSelected : function(value) {
        if (this._actionOnValueSelected != value) {
            this._actionOnValueSelected = value;
            this.raisePropertyChanged('actionOnValueSelected');
        }
    },

    get_ParentControlType : function() {
        /// <value type="Sys.Extended.UI.VisibilityExpandDirection">
        /// Type of the Parent Control Type (can be either "DropdownList" or "RadiobuttonList" or "CheckBox")
        /// </value>
        return this._parentControlType;
    },      
    set_ParentControlType : function(value) {
        if (this._parentControlType != value) {
            this._parentControlType = value;
            this.raisePropertyChanged('ParentControlType');
        }
    },

    get_TargetControlType : function() {
        /// <value type="Sys.Extended.UI.VisibilityExpandDirection">
        /// Type of the Parent Control Type (can be either "DropdownList" or "RadiobuttonList" or "CheckBox")
        /// </value>
        return this._targetControlType;
    },      
    set_TargetControlType : function(value) {
        if (this._targetControlType != value) {
            this._targetControlType = value;
            this.raisePropertyChanged('TargetControlType');
        }
    }
}
Sys.Extended.UI.VisibilityBehavior.registerClass('Sys.Extended.UI.VisibilityBehavior', Sys.Extended.UI.BehaviorBase);