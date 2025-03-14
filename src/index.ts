#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { extractProjectIdAndApiIdFromText, fetchApiInfoApi } from "./utils/apifox.js"

const server = new McpServer({
	name: "apifox",
	version: "0.0.1",
})

server.tool(
	"get_apifox_project_id_and_api_id_from_url",
	"Get the project ID and API ID of Apifox from the URL.",
	{
		text: z
			.string()
			.describe("The text to extract the project id and api id from"),
	},
	({ text }) => {
    const { projectId, apiId } = extractProjectIdAndApiIdFromText(text)

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
	"get_apifox_api_info",
	"Get the info of Apifox API.",
	{
		projectId: z.string().describe("The project ID of Apifox"),
		apiId: z.string().describe("The API ID of Apifox"),
	},
	async ({ projectId, apiId }) => {
		try {
      // Get token from command line arguments or environment variable
      let token = process.env.APIFOX_ACCESS_TOKEN
      
      // Check if token is provided in command line arguments
      // Format: --token=your_token or --apifox-token=your_token
      const args = process.argv.slice(2)
      for (const arg of args) {
        const tokenArg = arg.match(/^--(?:apifox-)?token=(.+)$/)
        if (tokenArg) {
          token = tokenArg[1]
          break
        }
      }
      if (!token) {
        throw new Error("No token provided")
      }
      
			const result = await fetchApiInfoApi(projectId, apiId, token)

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
