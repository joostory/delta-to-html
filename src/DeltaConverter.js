var equal = require('deep-equal')

var wrapTag = function(tag, value, attrs) {
  var attr_string = ""
  if (attrs) {
    for (var item in attrs) {
      attr_string += " " + item + "='" + attrs[item] + "'"
    }
  }

  return "<" + tag + attr_string +">" + value + "</" + tag + ">"
}
var convert = function(value, attributes) {
  if (attributes) {
    if (attributes['code-block']) {
      return wrapTag("pre", wrapTag("code", value))
    }
  } else {
    return wrapTag("p", value)
  }
}

var DeltaConverter = function(delta) {
  this.results = ""
  this.current = {
    value:"",
    attributes: null
  }
  this.delta = delta
}

DeltaConverter.prototype.addItem = function(insert, attributes) {
  if (typeof insert === 'string' || insert instanceof String) {
    if (!equal(this.current.attributes, attributes)) {
      this.convertPrevious()
    }

    if (attributes) {
      if (attributes.bold) {
        this.current.value += wrapTag("b", insert)
      } else if (attributes.link) {
        this.current.value += wrapTag("a", insert, {
          "href": attributes.link
        })
      } else {
        this.current.value += insert
        this.current.attributes = attributes
      }
    } else {
      this.current.value += insert
      this.current.attributes = attributes
    }
  }
}

DeltaConverter.prototype.convertPrevious = function() {
  if (this.current.value.indexOf('\n') >= 0) {
    var values = this.current.value.split('\n'),
      length = values.length
    for (var i = 0 ; i < length - 1 ; i++) {
      this.results += convert(values[i], this.current.attributes)
    }
    this.current.value = values[length - 1]
  }
}

DeltaConverter.prototype.convertRemain = function() {
  if (this.current.value.indexOf('\n') >= 0) {
    var values = this.current.value.split('\n'),
      length = values.length,
      results = ""
    for (var i = 0 ; i < length ; i++) {
      if (i == length - 1 && !values[i]) {
        break
      }
      results += convert(values[i], this.current.attributes)
    }
    return results
  } else {
    return convert(this.current.value, this.current.attributes)
  }
}

DeltaConverter.prototype.toHtml = function() {
  var ops = this.delta.ops,
    length = ops.length

  for (var i = 0 ; i < length ; i++) {
    var insert = ops[i].insert,
      attributes = ops[i].attributes

    this.addItem(insert, attributes)
  }

  this.results += this.convertRemain()
  return this.results
}

module.exports = DeltaConverter
