
import { request } from 'undici';

export async function fetchApiInfoApi(projectId: string, apiId: string, accessToken: string) {

  const response = await request(`https://api.apifox.com/v1/projects/${projectId}/export-openapi`, {
    method: 'POST',
    headers: {
      'X-Apifox-Api-Version': '2024-03-28',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      scope: {
        type: 'SELECTED_ENDPOINTS',
        selectedEndpointIds: [apiId]
      },
      options: {
        includeApifoxExtensionProperties: false,
        addFoldersToTags: false
      },
      oasVersion: '3.1',
      exportFormat: 'JSON'
    })
  });

  const result = await response.body.text();
  return result
}


export function extractProjectIdAndApiIdFromText(text: string) {
	const urlPattern = /apifox\.com\/link\/project\/(\d+)\/apis\/api-(\d+)/
	const contentPattern = /project\/(\d+).*api-(\d+)/

		let projectId = ""
		let apiId = ""

		// 寻找输入中的 URL 或相关内容
		const lines = text.split("\n")
		for (const line of lines) {
			const trimmedLine = line.trim()

			// 尝试匹配完整 URL
			const urlMatch = trimmedLine.match(urlPattern)
			if (urlMatch) {
				projectId = urlMatch[1]
				apiId = urlMatch[2]
				break
			}

			// 尝试匹配部分路径
			const contentMatch = trimmedLine.match(contentPattern)
			if (contentMatch) {
				projectId = contentMatch[1]
				apiId = contentMatch[2]
				break
			}
		}


  return {
    projectId,
    apiId
  }
}
