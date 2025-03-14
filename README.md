# Apifox MCP

一个用于将 Apifox API 文档与 AI 助手集成的 Model Context Protocol (MCP) 服务器。

## 概述

本项目为 Apifox（一个 API 开发和测试平台）和支持 Model Context Protocol 的 AI 助手之间提供了桥梁。它允许 AI 助手从 Apifox API 文档中提取信息，使开发过程中理解和使用 API 变得更加容易。

## 功能特点

- 从 Apifox URL 中提取项目 ID 和 API ID
- 使用提取的 ID 从 Apifox 获取详细的 API 信息
- 与支持 MCP 的 AI 助手无缝集成

## 前提条件

- 拥有访问令牌的 Apifox 账户
- 支持 Model Context Protocol 的 AI 助手

## 安装

```bash
# 全局安装
npm install -g mcp-apifox

# 或使用 pnpm
pnpm add -g mcp-apifox
```

## 配置

### 方法一

```json
{
  "mcpServers": {
    "apifox": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-apifox@latest"
      ],
      "env": {
        "APIFOX_ACCESS_TOKEN": ""
      }
    }
  }
}
```


### 方法二

```json
{
  "mcpServers": {
    "apifox": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-apifox@latest",
        "--token=xxxx"
      ]
    }
  }
}
```


## 使用

通过下面这种协作链接就可以获取接口信息，需要维护者权限

```
https://app.apifox.com/link/project/${projectId}/apis/api-${apiId}
```

### 可用工具

#### 1. get-apifox-project-id-and-api-id-from-url

从 Apifox URL 中提取项目 ID 和 API ID。

输入：
- `text`：包含 Apifox URL 或路径的字符串

输出：
- 包含 `projectId` 和 `apiId` 的 JSON 对象

#### 2. get-apifox-api-info

从 Apifox 获取详细的 API 信息。

输入：
- `projectId`：Apifox 项目 ID
- `apiId`：Apifox API ID

输出：
- 请求的 API 的 OpenAPI 规范
