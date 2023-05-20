import { AppGesture } from "../../lib/AppGesture";
import { Vibro } from "../../lib/Vibro";
import { FsUtils } from "../../lib/FsUtils";
import { Vocabulary } from "../lib/Vocabulary";


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;


class VocabularyPage {
    constructor(param) {
        this.params = param
        this.name = param
        VocabularyPage.this = this
    }

    run() {
        this.initUi()

    }

    initUi() {
        const vocabulary = new Vocabulary('data/' + this.name + '.VOC');

        let data = vocabulary.getFileChildByName(  
            vocabulary.getRoot(),
            'data' 
        )
        let data2 = vocabulary.getFileChildByName(  
            data,
            'count.json' 
        )

        hmUI.createWidget(hmUI.widget.TEXT, {
            x: 5,
            y: 45,
            w: 192 - 10,
            h: 35,
            color: 0xffffff,
            text_size: 28,
            align_h: hmUI.align.CENTER_H,
            align_v: hmUI.align.CENTER_V,
            text_style: hmUI.text_style.WRAP,
            text: vocabulary.name
        })

        let verbsCount = vocabulary.readFileJSON('data/count.json')
        vocabulary.close()

        let listData = [] 
        for (var key in verbsCount) {
            if (verbsCount[key] > 0) {

                listData.push({
                    letter: key,
                    count: verbsCount[key] + " words"
                })
            }
        }

        hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
            x: 5,
            y: 100,
            w: 192-10,
            h: 380,
            item_space: 10,
            item_click_func: (list, index) => { 
                hmApp.gotoPage({ url: "page/vocabularySearch", param: JSON.stringify({
                    vocabulary: VocabularyPage.this.name,
                    path: listData[index].letter
                }) }) 
            },
            item_config: [
                {
                    type_id: 0,
                    item_bg_color: 0x202020,
                    item_bg_radius: 10,
                    text_view: [
                        {x: 5, y: 5, w: 192 - 20, h: 32, key: "letter", color: 0xffffff, text_size: 28 },
                        {x: 5, y: 5 + 28 + 15, w: 192 - 20, h: 20, key: "count", color: 0xaaaaaa, text_size: 20},
                    ],
                    text_view_count: 2,
                    item_height: 80
                }
            ],
            item_config_count: 1,
            data_array: listData,
            data_count: listData.length,
            data_type_config: [
                {
                    start: 0,
                    end: listData.length - 1,
                    type_id: 0
                }
            ],
            data_type_config_count: 1
        })

    }
}



__$$module$$__.module = DeviceRuntimeCore.Page({
    onInit(param) {

        // console.log("QQ!")
        new VocabularyPage(param).run()

    },
    onDestroy() {

        // On destroy, remove if not required

    }
});
