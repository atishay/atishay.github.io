---
date: "2025-05-05T19:32:10-07:00"
type: post
title: "MCP - Will they be the new XML?"
description: "Exploring whether Model Context Protocol will follow the path of XML - promising simplicity but ending up as complex infrastructure"
tags:
- ai
- mcp
- protocols
- infrastructure
sidebar:
- title: attribution
  content: Image from [sustainability-directory.com](https://sustainability-directory.com/)
categories:
- ai
---

Technology standards follow predictable patterns, but not the ones we expect. We don't start simple and add complexity. We start overengineered because we don't know what will change, then simplify once we understand the constants. XML began as a universal solution for every data problem. JSON emerged when we realized most cases just needed key-value pairs. The magic disappeared and it became boring tech. Now MCP (Model Context Protocol) is positioning itself as the standard for AI tool communication. But the requirements are unclear, and the landscape is shifting. Will MCP follow XML's path?

# The XML Wars

XML was the universal data format. Rich structure, formal validation, enterprise-grade tooling. Companies invested heavily in XML parsers, schema definitions, and SOAP web services (later the "Simple" in "Simple Object Access Protocol" became the joke). It promised interoperability through formal specifications.

Then JSON showed up. Simpler syntax, smaller payloads, native JavaScript support. REST APIs using JSON were faster to build and easier to debug. Developers voted with their keyboards.

```xml
<!-- XML: Verbose but structured -->
<user>
  <id>123</id>
  <name>John Doe</name>
  <email>john@example.com</email>
</user>
```

```json
// JSON: Simple and direct
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

JSON won because it removed friction. Less ceremony, fewer concepts, immediate productivity. The network effect kicked in as more developers chose the simpler option. XML survived in enterprises but lost the broader war.

Inertia kept HTML alive which was built on XML principles. Even HTML evolved to embrace simplicity (for consumers, making parsers harder) with HTML5.

# Enter MCP

Model Context Protocol aims to standardize how LLMs interact with external systems. Instead of every AI provider building custom integrations, MCP provides a unified interface. Tools expose capabilities through MCP servers. LLMs connect through MCP clients. One protocol, universal compatibility.

```json
// MCP tool definition
{
  "name": "database_query",
  "description": "Execute SQL queries",
  "inputSchema": {
    "type": "object",
    "properties": {
      "sql": {"type": "string"}
    }
  }
}
```

MCP isn't overly formal like XML was. It's fairly lightweight - JSON-RPC with some conventions. It has backing from major players (Anthropic is pushing it hard). The pitch is compelling: build tools once, use everywhere. No more custom integrations for each AI provider.

USB-C for AI tools. But not all USB-C implementations are equal. Will we have a similar fate?

# The bigger problems

External tools will always be needed. Not all details are public, and not likely to be accurately compressed into the internal knowledge of the LLM. But MCP's approach feels like a bit too early to be a long term standard. The use cases are not clear yet. The UI/UX patterns for tool use are still evolving. MCP feels like a band-aid on top of existing paradigms rather than a new way of thinking.

MCP can book a flight, it needs a lot of details. Is asking in the chat the right/only way. Are forms with validation a bad paradigm? Can the model connect to the password store? Should the model be able to query for missing information? Should the user be asked to verify once. These higher level UX questions are not answered yet and therefore we are not ready for the agentic world.

Lets talk about internals of using JSON-RPC. Why not GraphQL? It has an awesome meta-language where the model could query the schema on demand. What about swagger/openAPI? Why not use that? MCP does seem to solving problems but we haven't seen a critique of other approaches.

```js
// MCP: Multiple round trips for chaining
const users = await mcp.call("database_query", {sql: "SELECT * FROM users"});
const activeUsers = [];
for (const user of users) {
  const status = await mcp.call("check_status", {userId: user.id});
  if (status.active) activeUsers.push(user);
}
```

Compare this to GraphQL, which tackled a similar problem for APIs. Instead of multiple REST calls, GraphQL lets you specify exactly what you want in one request. You get relational data, nested queries, and conditional fields without round trips.

```graphql
# GraphQL: Specify relationships declaratively
{
  users {
    id
    name
    status {
      active
    }
  }
}
```

# Inertia Works

But standards have inertia. HTML is a perfect example. Technically inferior to many alternatives, but too embedded to replace. Even lightweight standards can become entrenched once adoption starts.

MCP has advantages beyond technical merit. Anthropic is promoting it aggressively. Claude Desktop already supports it. The tooling ecosystem is building around it. Once developers invest in MCP integrations, switching costs create momentum.

Companies that build MCP integrations today create switching costs. Even if better approaches emerge, existing MCP investments become reasons to stick with MCP. The protocol could survive on momentum alone.

# The Prediction

MCP will continue to gain adoption because Anthropic is pushing it and the tooling is there. Companies will build integrations, create internal standards around it, and invest in MCP-based architectures. It's not the wrong approach, just not the final one.

The future needs something more practical at a lower level. Not discovery protocols or schema definitions, but better primitives for capability exposure. Something that makes building tools trivial instead of requiring server implementations and transport concerns.

MCP will survive on inertia while better approaches emerge. Eventually something will emerge that works at the operating system or runtime level - making external capabilities as easy to expose as internal functions. The winning approach will be invisible infrastructure, not visible protocols. MCP is visible. The next thing won't be. Lets continue using MCP for what they are worth but don't stop exploring. The AI field is quite open, still.
