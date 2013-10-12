// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;

[assembly: System.Web.UI.WebResource("Visibility.VisibilityBehavior.js", "text/javascript")]

namespace AjaxControlToolkit {
    /// <summary>
    /// An extender class which adds collapse/expand behavior to an ASP.NET Panel control.
    /// 
    /// The panel that is extended can then be collapsed or expanded by the user of the page, which is handy
    /// for doing things like showing or hiding content or maximizing available space.
    /// </summary>
    [Designer("AjaxControlToolkit.VisibilityDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.VisibilityBehavior", "Visibility.VisibilityBehavior.js")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [DefaultProperty("ParentControlID")]
    public class VisibilityExtender : ExtenderControlBase {
        /// <summary>
        /// Default constructor to enable client state
        /// </summary>
        public VisibilityExtender() {
            EnableClientState = true;
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityControlType.Panel)]
        [ExtenderControlProperty]
        public VisibilityControlType TargetControlType {
            get { return GetPropertyValue("TargetControlType", VisibilityControlType.Panel); }
            set { SetPropertyValue("TargetControlType", value); }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityControlType.DropdownList)]
        [ExtenderControlProperty]
        public VisibilityControlType ParentControlType {
            get { return GetPropertyValue("ParentControlType", VisibilityControlType.DropdownList); }
            set { SetPropertyValue("ParentControlType", value); }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(VisibilityAction.Show)]
        [ExtenderControlProperty]
        public VisibilityAction ActionOnValueSelected {
            get { return GetPropertyValue("ActionOnValueSelected", VisibilityAction.Show); }
            set { SetPropertyValue("ActionOnValueSelected", value); }
        }

        /// <summary>
        /// Comma delimited Values to check to make the target control visible/hidden. 
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ValuesToCheck {
            get { return GetPropertyValue("ValuesToCheck", ""); }
            set { SetPropertyValue("ValuesToCheck", value); }
        }

        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty]
        public string ParentControlID {
            get { return GetPropertyValue("ParentControlID", ""); }
            set { SetPropertyValue("ParentControlID", value); }
        }

        /// <summary>
        /// ID of the textbox control to set focus to when showing a panel.
        /// </summary>
        [IDReferenceProperty(typeof(TextBox))]
        [DefaultValue("")]
        [SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty]
        public string FocusControlID {
            get { return GetPropertyValue("FocusControlID", ""); }
            set { SetPropertyValue("FocusControlID", value); }
        }
        /// <summary>
        /// Handler to attach to the client-side itemSelected event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("valueChanged")]
        public string OnValueChanged {
            get { return GetPropertyValue("OnValueChanged", string.Empty); }
            set { SetPropertyValue("OnValueChanged", value); }
        }

        //protected override void OnPreRender(EventArgs e) {
        //    Control parentControl = base.FindControl(this.ParentControlID);
        //    Control targetControl = base.FindControl(this.TargetControlID);
        //    string value = "";
        //    string[] valuesToCheck = this.ValuesToCheck.Split(",".ToCharArray());
        //    VisibilityAction visibility = VisibilityAction.Show;

        //    // Get value from parent control
        //    if (parentControl is DropDownList) {
        //        DropDownList ddl = (DropDownList)parentControl;
        //        value = ddl.SelectedValue;
        //    } else if (parentControl is RadioButtonList) {
        //        RadioButtonList rbl = (RadioButtonList)parentControl;
        //        value = rbl.SelectedValue;
        //    } else if (parentControl is CheckBox) {
        //        CheckBox cb = (CheckBox)parentControl;
        //        value = cb.Checked.ToString();
        //    } else if (parentControl is TextBox) {
        //        TextBox tb = (TextBox)parentControl;
        //        value = tb.Text.Trim();
        //    }

        //    bool valueSelected = false;
        //    foreach (string val in valuesToCheck) {
        //        if (string.Equals(val, value, StringComparison.OrdinalIgnoreCase)) {
        //            valueSelected = true;
        //            break;
        //        }
        //    }

        //    //Determine whether to show or hide target control based on the value from parent control and action to take when value selected
        //    if (valueSelected) {
        //        if (this.ActionOnValueSelected == VisibilityAction.Show) {
        //            visibility = VisibilityAction.Show;
        //        } else {
        //            visibility = VisibilityAction.Hide;
        //        }
        //    } else {
        //        if (this.ActionOnValueSelected == VisibilityAction.Show) {
        //            visibility = VisibilityAction.Hide;
        //        } else {
        //            visibility = VisibilityAction.Show;
        //        }
        //    }

        //    //Set the visibility of the control.
        //    if (targetControl is WebControl) {
        //        WebControl webControl = (WebControl)targetControl;
        //        if (visibility == VisibilityAction.Show) {
        //            webControl.Style.Remove("display");
        //        } else {
        //            webControl.Style.Add("display", "none");
        //        }
        //    } else if (targetControl is HtmlControl) {
        //        HtmlControl htmlControl = (HtmlControl)targetControl;
        //        if (visibility == VisibilityAction.Show) {
        //            htmlControl.Style.Remove("display");
        //        } else {
        //            htmlControl.Style.Add("display", "none");
        //        }
        //    }

        //    base.OnPreRender(e);
        //}
    }
}