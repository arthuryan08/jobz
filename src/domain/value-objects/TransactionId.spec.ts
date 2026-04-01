import { describe, it, expect } from 'vitest'
import { TransactionId } from './TransactionId'

describe('TransactionId', () => {
  it('should create from a given value', () => {
    const id = TransactionId.create('abc-123')
    expect(id.value).toBe('abc-123')
  })

  it('should generate a unique id', () => {
    const id1 = TransactionId.generate()
    const id2 = TransactionId.generate()
    expect(id1.value).toBeTruthy()
    expect(id1.value).not.toBe(id2.value)
  })

  it('should compare equality', () => {
    const a = TransactionId.create('same')
    const b = TransactionId.create('same')
    expect(a.equals(b)).toBe(true)
  })
})
