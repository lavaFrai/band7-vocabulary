import {FSFile} from "./FSFile"

export class VocabularyFile {
    constructor (addr) {
        this.addr = addr
    }
}

export class VocabularyFileData {
    constructor (addr, name, isDir, ptr) {
        this.addr = addr
        this.name = name
        this.isDir = isDir
        this.ptr = ptr

        this.file = new VocabularyFile(addr)
    }
}

export class VocabularyDirTable {
    constructor (addr, first, count) {
        this.addr = addr
        this.first = first
        this.count = count
    }
}

export class VocabularyDirNode {
    constructor (addr, ptr, last, next) {
        this.addr = addr
        this.ptr = ptr
        this.last = last
        this.next = next

        this.file = new VocabularyFile(this.ptr)
    }
}

export class Vocabulary {
    constructor (path) {
        this.filePath = path;
        this.file = hmFS.open_asset(this.filePath, hmFS.O_RDONLY);

        this.readHeader()
    }

    getRoot() {
        return new VocabularyFile(this.rootAddr) 
    }

    readHeader() {
        this.sign = FSFile.readU32(this.file)
        this.version = FSFile.readU16(this.file)
        this.name = FSFile.readS8(this.file)
        this.wordsTotal = FSFile.readU32(this.file)
        this.rootAddr = FSFile.readU32(this.file)
        console.log(this.name)
    }

    getFileData(file) {
        FSFile.seek(this.file, file.addr)
        let isDir = FSFile.readU8(this.file)
        let ptr = FSFile.readU32(this.file)
        let name = FSFile.readS16(this.file)
        return new VocabularyFileData(file.addr, name, (isDir == 1), ptr)
    }

    getDirTable(file) {
        let fileData = this.getFileData(file)
        let addr = fileData.ptr
        FSFile.seek(this.file, addr)
        let first = FSFile.readU32(this.file)
        let count = FSFile.readU32(this.file)

        return new VocabularyDirTable(addr, first, count)
    } 

    getDirNode(addr) {
        FSFile.seek(this.file, addr)
        let prt = FSFile.readU32(this.file)
        let last = FSFile.readU32(this.file)
        let next = FSFile.readU32(this.file)

        return new VocabularyDirNode(addr, prt, last, next)
    } 

    listDir(file) {
        let fileData = this.getFileData(file)
        if (! fileData.isDir) return []

        let dirTable = this.getDirTable(file)
        let files = []

        let nextAddr = dirTable.first
        while (nextAddr != 0) {
            let node = this.getDirNode(nextAddr)
            files.push(this.getFileData(node.file))
            nextAddr = node.next
        }

        return files
    }

    getFileChildByName(file, name) {
        let fileData = this.getFileData(file)
        if (! fileData.isDir) return null

        let dirTable = this.getDirTable(file)

        let nextAddr = dirTable.first
        while (nextAddr != 0) {
            let node = this.getDirNode(nextAddr)
            let fileData = this.getFileData(node.file)

            if (fileData.name == name) return fileData.file;

            nextAddr = node.next
        }

        return null
    }

    getFileByPath(path) {
        path = path.split('/')
        path = path.filter(n => n)

        let f = this.getRoot()

        path.forEach(element => {
            f = this.getFileChildByName(f, element)
        });

        return f;
    }

    readFileTextDirect(file) {
        let dataPtr = this.getFileData(file).ptr
        
        FSFile.seek(this.file, dataPtr)

        return FSFile.readS32(this.file)
    }

    readFileText(path) {
        let file = this.getFileByPath(path)
        let dataPtr = this.getFileData(file).ptr
        
        FSFile.seek(this.file, dataPtr)

        return FSFile.readS32(this.file)
    }

    readFileJSON(path) {
        let text = this.readFileText(path)
        return JSON.parse(text)
    }

    close() {
        hmFS.close(this.close)
    }
}
