import config from './config'

export default class EditorAction {
    constructor(editor, adorsList) {
        this.editorClass = editor
        this.adorsArr = adorsList
        this.textArea = $(editor.htmlContainer).find('textarea')
        this.codeMirror = null
        this.textArea.on('froalaEditor.commands.after', (e, editor, cmd, param1, param2) => {
            if (cmd == 'html' && editor.codeView.isActive()) {
                this.codeMirror = editor.$box.find(".CodeMirror")[0].CodeMirror;
            }
        })
    }

    editorInitEditor(editor, t) {
        editor.$el
            .on('dragenter', config.allowDrop, (e) => $(e.target).addClass('drag-over'))
            .on('dragleave', config.allowDrop, (e) => $(e.target).removeClass('drag-over'))

        editor.events.on('drop', (dropEvent) => t.onDrop(editor, dropEvent), true)
    }

    onBlockClick(block) {
        if (this.textArea.froalaEditor('codeView.isActive')) {
            const pos = this.codeMirror.doc.getCursor()
            this.codeMirror.doc.replaceRange(block.html, pos);
        } else {
            this.textArea.froalaEditor('undo.saveStep');
            this.textArea.froalaEditor('html.insert', block.html, false);
            this.textArea.froalaEditor('undo.saveStep');
        }
    }

    onAdoorClick(ador) {
        if (this.textArea.froalaEditor('codeView.isActive')) {
            const pos = this.codeMirror.doc.getCursor()

            this.codeMirror.doc.replaceRange(`${ador.propertyName}="${ador.html}"`, pos);
        } else {
            this.textArea.froalaEditor('undo.saveStep');
            this.textArea.froalaEditor('html.insert', ador.html, false);
            this.textArea.froalaEditor('undo.saveStep');
        }
    }

    onDrop(editor, dropEvent) {

        editor.markers.insertAtPoint(dropEvent.originalEvent);
        var $marker = editor.$el.find('.fr-marker');
        $marker.replaceWith($.FroalaEditor.MARKERS);
        editor.selection.restore();

        // Save into undo stack the current position.
        if (!editor.undo.canDo()) {
            editor.undo.saveStep();
        }


        const data = dropEvent.originalEvent.dataTransfer.getData('Text')

        if (!data) {
            return true;
        }

        editor.$el.find('.drag-over').removeClass('drag-over')
        const obj = JSON.parse(data)

        if (obj.propertyName) {
            const el = $(dropEvent.target)
            el.attr(obj.propertyName, obj.html)
        } else {
            editor.html.insert(obj.html)
        }


        editor.undo.saveStep();

        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        return false;
    }

    onCodeViewDrop(e, event, editor) {

        editor.selection.restore();

        if (this.editorClass.mySideBar._DragElement) {
            let obj = JSON.parse(this.editorClass.mySideBar._DragElement)

            let pos = this.codeMirror.doc.cm.coordsChar({ left: event.x, top: event.y })

            if (obj.propertyName) {
                this.codeMirror.doc.replaceRange(`${obj.propertyName}= "${obj.html}"`, pos);
            } else {
                this.codeMirror.doc.replaceRange(obj.html, pos);
            }

            this.editorClass.mySideBar._DragElement = ""
            editor.undo.saveStep();

            event.preventDefault();
            event.stopPropagation();
        }


        return false;
    }
}