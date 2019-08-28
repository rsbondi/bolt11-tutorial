const WordReader = require('./reader')

function processHex(data, enc) {
    const reader = new WordReader(data) 
    const bytes = reader.read(reader.remaining())
    const buf = Buffer.from(bytes)
    return enc ? buf.toString(enc) : buf
}

function processInt(data) {
  let val = 0
  for (let i = 0; i < data.length; i++) {
    let word = data[i]
    val += word * Math.pow(32, data.length - i - 1)
  }
  return val
}

const decodeTagged = {
    1: {label: 'payment_hash',          process(data) { return processHex(data, 'hex') } },
   13: {label: 'description',           process(data) { return processHex(data, 'utf8') } },
   19: {label: 'payee_pubkey',          process(data) { return processHex(data, 'hex') }},
   23: {label: 'purpose_hash',          process(data) { return processHex(data, 'hex') }},
    6: {label: 'expiry',                process(data) { return processInt(data) }},
   24: {label: 'min_final_cltv_expiry', process(data) { return processInt(data) }},
    9: {label: 'fallback_address',      process(data) { 
      let version = ''+processInt(data.slice(0,1))
      if(version.length%2) version = '0' + version
      return version+processHex(data.slice(1), 'hex') 
    } }, 
    3: {
        label: 'routing',
        process(data) { 
            const reader = new WordReader(data)
            let routing = []
            while(reader.remaining() >= 404) 
            routing.push({
                     pubkey                     : Buffer.from(reader.read(264)).toString('hex'),
                     short_channel_id           : Buffer.from(reader.read(64)).toString('hex'),
                     fee_base_msat              : reader.readInt(32),
                     fee_proportional_millionths: reader.readInt(32),
                     cltv_expiry_delta          : reader.readInt(16)
            })
            return routing
        }
    },
}

module.exports = decodeTagged