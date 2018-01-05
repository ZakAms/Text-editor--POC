import EditorInstance from './EditorInstance'

import '../style/index.less'
import ADORSLIST from '../configuration/adorslist'
import ADOR from '../configuration/ador'

const editorinstance = new EditorInstance(document.getElementById("editor_container"), ADORSLIST, ADOR);
