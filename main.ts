import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Scope, Setting } from 'obsidian';

let lastKeyupTime = 0;
let lastKeyWasShifted:boolean

function openSearchWhenDoubleShift(event:KeyboardEvent,app:App){
	let key = event.key
	if (key !== "Shift") {
		lastKeyupTime = 0;
		return;
	}
	if(lastKeyWasShifted){
		lastKeyWasShifted = false;
		return;
	}
	if (Date.now() - lastKeyupTime < 500) {
		lastKeyupTime = 0;
		simulateSearchHotkey(app)
		return;
	}
	lastKeyupTime = Date.now();
}

function clearTimerWhenShifted(event:KeyboardEvent){
	let key = event.key
	let shiftKey = event.shiftKey;
	if(key !== "Shift" && shiftKey===true){
		lastKeyWasShifted = true
	}
}

function simulateSearchHotkey(app:App){
	// @ts-ignore
	app.commands.executeCommandById('global-search:open')
}

export default class SearchEverywherePlugin extends Plugin {
	async onload() {
		this.registerDomEvent(window, 'keyup', (event) => openSearchWhenDoubleShift(event,this.app))
		this.registerDomEvent(window, 'keydown', (event) => clearTimerWhenShifted(event))
	}
}
