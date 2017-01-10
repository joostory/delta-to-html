const deltaToHtml = require('../src/delta-to-html')

describe('delta-to-html', () => {
    describe('plain text', () => {
        it('#단순 텍스트', () => {
            expect(deltaToHtml({
                ops: [{
                    insert: 'hello,world'
                }]
            })).toBe("<p>hello,world</p>")
        })

        it('#여러 줄의 텍스트', () => {
            expect(deltaToHtml({
                ops: [{
                    insert: 'hello\nworld\nhi\nworld'
                }]
            })).toBe("<p>hello</p><p>world</p><p>hi</p><p>world</p>")
        })

        it('#bold', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: 'Hello'
                    },
                    {
                        insert: 'World',
                        attributes: {
                            bold: true
                        }
                    }
                ]
            })).toBe("<p>Hello<b>World</b></p>")
        })

        it('#link', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: "Go to "
                    },
                    {
                        insert: "joostory",
                        attributes: {
                            link: "https://joostory.github.io"
                        }
                    }
                ]
            })).toBe("<p>Go to <a href='https://joostory.github.io'>joostory</a></p>")
        })

        it('#code', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: 'Hello'
                    },
                    {
                        insert: 'World',
                        attributes: {
                            code: true
                        }
                    }
                ]
            })).toBe("<p>Hello<code>World</code></p>")
        })
    })

    describe('block attributes', () => {
        it('#code-block', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: "Say 'hello, world!'\nconsole.log('hello, world!')"
                    },
                    {
                        insert: '\n',
                        attributes: {
                            'code-block': true
                        }
                    }
                ]
            })).toBe("<p>Say 'hello, world!'</p><pre><code>console.log('hello, world!')</code></pre>")
        })

        it('#code-block multiline', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: "Say 'hello, world!'\nconsole.log('hello, world!')"
                    },
                    {
                        insert: '\n',
                        attributes: {
                            'code-block': true
                        }
                    },
                    {
                        insert: "console.log('hi, world!')"
                    },
                    {
                        insert: '\n',
                        attributes: {
                            'code-block': true
                        }
                    },
                    {
                        insert: "done\n"
                    }
                ]
            })).toBe("<p>Say 'hello, world!'</p><pre><code>console.log('hello, world!')\nconsole.log('hi, world!')</code></pre><p>done</p>")
        })

        it('#header1', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: "Say 'hello, world!'\nconsole.log('hello, world!')"
                    },
                    {
                        insert: '\n',
                        attributes: {
                            'header': 1
                        }
                    }
                ]
            })).toBe("<p>Say 'hello, world!'</p><h1>console.log('hello, world!')</h1>")
        })

        it('#blockquote', () => {
            expect(deltaToHtml({
                ops: [{
                        insert: "Say 'hello, world!'\nconsole.log('hello, world!')"
                    },
                    {
                        insert: '\n',
                        attributes: {
                            'blockquote': true
                        }
                    }
                ]
            })).toBe("<p>Say 'hello, world!'</p><blockquote>console.log('hello, world!')</blockquote>")
        })
    })

    describe('media', () => {
        it('#image', () => {
            expect(deltaToHtml({
                ops: [{
                    insert: {
                        image: "http://test.com/image.png"
                    }
                }]
            })).toBe("<p><img src='http://test.com/image.png'></p>")
        })
    })
})
