import { AppGesture } from "../../lib/AppGesture";
import { Vibro } from "../../lib/Vibro";
import { FsUtils } from "../../lib/FsUtils";
import { Vocabulary } from "../lib/Vocabulary";


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;


class VocabularySearchPage {
    constructor(param) {
        this.params = param
        this.path = param.path
        this.hPath = param.path
        this.vocabulary = param.vocabulary
        VocabularySearchPage.this = this
        
        while (this.hPath.indexOf("/") !== -1) this.hPath = this.hPath.replace("/", "")
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
            text: this.hPath
        })

        const vocabulary = new Vocabulary('data/' + this.vocabulary + '.VOC');
        let verbsCount = vocabulary.readFileJSON('data/' + this.path + "/count.json") // FsUtils.fetchJSON("data/" + this.vocabulary + "/" + this.path + "/count.json");
        let verbsIt = vocabulary.readFileJSON('data/' + this.path + "/it.json") // FsUtils.fetchJSON("data/" + this.vocabulary + "/" + this.path + "/it.json");
        vocabulary.close()
        

        let listData = []
        verbsIt.forEach(element => {
            listData.push(element)
        })
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
                if (index > verbsIt.length - 1) { // list of words
                    hmApp.gotoPage({ url: "page/vocabularySearch", param: JSON.stringify({
                        vocabulary: VocabularySearchPage.this.vocabulary,
                        path: VocabularySearchPage.this.path + '/' + listData[index].letter
                    }) }) 
                } else { // Concrete word
                    hmApp.gotoPage({ url: "page/word", param: JSON.stringify({
                        vocabulary: VocabularySearchPage.this.vocabulary,
                        path: VocabularySearchPage.this.path,
                        word: listData[index].en,
                        data: listData[index]
                    }) }) 
                }
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
                },
                {
                    type_id: 1,
                    item_bg_color: 0x4c8bf5,
                    item_bg_radius: 10,
                    text_view: [
                        {x: 5, y: 13, w: 192 - 20, h: 28, key: "en", color: 0xffffff, text_size: 28 },
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
                    end: verbsIt.length - 1,
                    type_id: 1
                },
                {
                    start: verbsIt.length,
                    end: listData.length - 1,
                    type_id: 0
                },
                
            ],
            data_type_config_count: 2
        })

    }
}



__$$module$$__.module = DeviceRuntimeCore.Page({
    onInit(param) {

        param = JSON.parse(param)
        // console.log("QQ!")
        new VocabularySearchPage(param).run()

    },
    onDestroy() {

        // On destroy, remove if not required

    }
});
