const bech32 = require('bech32')
const big = require('bignumber.js')
const WordReader = require('./reader')

class PaymentRequest {
    /**
     * create instance and parse if request provided
     * @param {string} [req] bech32 encoded payment request
     */
    constructor(req) {
        if (req) {
            this.payment_request = req
            this.bech32 = bech32.decode(req, 9999)
            this.reader = new WordReader(this.bech32.words)
            this.prefix = prefixes.reduce((o, c, i) => {
                if (!o && this.bech32.prefix.match(c)) o = c
                return o
            }, '')

            const amt = this.bech32.prefix.slice(this.prefix.length)
            if (amt) {
                const unit = amt.slice(-1)
                if (~Object.keys(amounts).indexOf(unit)) {
                    const val = new big(amt.slice(0, -1))
                    this.amount = val.times(amounts[unit])
                } else this.amount = new big(amt) // no units
            } else this.amount = new big(0)

            this._readBits = 0

            this.timestamp = this.reader.readInt(35)

            this.tagged = []
            while (this.reader.remaining() > 520) { // have data
                const type = this.reader.readInt(5)
                const len = this.reader.readInt(10)
                const data = this.reader.readWords(len)
                this.tagged.push({ type: decodeTagged[type].label, data: decodeTagged[type] && decodeTagged[type].process(data) || data })

            }

            const signature = this.reader.read(104 * 5)
            this.signature = Buffer.from(signature)
        }
    }


}

const prefixes = [
    "lnbcrt",
    "lnbc",
    "lntb",
    "lnsb"
]

const amounts = {
    '': new big(1),
    'm': new big(0.001),
    'u': new big(0.000001),
    'n': new big(0.000000001),
    'p': new big(0.000000000001)
}

module.exports = PaymentRequest