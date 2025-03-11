#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { request } from "undici"
import { z } from "zod"

const server = new McpServer({
	name: "apifox",
	version: "0.0.1",
})

server.tool(
	"get-apifox-project-id-and-api-id-from-url",
	"Get the project ID and API ID of Apifox from the URL.",
	{
		text: z
			.string()
			.describe("The text to extract the project id and api id from"),
	},
	({ text }) => {
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
			content: [
				{
					type: "text",
					text: JSON.stringify({ projectId, apiId }),
				},
			],
		}
	},
)

server.tool(
	"get-apifox-api-info",
	"Get the info of Apifox API.",
	{
		projectId: z.string().describe("The project ID of Apifox"),
		apiId: z.string().describe("The API ID of Apifox"),
	},
	async ({ projectId, apiId }) => {
		try {
			const response = await request(
				`https://api.apifox.com/v1/projects/${projectId}/export-openapi`,
				{
					method: "POST",
					headers: {
						"X-Apifox-Api-Version": "2024-03-28",
						Authorization: `Bearer ${process.env.APIFOX_ACCESS_TOKEN}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						scope: {
							type: "SELECTED_ENDPOINTS",
							selectedEndpointIds: [apiId],
						},
						options: {
							includeApifoxExtensionProperties: false,
							addFoldersToTags: false,
						},
						oasVersion: "3.1",
						exportFormat: "JSON",
					}),
				},
			)

			const result = await response.body.text()

			return {
				content: [
					{
						type: "text",
						text: result,
					},
				],
			}
		} catch (error: any) {
			return {
				content: [
					{
						type: "text",
						text: `Error fetching API info: ${error.message}`,
					},
				],
				isError: true,
			}
		}
	},
)

async function main() {
	const transport = new StdioServerTransport()
	await server.connect(transport)
	console.error("Apifox MCP Server running on stdio")
}

main().catch((error) => {
	console.error("Fatal error in main():", error)
	process.exit(1)
})
