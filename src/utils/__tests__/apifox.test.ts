import { fetchApiInfoApi } from "../apifox.js";
import { describe, it, expect } from 'vitest'



describe('fetchApiInfoApi', () => {
  it('should fetch api info', async () => {
    const result = await fetchApiInfoApi('5766896', '255257469','')
    expect(result).toMatchInlineSnapshot(`"{"success":false,"errorCode":"403012","errorMessage":"No project maintainer privilege"}"`)
  })
})
