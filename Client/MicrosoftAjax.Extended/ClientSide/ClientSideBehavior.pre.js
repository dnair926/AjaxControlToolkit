
Sys.Extended.UI.ClientSideTargetControlType = function() {
    /// <summary>
    /// The ClientSideTargetControlType enumeration describes the type of parent control
    /// </summary>
    /// <field name="DropdownList" type="Number" integer="true" />
    /// <field name="RadiobuttonList" type="Number" integer="true" />
    /// <field name="CheckBox" type="Number" integer="true" />
    /// <field name="TextBox" type="Number" integer="true" />
    throw Error.invalidOperation();
}
Sys.Extended.UI.ClientSideTargetControlType.prototype = {
    DropdownList : 0,
    RadiobuttonList : 1,
    CheckBox : 2,
    TextBox : 3
}
Sys.Extended.UI.ClientSideTargetControlType.registerEnum('Sys.Extended.UI.ClientSideTargetControlType');

Sys.Extended.UI.ClientSideBehavior = function(element) {
    /// <summary>
    /// The ClientSideBehavior allows you to add collapsible sections to your page
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Element to associate the behavior with
    /// </param>
    Sys.Extended.UI.ClientSideBehavior.initializeBase(this, [element]);
    
    // property values
    this._targetControlType = Sys.Extended.UI.ClientSideTargetControlType.DropdownList;

    //handler delegates
    this._eventHandler = null;
}
Sys.Extended.UI.ClientSideBehavior.prototype = {    
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.ClientSideBehavior.callBaseMethod(this, 'initialize');
        
        var element = this.get_element();

        // setup all of our handlers.
        this._eventHandler = Function.createDelegate(this, this.userActionEvent);

        switch (this._targetControlType) {
            case Sys.Extended.UI.ClientSideTargetControlType.DropdownList: //DropdownList
                $addHandler(element, 'change', this._eventHandler);
                break;
            case Sys.Extended.UI.ClientSideTargetControlType.TextBox: //TextBox
                $addHandler(element, 'blur', this._eventHandler);
                break;
            case Sys.Extended.UI.ClientSideTargetControlType.RadiobuttonList:  //RadiobuttonList
            case Sys.Extended.UI.ClientSideTargetControlType.CheckBox: //CheckBox
                $addHandler(element, 'click', this._eventHandler);
                break;
        }
        
        this.onInit();
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        
        var element = this.get_element();

        if (this._eventHandler) {
            switch (this._targetControlType) {
                case Sys.Extended.UI.ClientSideTargetControlType.DropdownList: //DropdownList
                    $removeHandler(element, 'change', this._eventHandler);
                    break;
                case Sys.Extended.UI.ClientSideTargetControlType.TextBox: //DropdownList
                    $removeHandler(element, 'blur', this._eventHandler);
                    break;
                case Sys.Extended.UI.ClientSideTargetControlType.RadiobuttonList:  //RadiobuttonList
                case Sys.Extended.UI.ClientSideTargetControlType.CheckBox: //CheckBox
                    $removeHandler(element, 'click', this._eventHandler);
                    break;
            }
        }
       
        Sys.Extended.UI.ClientSideBehavior.callBaseMethod(this, 'dispose');
    },
    
    onInit : function() {
        var eventArgs = new Sys.CancelEventArgs();
        this.raisepageInit(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
    },
    
    userActionEvent : function() {
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseuserAction(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
    },

    get_TargetControlType : function() {
        /// <value type="String">
        /// ID of the control used to collapse the target when clicked
        /// </value>
        return this._targetControlType;
    },
    set_TargetControlType: function(value) {
        if (this._targetControlType != value) {
            this._targetControlType = value;
            this.raisePropertyChanged('targetControlType');
        }
    },
    add_pageInit : function(handler) {
        /// <summary>
        /// Add an event handler for the collapsing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('pageInit', handler);
    },
    remove_pageInit : function(handler) {
        /// <summary>
        /// Remove an event handler from the collapsing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('pageInit', handler);
    },
    raisepageInit : function(eventArgs) {
        /// <summary>
        /// Raise the collapsing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the collapsing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('pageInit');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    add_userAction : function(handler) {
        /// <summary>
        /// Add an event handler for the collapsing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('userAction', handler);
    },
    remove_userAction : function(handler) {
        /// <summary>
        /// Remove an event handler from the collapsing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('userAction', handler);
    },
    raiseuserAction : function(eventArgs) {
        /// <summary>
        /// Raise the collapsing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the collapsing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('userAction');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.ClientSideBehavior.registerClass('Sys.Extended.UI.ClientSideBehavior', Sys.Extended.UI.BehaviorBase);