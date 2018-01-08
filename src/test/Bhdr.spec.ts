import { Bhdr } from '../main/Bhdr'
import { expect } from 'chai'
import 'mocha'

describe('Create Bhdr and get exports', () => {
  it('should return an json object as string', () => {
    const result = new Bhdr({}).export('json')
    expect(result).to.equal('{}')
  })
})

describe('Insert into Bhdr and get exports', () => {
  it('should return an json object as string', () => {
    const bhdr = new Bhdr({})

    bhdr.insert(Object, new Object({
      name: 'test'
    }))

    const result = bhdr.export('json')
    expect(result).to.equal('{"Object":{"1":{"name":"test"},"id":1}}')
  })
})