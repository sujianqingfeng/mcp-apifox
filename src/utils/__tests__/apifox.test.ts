import { fetchApiInfoApi } from "../apifox.js";
import { describe, it, expect } from 'vitest'



describe('fetchApiInfoApi', () => {
  it('should fetch api info', async () => {
    const result = await fetchApiInfoApi('5333436', '269566330','')
    expect(result).toMatchInlineSnapshot()
  })
})
