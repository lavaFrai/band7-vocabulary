export class FSFile {

    static seek(file, addr) {
        hmFS.seek(file, addr, hmFS.SEEK_SET)
    }

    static read(file, size) {
        const data = new ArrayBuffer(size);
        hmFS.read(file, data, 0, size);
        return data;
    }

    static readU32(file) {
        const data = new Uint8Array(FSFile.read(file, 4))
        return data[0] | data[1] << 8 | data[2] << 16 | data[3] << 24
    }

    static readU16(file) {
        const data = new Uint8Array(FSFile.read(file, 2))
        return data[0] | data[1] << 8
    }

    static readU8(file) {
        const data = new Uint8Array(FSFile.read(file, 1))
        return data[0]
    }

    static readS(file, size) {
        const data = new Uint8Array(FSFile.read(file, size))
        const text = FSFile.decodeUtf8(data)[0];
        return text
    }

    static readS8(file) {
        const size = FSFile.readU8(file)
        let data = FSFile.readS(file, size)
        return data
    }

    static readS16(file) {
        const size = FSFile.readU16(file)
        let data = FSFile.readS(file, size)
        return data
    }

    static readS32(file) {
        let size = FSFile.readU32(file)
        let data = FSFile.readS(file, size)
        return data
    }




    static decodeUtf8(array, outLimit=Infinity, startPosition=0) {
		let out = "";
		let length = array.length;

		let i = startPosition, c, char2, char3;
		while (i < length && out.length < outLimit) {
			c = array[i++];
			switch (c >> 4) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
					// 0xxxxxxx
					out += String.fromCharCode(c);
					break;
				case 12:
				case 13:
					// 110x xxxx   10xx xxxx
					char2 = array[i++];
					out += String.fromCharCode(
						((c & 0x1f) << 6) | (char2 & 0x3f)
					);
					break;
				case 14:
					// 1110 xxxx  10xx xxxx  10xx xxxx
					char2 = array[i++];
					char3 = array[i++];
					out += String.fromCharCode(
						((c & 0x0f) << 12) |
							((char2 & 0x3f) << 6) |
							((char3 & 0x3f) << 0)
					);
					break;
			}
		}

		return [out, i - startPosition];
	}
}
