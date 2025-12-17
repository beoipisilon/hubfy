import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

if (typeof global.Request === 'undefined') {
    try {
        const { Request, Headers, Response } = require('next/dist/compiled/undici')
        global.Request = Request
        global.Headers = Headers
        global.Response = Response
    } catch (e) {
        global.Request = class Request {
            constructor(input, init = {}) {
                this.url = typeof input === 'string' ? input : input?.url || ''
                this.method = init.method || 'GET'
                this.headers = new (global.Headers || Map)(init.headers)
                this.body = init.body
            }
        }
        
        if (typeof global.Headers === 'undefined') {
            global.Headers = class Headers {
                constructor(init = {}) {
                    this._headers = {}
                    if (init) {
                        Object.entries(init).forEach(([key, value]) => {
                            this._headers[key.toLowerCase()] = value
                        })
                    }
                }
                get(name) {
                    return this._headers[name.toLowerCase()] || null
                }
                set(name, value) {
                    this._headers[name.toLowerCase()] = value
                }
            }
        }
    }
}