<%@ Page Title="CapsLock Sample" Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true" CodeFile="CapsLock.aspx.cs" Inherits="CapsLock_CapsLock" Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
        EnableScriptLocalization="true" ID="ScriptManager1" />

    <div class="demoarea">
        <div class="demoheading">
            CapsLock Demonstration</div>
        <br />
        <br />
        <asp:TextBox runat="server" ID="tbPassword" autocomplete="off" TextMode="Password" /><br />
        <ajaxToolkit:CapsLockExtender ID="cpePassword" runat="server" TargetControlID="tbPassword" />
        <div style="font-size: 90%">
            <em>(Type with CapsLock key on and see message and type with CapsLock key off to hide the message)</em></div>
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            CapsLock Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            CapsLock is an ASP.NET AJAX extender that can be attached to any ASP.NET TextBox
            control especially Password textbox. It shows a warning message when typing into the 
            TextBox with CapsLock key on.
        </p>
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            CapsLock Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <pre>&lt;ajaxToolkit:CapsLockExtender runat="server"
    TargetControlID="tbPassword"
    <em>CssClass</em>="ClassName"
    <em>WarningIconImageUrl</em>="~/Images/Waring.gif"
    <em>CloseImageUrl</em>="~/Images/Close.gif" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the TextBox to extend with the CapsLock.</li>
            <li><strong>CssClass</strong> - Name of the CSS class used to style the CapsLock. </li>
            <li><strong>WarningIconImageUrl</strong> - URL of image to show for warning icon. Replaces the default yellow icon.</li>
            <li><strong>CloseImageUrl</strong> - URL of image to show to close the popup. Replaces the default X icon to the top right of popup</li>
        </ul>
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" SuppressPostBack="false" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="True" ImageControlID="Properties_ToggleImage" SuppressPostBack="false" />
</asp:Content>

