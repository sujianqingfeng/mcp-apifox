import { extractProjectIdAndApiIdFromText, fetchApiInfoApi } from "../apifox.js";
import { describe, it, expect } from 'vitest'



describe('fetchApiInfoApi', () => {
  it('should fetch api info', async () => {
    const result = await fetchApiInfoApi('5333436', '269566330','')
    expect(result).toMatchInlineSnapshot(`"{"success":false,"errorCode":"403012","errorMessage":"No project maintainer privilege"}"`)
  })


  it('should extract project id and api id from text', () => {
    const result = extractProjectIdAndApiIdFromText('https://app.apifox.com/link/project/5333436/apis/api-271295333')
    expect(result).toMatchInlineSnapshot(`
      {
        "apiId": "271295333",
        "projectId": "5333436",
      }
    `)
  })
})
