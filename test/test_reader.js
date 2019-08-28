const WordReader = require("../src/reader")
const assert = require('assert')

describe('Test reader', () => {
    it('reader should read int value', () => {
        fivebit = [1, 1, 2] // 000010000100010
        reader = new WordReader(fivebit)
        i = reader.readInt(15)
        assert.strictEqual(i, 1058)

        fivebit = [1] // 00001
        reader = new WordReader(fivebit)
        i = reader.readInt(5)
        assert.strictEqual(i, 1)

        fivebit = [1, 31] // 111111
        reader = new WordReader(fivebit)
        i = reader.readInt(10)
        assert.strictEqual(i, 63)
    })

    it('reader should read sequence int values', () => {
        fivebit = [1, 3, 2] // 000010001100010
        reader = new WordReader(fivebit)

        i = reader.readInt(5) // first five 00001
        assert.strictEqual(i, 1)

        i = reader.readInt(10) // next ten 0001100010  
        assert.strictEqual(i, 98)
   })

    it('reader should read bit values', () => {
        fivebit = [1, 1, 2, 1, 2] // 00001 00001 00010 00001 00010 -> 00001000 01000100 00010001 (0 dropped)
        reader = new WordReader(fivebit)
        b = reader.read(25, false)
        assert.deepEqual(b, [8, 68, 17])

        fivebit = [1, 1, 2, 1, 2] // 00001 00001 00010 00001 00010 -> 00001000 01000100 00010001 00000000 (padded)
        reader = new WordReader(fivebit)
        b = reader.read(25, true)
        assert.deepEqual(b, [8, 68, 17, 0])

        fivebit = [1, 1, 2, 1, 3] // 00001 00001 00010 00001 00010 -> 00001000 01000100 00010001 10000000 (padded)
        reader = new WordReader(fivebit)
        b = reader.read(25, true)
        assert.deepEqual(b, [8, 68, 17, 128])
    })

    it('reader should read sequence word values', () => {
        fivebit = [1, 2, 3, 4, 5, 6] 
        reader = new WordReader(fivebit)

        w = reader.readWords(2)
        assert.deepEqual(w, [1,2])

        w = reader.readWords(4)
        assert.deepEqual(w, [3, 4, 5, 6])
   })

   it('reader should read hash value', () => {
        /*
                0    1    2    3    4    5    6    7
        +0      q    p    z    r    y    9    x    8
        +8      g    f    2    t    v    d    w    0
        +16     s    3    j    n    5    4    k    h
        +24     c    e    6    m    u    a    7    l
        */
    
        // qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypq
        b32 = [0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,4,1,0]
        b256 = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,1,2]
        // 0001020304050607080900010203040506070809000102030405060708090102

        reader = new WordReader(b32)

        w = reader.read(256)

        assert.deepEqual(w, b256)
    })
})