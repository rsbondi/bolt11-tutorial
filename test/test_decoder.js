const decoder = require("../src/decoder")
const assert = require('assert')

describe('Test decoder', () => {
    it('decoder should decode a payment hash', () => {
        b32 = [0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,0,0,16,4,0,24,4,0,20,3,0,14,2,0,9,0,4,1,0]
        hex = "0001020304050607080900010203040506070809000102030405060708090102"

        const index = 1
        assert.strictEqual(decoder[index].label, "payment_hash")

        h = decoder[index].process(b32, 'hex')
        assert.strictEqual(h, hex)
    })

    it('decoder should decode a description', () => {
        // xysxxatsyp3k7enxv4js
        b32 = [ 6, 4, 16, 6, 6, 29, 11, 16, 4, 1, 17, 22, 30, 25, 19, 6, 12, 21, 18, 16 ] 
        desc = "1 cup coffee"

        const index = 13
        assert.strictEqual(decoder[index].label, "description")

        u = decoder[index].process(b32, 'utf8')
        assert.strictEqual(u, desc)
    })

    it('decoder should decode expiry', () => {
        // pu
        b32 = [ 1, 28 ] 
        exp = 60

        const index = 6
        assert.strictEqual(decoder[index].label, "expiry")

        e = decoder[index].process(b32, 'utf8')
        assert.strictEqual(exp, e)
    })
})
