import EditorComponent from './EditorComponent'

export default class EditorInstance {

  constructor(editorHtmlElement, adorList) {
    this.adorList = adorList
    this.editor = new EditorComponent(editorHtmlElement, this.adorList)
  }


  getHtml() {
    return this.editor.getHtml()
  }

  setHtml(html) {
    this.editor.setHtml(html)
  }

}