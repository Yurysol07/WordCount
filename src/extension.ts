'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, commands, Disposable, TextDocument, StatusBarItem, StatusBarAlignment, ExtensionContext} from 'vscode';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "WordCount" is now active!');

    let wordCounter = new WordCounter();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
        wordCounter.updateWordCount();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class WordCounter {

    private _statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);

    public updateWordCount() {
        let editor = window.activeTextEditor;
        if(!editor) {
            this._statusBarItem.hide();
        }

        let doc = editor.document;

        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);
            this._statusBarItem.text = wordCount !== 1 ? `${wordCount} words` : '1 word';
            this._statusBarItem.show();
        }
        else {
            this._statusBarItem.hide();
        }
    }

    public _getWordCount(doc: TextDocument): number {

        let docContent = doc.getText();

        docContent = docContent.replace(/(< ([^>]+)<)/g, "").replace(/\s+/g, " ");
        docContent = docContent.replace(/^\s\s*/, "").replace(/\s\s*$/, "");

        let wordCount = 0;

        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
}