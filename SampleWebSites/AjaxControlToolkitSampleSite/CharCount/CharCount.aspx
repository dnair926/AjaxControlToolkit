<%@ Page Title="CharCount sample" Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true" CodeFile="CharCount.aspx.cs" Inherits="CharCount_CharCount" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" />

    <div class="demoarea">
        <div class="demoheading">
            CharCount Demonstration</div>
        <br />
        <br />
        <asp:TextBox runat="server" ID="tbTest" autocomplete="off" style="width:400px;" /><br />
        <ajaxToolkit:CharCountExtender ID="cceTest" TargetControlID="tbTest" MaxCharLength="100" runat="server" WarningPercentage="75" PopupPosition="BottomRight" />
        <div style="font-size: 90%">
            <em>(Start typing to see the character count popup)</em></div>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            CharCount Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            CharCount is an ASP.NET AJAX extender that can be attached to any ASP.NET TextBox
            control. It shows the number of characters / words entered and the total number of character allowed as tooltip.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            CharCount Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <pre>&lt;ajaxToolkit:CharCountExtender runat="server" 
        <em>TargetControlID</em>="tbTest"
        <em>ToolTipCssClass</em>="CssClass"
        <em>ToolTipCssClassForMax</em>="MaximumEnteredClass"
        <em>ToolTipCssClassForWarning</em>="WarningClass"
        <em>DataFormatString</em>="{5} total characters allowed. {1} characters entered."
        <em>MaxCharLength</em>="100"
        <em>WarningPercentage</em>="75" /&gt;</pre>

        <ul>
            <li><strong>TargetControlID</strong> - The ID of the TextBox to extend with the CharCount.</li>
            <li><strong>ToolTipCssClass</strong> - Name of the CSS class used to style the CharCount tooltip. </li>
            <li><strong>ToolTipCssClassForMax</strong> - Name of the CSS class used to style the CharCount tooltip when maximum allowed characters entered. </li>
            <li><strong>ToolTipCssClassForWarning</strong> - Name of the CSS class used to style the CharCount tooltip when maximum allowed characters is about to reach. </li>
            <li><strong>DataFormatString</strong> - Format of the string to show in tooltip. Use {0} for the word count, {1} for the character count, {2} for the number of words remaining, {3} for the number of characters remaining, {4} for the maximum number of words allowed, {5} for the maximum number of characters allowed.</li>
            <li><strong>MaxCharLength</strong> - Maximum allowed characters </li>
            <li><strong>WarningPercentage</strong> - Percentage at which to show the tooltip with warning css style. </li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" SuppressPostBack="false" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" SuppressPostBack="false" />
</asp:Content>

