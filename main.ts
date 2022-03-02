import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Scope, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}




const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

let pressed;
let lastPressed: any;
let isDoublePress: boolean;

const handleDoublePresss = (key: { keyCode?: any; key?: any; })=> {
    console.log(key.key, 'pressed two times');
	searchEverywhere();
}

const timeOut = () => setTimeout(() => isDoublePress = false, 500);

const keyPress = (key: { keyCode?: any; key?: any; }) => {
    pressed = key.keyCode;
    if (isDoublePress && pressed === lastPressed) {
        isDoublePress = false;
        handleDoublePresss(key);
    } else {
        isDoublePress = true;
        timeOut();
    }
    lastPressed = pressed;
}

function searchEverywhere(){
	//Press STRG+SHIFT+F
	window.dispatchEvent(new KeyboardEvent('keydown', {
		key: "f",
		keyCode: 70,
		code: "KeyE",
		which: 70,
		shiftKey: true,
		ctrlKey: true,
		metaKey: false
	  }));
}

function addDoubleKeypressEventListener() {
	window.addEventListener('keydown', (e) => {
		if (e.keyCode == 16) {
			keyPress(e);
		}
	});
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();
		addDoubleKeypressEventListener();
		// This adds a settings tab so the user can configure various aspects of the plugin
		//this.addSettingTab(new SampleSettingTab(this.app, this));
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}


