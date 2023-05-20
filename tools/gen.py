import struct
import os


class VocabularyFile:
    def __init__(self, addr):
        self.addr = addr


class Vocabulary:
    def __init__(self, file, name):
        self.file = file
        self.name = name
        self.root = VocabularyFile(0)
        self.rootAddr = 0
        self.writeHeader()

    def writeHeader(self):
        # sign
        self.file.write(b"lvff")
        # version
        self.writeUInt16(1)
        # name size
        self.writeStringWithUInt8Len(self.name)
        # words total
        self.writeUInt32(137)
        # root index
        self.rootAddr = self.file.tell()
        self.writeUInt32(0)

        self.root = self.mkFile(None, 'root', 1)
        self.setFilePtr(self.root, self.makeDirTable())
        self.setRoot(self.root)

    def setFilePtr(self, file, ptr):
        t = self.file.tell()
        self.file.seek(file.addr + 1)
        self.writeUInt32(ptr)
        self.file.seek(t)

    def getFilePtr(self, file):
        t = self.file.tell()
        self.file.seek(file.addr + 1)
        p = self.readUInt32()
        self.file.seek(t)
        return p

    def DirAddChild(self, file, child):
        dta = self.getFilePtr(file)
        tn = self.mkDirNode(child.addr)

        t = self.file.tell()

        self.file.seek(dta + 4)
        c = self.readUInt32()
        self.file.seek(dta + 4)
        self.writeUInt32(c + 1)

        self.file.seek(dta)

        if c == 0:
            self.writeUInt32(tn)
        else:
            next = self.readUInt32()
            while next != 0:
                self.file.seek(next+8)
                next = self.readUInt32()
            self.file.seek(self.file.tell()-4)
            newLast = self.file.tell()-8
            self.writeUInt32(tn)
            self.file.seek(tn+4)
            self.writeUInt32(newLast)

        self.file.seek(t)
        
    def mkDirNode(self, ptr, last=0, next=0):
        t = self.file.tell()
        self.writeUInt32(ptr)
        self.writeUInt32(last)
        self.writeUInt32(next)
        return t

    def mkFile(self, parent, name, type=0):
        f = VocabularyFile(self.file.tell())

        self.writeUInt8(type)
        self.writeUInt32(0)
        self.writeStringWithUInt16Len(name)
        if parent is not None:
            self.DirAddChild(parent, f)

        return f

    def mkDir(self, parent, name):
        f = self.mkFile(parent, name, 1)
        t = self.makeDirTable()
        self.setFilePtr(f, t)
        return f

    def makeDirTable(self):
        t = self.file.tell()
        self.writeUInt32(0)
        self.writeUInt32(0)
        return t

    def writeUInt32(self, val):
        valBin = struct.pack('I', val)
        self.file.write(valBin)

    def readUInt32(self):
        data = self.file.read(4)
        return struct.unpack('I', data)[0]

    def readUInt16(self):
        data = self.file.read(2)
        return struct.unpack('H', data)[0]

    def readUInt8(self):
        data = self.file.read(1)
        return struct.unpack('B', data)[0]

    def readUInt16String(self):
        size = self.readUInt16()
        data = self.file.read(size)
        return data.decode('utf8')

    def readUInt32String(self):
        size = self.readUInt32()
        data = self.file.read(size)
        return data.decode('utf8')

    def fileWriteData(self, file, data):
        t = self.file.tell()
        self.writeBinaryWithUInt32Len(data)
        self.setFilePtr(file, t)

    def writeBinaryWithUInt32Len(self, data):
        self.writeUInt32(len(data))
        self.file.write(data)

    def readBinaryWithUInt32Len(self):
        size = self.readUInt32()
        data = self.file.read(size)
        return data

    def writeUInt16(self, val):
        valBin = struct.pack('H', val)
        self.file.write(valBin)

    def writeUInt8(self, val):
        valBin = struct.pack('B', val)
        self.file.write(valBin)

    def writeString(self, val):
        self.file.write(val.name.encode('utf8'))

    def writeStringWithUInt8Len(self, val):
        self.writeUInt8(len(val.encode('utf8')))
        self.file.write(val.encode('utf8'))

    def writeStringWithUInt16Len(self, val):
        self.writeUInt16(len(val.encode('utf8')))
        self.file.write(val.encode('utf8'))

    def writeStringWithUInt32Len(self, val):
        self.writeUInt32(len(val.encode('utf8')))
        self.file.write(val.encode('utf8'))

    def setRoot(self, file):
        t = self.file.tell()
        self.file.seek(self.rootAddr)
        indexBin = struct.pack('I', file.addr)
        self.file.write(indexBin)
        self.file.seek(t)
        self.root = file

    def listDir(self, file):
        t = self.file.tell()

        files = []

        dt = self.getFilePtr(file)
        self.file.seek(dt + 4)
        count = self.readUInt32()
        self.file.seek(dt)
        for i in range(count):
            nextPtr = self.readUInt32()
            self.file.seek(nextPtr)
            files.append(VocabularyFile(self.readUInt32()))
            self.file.seek(nextPtr+8)

        self.file.seek(t)
        return files

    def getFileData(self, file):
        t = self.file.tell()

        self.file.seek(file.addr)
        fileType = self.readUInt8()
        filePtr = self.readUInt32()
        fileName = self.readUInt16String()

        self.file.seek(t)

        return fileType, filePtr, fileName

    def readFileData(self, file):
        t = self.file.tell()

        ptr = self.getFilePtr(file)
        self.file.seek(ptr)
        data = self.readBinaryWithUInt32Len()

        self.file.seek(t)
        return data

    def close(self):
        self.file.close()


voc = Vocabulary(open("ENG-RU.VOC", 'wb+'), 'ENG-RU')

def writeRecursive(dir, realPath):
    files = os.listdir(realPath)
    for e in files:
        p = realPath + '/' + e
        if os.path.isdir(p):
            d = voc.mkDir(dir, e)
            writeRecursive(d, p)
        else:
            f = voc.mkFile(dir, e)
            with open(p, 'rb') as fl:
                voc.fileWriteData(f, fl.read())

data = voc.mkDir(voc.root, "data")
writeRecursive(data, '../raw/ENG-RU')
# print(voc.listDir(data))

"""
testD = voc.mkDir(voc.root, 'testD')
test3 = voc.mkFile(testD, 'test3')
voc.fileWriteData(test3, b'hello, lava fs')
test1 = voc.mkFile(voc.root, 'test1')
print(voc.readFileData(test3))
voc.fileWriteData(test1, b'{"ping?": "pong!"}')
voc.mkFile(voc.root, 'test2')

print(voc.readFileData(test1))
print(list(map(voc.getFileData, voc.listDir(voc.root))))
"""

voc.close()
