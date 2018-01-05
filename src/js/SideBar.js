import config from './config'

const TOOLBOX_WIDTH_INITIAL = 200;
const RESIZE_DELAY = 500;

export default class SideBar {

    constructor(adorslist, htmlcontainer) {
        this.heightOffset = 0
        this.htmlContainer = htmlcontainer
        this.adorList = adorslist;
        this.htmlContainer = this.htmlContainer.find('.xmp-container')
        this.sideBarContainer = null
        this._onBlockClickEvent = null
        this._onAdorClickEvent = null
        this._DragElement = null

        this.sidebarBuild(this)
            // window.addEventListener("resize", this.myFunction);

    }

    adjustOpenItemHeight() {
        let Panel = this.htmlContainer.find('.active + .panel')

        if (this.heightOffset == 0) {
            this.heightOffset = Panel.height() - 5
        }

        this.htmlContainer.find('.panel').each(function(index) { $(this).css('height', '0px') })
        let p = this.heightOffset - (this.sideBarContainer.height() - this.heightOffset)
        Panel.css('height', p + 'px');
    }


    sidebarBuild() {
        const blocksPanel = config.blocks
            .map(b => `<div  class="block" draggable="true" key="${b.key}" ><img key="${b.key}" src="${b.iconImage}" alt="${b.key}" width="50" height="50"></div>`)
            .join('')
        const adorPanel = this.adorList
            .map(value => `<div key="${value.name}" type="${value.type}" class="ador" draggable="true"><img  key="${value.name}"  src="../images/clear.png" ><i class="${value.adorIconImage}">&nbsp;</i>${value.name}</div>`)
            .join('')


        const htmlframe = `<div class='side floating-toolbox-container' >
                <div class="acctitle ">Tools</div>
                <div >
                    <button class="accordion">Building Blocks</button>
                    <div class="panel">${blocksPanel}</div>
                </div>
                <div>
                    <button class="accordion active">ADORs</button>
                <div class="panel adors-panel">${adorPanel}</div>
                </div>
            </div>`

        this.htmlContainer.append(htmlframe)
        this.sideBarContainer = this.htmlContainer.find('.side')
        this.adjustOpenItemHeight()

        this.sideBarContainer.on('click', '.accordion', (e) => {
            this.sideBarContainer.find('.active').removeClass('active')

            const target = $(e.target)
            target.addClass('active')
            this.adjustOpenItemHeight()
        })

        this.sideBarContainer.on('click', '.block', (e) => {
            const key = $(e.target).attr('key')
            if (this._onBlockClickEvent) {
                this._onBlockClickEvent(config.blocksMap[key])
            }
        })

        this.sideBarContainer.on('click', '.ador', (e) => {
            const key = $(e.target).attr('key')
            if (this._onAdorClickEvent) {
                this._onAdorClickEvent(this.adorList.filter(a => a.name === key)[0])
            }
        })

        this.sideBarContainer.find('.ador, .block').on('dragstart', (e) => {
            const key = e.target.getAttribute('key')
            const obj = config.blocksMap[key] || this.adorList.filter(a => a.name === key)[0]

            let o = JSON.stringify(obj)

            e.originalEvent.dataTransfer.setData('Text', o)
            this._DragElement = o

        })
    }

    set onBlockClickEvent(v) {
        this._onBlockClickEvent = v
    }

    set onAdorClickEvent(v) {
        this._onAdorClickEvent = v
    }
}