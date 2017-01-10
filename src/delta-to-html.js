var DeltaConverter = require('./DeltaConverter')

var deltaToHtml = function(delta) {
    if (!delta.ops || !Array.isArray(delta.ops)) {
        throw new Error("bad delta")
    }

    var deltaConverter = new DeltaConverter(delta)
    return deltaConverter.toHtml()
}

module.exports = deltaToHtml
