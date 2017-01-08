const deltaToHtml = require('../src/delta-to-html')

describe('delta-to-html', () => {
  describe('plain text', () => {
    it('#단순 텍스트', () => {
      expect(deltaToHtml({
        ops:[
          { insert:'hello,world' }
        ]
      })).toBe("<p>hello,world</p>")
    })

    it('#여러 줄의 텍스트', () => {
      expect(deltaToHtml({
        ops: [
          { insert:'hello\nworld\nhi\nworld' }
        ]
      })).toBe("<p>hello</p><p>world</p><p>hi</p><p>world</p>")
    })

    it('#bold', () => {
      expect(deltaToHtml({
        ops: [
          { insert: 'Hello' },
          { insert: 'World', attributes:{ bold:true} }
        ]
      })).toBe("<p>Hello<b>World</b></p>")
    })

    it('#link', () => {
      expect(deltaToHtml({
        ops: [
          { insert: "Go to " },
          { insert: "joostory", attributes: { link:"https://joostory.github.io" } }
        ]
      })).toBe("<p>Go to <a href='https://joostory.github.io'>joostory</a></p>")
    })
  })

  describe('block attributes', () => {
    it('#code-block', () => {
      expect(deltaToHtml({
        ops: [
          { insert: "Say 'hello, world!'\nconsole.log('hello, world!')" },
          { insert: '\n', attributes: {'code-block': true}}
        ]
      })).toBe("<p>Say 'hello, world!'</p><pre><code>console.log('hello, world!')</code></pre>")
    })
  })
})
