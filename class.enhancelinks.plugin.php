<?php if (!defined('APPLICATION')) exit();

/* EnhanceLinks Plugin for Vanilla Forums by Seon-Wook Park | CC BY-NC-SA */

$PluginInfo['EnhanceLinks'] = array(
	'Name' => 'EnhanceLinks',
	'Description' => 'Enhances links with actions such as prepending favicon images.',
	'Version' => '0.1.1',
	'Date' => '20 Jan 2012',
	'Author' => 'Seon-Wook Park',
	'AuthorEmail' => 'seon.wook@swook.net',
	'AuthorUrl' => 'http://www.swook.net/',
	'RequiredTheme' => FALSE,
	'RequiredPlugins' => FALSE,
	'RegisterPermissions' => FALSE,
	'SettingsPermission' => FALSE,
	'License' => 'CC BY-NC-SA'
);

class EnhanceLinksPlugin implements Gdn_IPlugin {

	public function Base_Render_Before(&$Sender) {
		if ($Sender->DeliveryType() == DELIVERY_TYPE_ALL && $Sender->SyndicationMethod == SYNDICATION_NONE) {
			$Sender->AddJsFile('plugins/EnhanceLinks/enhancelinks.js');
			$Sender->AddCssFile('plugins/EnhanceLinks/design/style.css');
		}
	}

    public function Setup() {
    }
}
