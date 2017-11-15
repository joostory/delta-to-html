var equal = require('deep-equal')

var escapeHtml = function(unsafe) {
    if (unsafe) {

    }
    return unsafe
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

var wrapTag = function(tag, value, attrs) {
    return "<" + tag + attrsToString(attrs) + ">" + value + "</" + tag + ">"
}

var singleTag = function(tag, attrs) {
    return "<" + tag + attrsToString(attrs) + ">"
}

var attrsToString = function(attrs) {
    var attr_string = ""
    if (attrs) {
        for (var item in attrs) {
            attr_string += " " + item + "='" + attrs[item] + "'"
        }
    }
    return attr_string
}

var convert = function(value, attributes) {
    if (attributes) {
        if (attributes['code-block']) {
            return wrapTag("pre", wrapTag("code", value.join("\n").trim()))
        } else if (attributes['header']) {
            return wrapTag("h" + attributes['header'], value)
        } else if (attributes['blockquote']) {
            return wrapTag("blockquote", value)
        } else if (attributes['list']) {
            return wrapTag(attributes['list'] == 'ordered'? 'ol':'ul', value.map(function(item) { return wrapTag('li', item )}).join(""))
        }
    }

    return wrapTag("p", value)
}

var convertInline = function(insert, attributes) {
    if (attributes) {
        if (attributes['bold']) {
            return wrapTag("b", insert)
        } else if (attributes['link']) {
            return wrapTag("a", insert, {
                "href": attributes.link
            })
        } else if (attributes['code']) {
            return wrapTag("code", insert)
        } else if (attributes['italic']) {
            return wrapTag('i', insert)
        }
    }

    return insert
}

var DeltaConverter = function(delta) {
    this.results = ""
    this.current = {
        value: "",
        attributes: null
    }
    this.delta = delta
}

DeltaConverter.prototype.addItem = function(insert, attributes) {
    if (typeof insert === 'string' || insert instanceof String) {
        if (insert.indexOf('\n') >= 0) {
            if (equal(this.current.attributes, attributes) && attributes && (attributes['code-block'] || attributes['list']) && insert == "\n") {

            } else {
                this.convertPrevious()
                this.current.attributes = attributes
            }
        }

        this.current.value += convertInline(escapeHtml(insert), attributes)

    } else if (insert.image) {
        this.current.value += singleTag("img", {
            "src": insert.image
        })
    } else if (insert.video) {
        this.current.value += wrapTag("iframe", '', {
            "src": insert.video,
            "width": attributes.width,
            "height": attributes.height
        })
    }
}

DeltaConverter.prototype.convertPrevious = function() {
    if (this.current.value.indexOf('\n') >= 0) {
        var values = this.current.value.split('\n'),
            length = values.length;

        if (this.current.attributes && (this.current.attributes['code-block'] || this.current.attributes['list'])) {
            var blockValues = []
            for (var i = 0; i < length - 1; i++) {
                blockValues.push(values[i])
            }
            this.results += convert(blockValues, this.current.attributes)
        } else {
            for (var i = 0; i < length - 1; i++) {
                this.results += convert(values[i], this.current.attributes)
            }
        }
        this.current.value = values[length - 1]
    }
}

DeltaConverter.prototype.convertRemain = function() {
    if (this.current.value.indexOf('\n') >= 0) {
        var values = this.current.value.split('\n'),
            length = values.length,
            results = ""
        if (this.current.attributes && (this.current.attributes['code-block'] || this.current.attributes['list'])) {
            var blockValues = []
            for (var i = 0; i < length; i++) {
                blockValues.push(values[i])
            }
            results += convert(blockValues, this.current.attributes)
        } else {
            for (var i = 0; i < length; i++) {
                if (i == length - 1 && !values[i]) {
                    break
                }
                results += convert(values[i], this.current.attributes)
            }
        }
        return results
    } else {
        return convert(this.current.value, this.current.attributes)
    }
}

DeltaConverter.prototype.toHtml = function() {
    var ops = this.delta.ops,
        length = ops.length

    for (var i = 0; i < length; i++) {
        var insert = ops[i].insert,
            attributes = ops[i].attributes

        this.addItem(insert, attributes)
    }

    this.results += this.convertRemain()
    return this.results
}

module.exports = DeltaConverter
