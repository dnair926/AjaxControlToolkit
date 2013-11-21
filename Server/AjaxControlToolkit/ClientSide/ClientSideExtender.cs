using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("ClientSide.ClientSideBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ClientSide.ClientSideBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.ClientSideDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.ClientSideBehavior", "ClientSide.ClientSideBehavior.js")]
    [TargetControlType(typeof(WebControl))]
    public class ClientSideExtender : ExtenderControlBase
    {
        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue(ClientSideTargetControlType.DropdownList)]
        [ExtenderControlProperty]
        public ClientSideTargetControlType TargetControlType
        {
            get { return GetPropertyValue("TargetControlType", ClientSideTargetControlType.DropdownList); }
            set { SetPropertyValue("TargetControlType", value); }
        }

        /// <summary>
        /// Specify the type of control
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ArgumentValues {
            get { return GetPropertyValue("ArgumentValues", ""); }
            set { SetPropertyValue("ArgumentValues", value); }
        }

        /// <summary>
        /// Handler to attach to the client-side itemSelected event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("userAction")]
        public string OnUserAction
        {
            get { return GetPropertyValue("OnUserAction", string.Empty); }
            set { SetPropertyValue("OnUserAction", value); }
        }

        /// <summary>
        /// Handler to attach to the client-side itemSelected event
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlEvent]
        [ClientPropertyName("pageInit")]
        public string OnPageInit
        {
            get { return GetPropertyValue("OnPageInit", string.Empty); }
            set { SetPropertyValue("OnPageInit", value); }
        }
    }
}
