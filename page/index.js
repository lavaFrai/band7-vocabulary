import { AppGesture } from "../../lib/AppGesture";
import { Vibro } from "../../lib/Vibro";
import { FsUtils } from "../../lib/FsUtils";


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;


class VocabulariesListPage {
    constructor(param) {
        this.params = param
        VocabulariesListPage.this = this
    }

    run() {
        this.initUi()

    }

    initUi() {
        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 5,
            y: 45,
            w: 192 - 10,
            h: 35,
            color: 0xffffff,
            text_size: 28,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.NONE,
            text: "Vocabularies"
        })

        let verbsCount = FsUtils.fetchJSON("data/list.json");

        let listData = []
        verbsCount.forEach(element => {
            listData.push({
                name: element
            })
        })
        listData.push({
            title: "About"
        })

        hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
            x: 5,
            y: 100,
            w: 192-10,
            h: 380,
            item_space: 10,
            item_click_func: (list, index) => { 
                if (index != (listData.length - 1)) { hmApp.gotoPage({ url: "page/vocabulary", param: listData[index].name }) }
                else { hmApp.gotoPage({ url: "page/about", param: listData[index].name }) }
            },
            item_config: [
                {
                    type_id: 0,
                    item_bg_color: 0x202020,
                    item_bg_radius: 10,
                    text_view: [
                        {x: 5, y: 13, w: 192 - 20, h: 28, key: "name", color: 0xffffff, text_size: 28 },
                    ],
                    text_view_count: 1,
                    item_height: 60
                },
                // About item
                {
                    type_id: 1,
                    item_bg_color: 0x4c8bf5,
                    item_bg_radius: 10,
                    text_view: [
                        {x: 5, y: 13, w: 192 - 20, h: 28, key: "title", color: 0xffffff, text_size: 28 },
                    ],
                    text_view_count: 1,
                    item_height: 60
                }
            ],
            item_config_count: 2,
            data_array: listData,
            data_count: listData.length,
            data_type_config: [
                {
                    start: 0,
                    end: listData.length - 2,
                    type_id: 0
                },
                {
                    start: listData.length - 1,
                    end: listData.length - 1,
                    type_id: 1
                }
            ],
            data_type_config_count: 2
        })

    }
}



__$$module$$__.module = DeviceRuntimeCore.Page({
    onInit(param) {

        // console.log("QQ!")
        new VocabulariesListPage(param).run()

    },
    onDestroy() {

        // On destroy, remove if not required

    }
});
