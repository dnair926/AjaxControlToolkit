using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("AjaxControlToolkit.ClientSide.ClientSideBehavior.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.ClientSideDesigner, AjaxControlToolkit")]
    [ClientScriptResource("AjaxControlToolkit.ClientSideBehavior", "AjaxControlToolkit.ClientSide.ClientSideBehavior.js")]
    [TargetControlType(typeof(WebControl))]
    public class ClientSideExtender : ExtenderControlBase
    {
        /// <summary>
        /// Default constructor to enable client state
        /// </summary>
        public ClientSideExtender()
        {
            EnableClientState = true;
        }

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
