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

        it('#italic', () => {
            expect(deltaToHtml({
                ops: [
                    { insert: 'Hello,' },
                    { insert: 'world!', attributes: { italic:true }}
                ]
            })).toBe('<p>Hello,<i>world!</i></p>')
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

        it('#video', () => {
            expect(deltaToHtml({
                ops: [{
                    attributes: {
                        width: '560',
                        height: '315'
                    },
                    insert: {
                        video: 'https://www.youtube.com/embed/2YJppF-WsIA'
                    }
                }]
            })).toBe("<p><iframe src='https://www.youtube.com/embed/2YJppF-WsIA' width='560' height='315'></iframe></p>")
        })
    })

    describe('mixed', () => {
        it('#sample', () => {
            expect(deltaToHtml({
                "ops":[
                    {"insert":"안녕하세요? "},
                    {"attributes":{"bold":true},"insert":"반"},
                    {"insert":"갑"},
                    {"attributes":{"italic":true},"insert":"습"},
                    {"insert":"니"},
                    {"attributes":{"code":true},"insert":"다"},
                    {"insert":".\nconsole.log('hello, world!')\n반갑습니다."},
                    {"attributes":{"list":"ordered"},"insert":"\n"},
                    {"insert":"반가워요"},
                    {"attributes":{"list":"ordered"},"insert":"\n"},
                    {"insert":"\n오늘은 여기까지."},
                    {"attributes":{"list":"bullet"},"insert":"\n"},
                    {"insert":"한번만 더"},
                    {"attributes":{"list":"bullet"},"insert":"\n"},
                    {"insert":"\n정말 여기까지\n"}
                ]
            })).toBe('<p>안녕하세요? <b>반</b>갑<i>습</i>니<code>다</code>.</p><p>console.log(\'hello, world!\')</p><ol><li>반갑습니다.</li><li>반가워요</li></ol><p></p><ul><li>오늘은 여기까지.</li><li>한번만 더</li></ul><p></p><p>정말 여기까지</p>')
        })
    })

	describe('escape', () => {
		it('#tag', () => {
			expect(deltaToHtml({
				ops: [
					{insert:'<pre>',attributes:{code:true}}
				]
			})).toBe("<p><code>&lt;pre&gt;</code></p>")
		})
	})
})
