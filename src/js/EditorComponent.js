import 'codemirror-html-plugin'
import 'froala-editor-js'
import 'froala-draggable-plugin'

import CodeMirror from '../../node_modules/codemirror/lib/codemirror.js'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/froala-editor/css/froala_editor.pkgd.min.css'
import '../../node_modules/froala-editor/css/froala_style.min.css'
import '../../node_modules/font-awesome/css/font-awesome.min.css'
import '../../node_modules/froala-editor/css/plugins/draggable.min.css'

import config from './config'
import SideBar from './SideBar'
import EditorAction from './EditorAction'



export default class EditorComponent {
    constructor(htmlContainer, adorsList) {
        this.htmlContainer = $(htmlContainer)
        this.mySideBar = null
        this.codeMirror = null
        this.adors = adorsList.map(a => {
            let { html, adorIconImage } = config.adorsMap[a.type]

            return {
                ...a,
                ...config.adorsMap[a.type],
                html: html.replace(/\$ADORNAME\$/g, a.name),
            }
        })
        this.initialize()
    }

    initialize() {
        this.createEditor()

        this.mySideBar.onBlockClickEvent = (block) => this.editorAction.onBlockClick(block)
        this.mySideBar.onAdorClickEvent = (ador) => this.editorAction.onAdoorClick(ador)
    }

    createEditor() {
        const xmpcontainerhtml = `
        <div class="xmp-container">
            <div class="editor"><textarea></textarea></div>
        </div>`

        this.htmlContainer.append(xmpcontainerhtml)
        this.textArea = this.htmlContainer.find('textarea')
        this.mySideBar = new SideBar(this.adors, this.htmlContainer)
        this.editorAction = new EditorAction(this, this.adors)

        this.textArea
            .on('froalaEditor.initialized', (e, editor) => this.editorAction.editorInitEditor(editor, this.editorAction))
            .on('froalaEditor.commands.after', (event, editor, cmd, param1, param2) => {
                if (cmd == 'html' && editor.codeView.isActive()) {
                    this.codeMirror = editor.$box.find(".CodeMirror")[0].CodeMirror;
                    this.codeMirror.on('drop', (e, event) => this.editorAction.onCodeViewDrop(e, event, editor), true)
                }
            })
            .froalaEditor(Object.assign({ height: this.mySideBar.heightOffset, codeMirror: CodeMirror }, config.editorConfig))
    }


    getHtml() {
        return this.textArea.froalaEditor('html.get')
    }

    setHtml(html, clean) {
        this.textArea.froalaEditor('html.insert', html, clean);
    }

}