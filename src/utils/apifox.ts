
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
