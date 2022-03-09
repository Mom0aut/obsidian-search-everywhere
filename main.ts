import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Scope, Setting } from 'obsidian';

let pressed;
let lastPressed: any;
let isDoublePress: boolean;

const timeOut = () => setTimeout(() => isDoublePress = false, 500);

function openSearchWhenDoubleShift(key:any,app:App){
	if(key.key != "Shift"){
		return
	}
	pressed = key.keyCode;
	if (isDoublePress && pressed === lastPressed) {
		isDoublePress = false;
		simulateSearchHotkey(app);
	} else {
		console.log("One Time pressed!")
		isDoublePress = true;
		timeOut();
	}
	lastPressed = pressed;
}

function simulateSearchHotkey(app:App){
	// @ts-ignore
	app.commands.executeCommandById('global-search:open')
}

export default class SearchEverywherePlugin extends Plugin {
	async onload() {
		this.registerDomEvent(window, 'keyup', (event) => openSearchWhenDoubleShift(event,this.app))
	}
}


