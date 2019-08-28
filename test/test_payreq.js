const PaymentRequest = require('../src/payrequest')
const testdata = require('./data/testdata')
const assert = require('assert')

describe('Test payment lib decoding', () => {
    it('should initialize with proper bech32 prefix', () => {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            assert.strictEqual(pay.prefix, data.prefix)
        })
    })
    it('should initialize with proper payment amount', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            assert.strictEqual(pay.amount.toNumber(), data.amount)

        })
    })
    
    it('should initialize with proper timestamp', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            assert.strictEqual(pay.timestamp, data.timestamp)

        })
    })
    
    it('should initialize to proper tagged data count', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            assert.strictEqual(pay.tagged.length, data.tagged.length)

        })
    })

    it('should initialize with proper signature', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            assert.strictEqual(pay.signature.toString('hex'), data.signature)

        })
    })

    it('should get payment hash from tagged field', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testhash = data.tagged.filter(t => t.type == 'payment_hash')[0]
            let payhash = pay.tagged.filter(t => t.type == 'payment_hash')[0]
            assert.strictEqual(payhash.data.toString('hex'), testhash.data)

        })
    })

    it('should get description from tagged field', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testdesc = data.tagged.filter(t => t.type == 'description')
            if(testdesc.length && testdesc[0].data) {  // am I handling empty ok here?
                let paydesc = pay.tagged.filter(t => t.type == 'description')
                assert.strictEqual(paydesc[0].data, testdesc[0].data)
            }

        })
    })

    it('properly calculates expiry', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testexpiry = data.tagged.filter(t => t.type == 'expiry')
            if(testexpiry.length) {
                let payexpiry = pay.tagged.filter(t => t.type == 'expiry')
                assert.strictEqual(payexpiry[0].data, testexpiry[0].data)
            }

        })
    })

    it('properly calculates payee_pubkey', function () { // TODO: no test data
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testpub= data.tagged.filter(t => t.type == 'payee_pubkey')
            if(testpub.length) {
                let paypub = pay.tagged.filter(t => t.type == 'payee_pubkey')
                assert.strictEqual(paypub[0].data.toString('hex'), testpub[0].data)
            }

        })
    })

    it('properly calculates purpose_hash', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testpurp = data.tagged.filter(t => t.type == 'purpose_hash')
            if(testpurp.length) {
                let paypurp = pay.tagged.filter(t => t.type == 'purpose_hash')
                assert.strictEqual(paypurp[0].data.toString('hex'), testpurp[0].data)
            }

        })
    })

    it('properly calculates min_final_cltv_expiry', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testmin = data.tagged.filter(t => t.type == 'min_final_cltv_expiry')
            if(testmin.length) {
                let paymin = pay.tagged.filter(t => t.type == 'min_final_cltv_expiry')
                assert.strictEqual(paymin[0].data, testmin[0].data)
            }

        })
    })

    it('properly processes fallback_address', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testwit = data.tagged.filter(t => t.type == 'fallback_address')
            if(testwit.length) {
                let paywit = pay.tagged.filter(t => t.type == 'fallback_address')
                assert.strictEqual(paywit[0].data, testwit[0].data)
            }

        })
    })

    it('properly processes routing info', function () {
        testdata.requests.forEach(data => {
            let pay = new PaymentRequest(data.request)
            let testroute = data.tagged.filter(t => t.type == 'routing')
            if(testroute.length) {
                let payroute = pay.tagged.filter(t => t.type == 'routing')
                payroute[0].data.forEach((r, i) => {
                    Object.keys(r).forEach(k => {
                        assert.strictEqual(r[k], testroute[0].data[i][k])
                    })
                })
            }

        })
    })
})
