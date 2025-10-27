---
date: "2025-10-27T00:00:00Z"
type: post
title: "RAGs, MCPs and Scripts. AI moves fast"
description: "How traditional RAG is being rapidly replaced by agent-based querying and lazy-loading systems like Claude Skills, and why scripting provides superior context window management"
tags:
- ai
- genai
- agents
sidebar:
- title: attribution
  content: Cover image from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:An_airgapped_offline_ClueBot_6.0_proving_%22stupid%22_Einstein_wrong,_writing_down_theory_of_everything_and_a_letter_to_three_developers.jpg)
categories:
- ai
---

Like JavaScript framework churn, agentic methodology churn is fully underway. RAG (Retrieval-Augmented Generation) was the breakthrough that let LLMs work with external data. Retrieve documents, embed them in context, generate responses. It felt elegant. Six months ago, it was cutting-edge.

Now? We're discovering that preloading everything into context is the wrong pattern. Agent based architectures with MCP let LLMs call tools on demand. And scripting is already here. The LLM writes code (JavaScript, Python, etc.) that calls multiple SQL queries, filters data, and returns just the answer. Each evolution reduces what hits the LLM's context.

# RAGs

Traditional RAG maintains a vector database of pre-processed documents. Query comes in, retrieve similar documents, dump them in context, generate response. Simple pipeline.

```js
// Traditional RAG: Pre-load everything into context
const docs = loadAllDocuments();
const relevant = findSimilar(userQuery, docs);
const prompt = `${userQuery}\n\nContext:\n${relevant.join('\n')}`;
await llm.generate(prompt);
```

The problem? It treats context like a dumping ground. Every potentially relevant document gets loaded whether you need it or not. Context isn't free. It costs money (tokens aren't cheap), adds latency, and degrades performance when filled with noise. Plus, context windows are limited. Even with millions of tokens available, you pay for every token, and models perform worse with irrelevant data. Worse, centralizing data into vector databases bypasses original access controls. Data gets pooled together, and you're always working with slightly stale data.

# MCPs

Agent based architectures query data sources dynamically at runtime. Instead of preloading everything, fetch what you need when you need it. Tools like MCP (Model Context Protocol) let LLMs call predefined tools. They can execute a SQL query, call an API, or fetch a file. The LLM decides which tool to use, calls it with parameters, and gets the results.

```js
// LLM has access to MCP tools.
const tools = {
  queryDatabase(sql) { return db.query(sql); },
  readFile(path) { return fs.readFile(path); }
};

// User asks "Show me active users from California".
// LLM calls queryDatabase("SELECT * FROM users WHERE active=1 AND state='CA'").
// Results come back into context.
```

Better than RAG, but limited to predefined tools. Each tool call returns data to context.

# Scripting

The big shift is that the LLM writes code that executes in a sandbox. Unlike MCP where you call one tool and get data back into context, with scripting the LLM can write code (JavaScript, Python, etc.) that calls multiple SQL queries, filters the results, and aggregates data. It all runs in one script. Only the final answer comes back to context.

Here is how it works. The LLM generates a function that runs in a sandbox. The script has access to SQL and file APIs, and it does the procedural work. Instead of "call SQL, get 1000 rows back into context, call SQL again, get more data," the script calls SQL multiple times, filters and processes everything, and returns only what you need. Model code execution keeps improving fast, so this approach is accelerating.

```js
// These examples use JavaScript, but the LLM can write any language.
// User asks "Find error logs mentioning payment".
// LLM generates this function, which runs in a sandbox.
async function filterLogs({ searchTerm, status, logFiles }) {
  const results = [];
  for (const file of logFiles) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    for (const line of lines) {
      if (line.includes(searchTerm)) {
        const entry = JSON.parse(line);
        if (entry.level === status) results.push(entry);
      }
    }
  }
  return results.slice(0, 50);
}

// Function executes in a sandbox → 100MB of logs → returns 5 entries to the LLM.
```

The key difference is that the script can call SQL multiple times, filter results, and aggregate data. All before returning to the LLM. With MCP, each tool call returns data to context. With scripting, you call multiple tools within the script and only return the filtered answer.

```js
// User asks "Show me purchase trends for active admin users".
// LLM generates a script that calls multiple SQL queries and filters.
async function analyzePurchases({ db }) {
  // Call SQL multiple times, filter in script
  const users = await db.query("SELECT * FROM users WHERE role='admin' AND active=1");
  const purchases = await db.query("SELECT * FROM purchases WHERE user_id IN (?)",
    users.map(u => u.id));

  // Filter and aggregate in the script
  const userStats = users.map(u => ({
    name: u.name,
    purchases: purchases.filter(p => p.user_id === u.id).length
  })).filter(u => u.purchases > 0);

  return {
    total: userStats.length,
    avgPurchases: userStats.reduce((sum, u) => sum + u.purchases, 0) / userStats.length,
    topUsers: userStats.slice(0, 10)
  };
}

// Multiple SQL calls plus filtering in the script → returns a tiny summary.
```

The script handles all the procedural work. The LLM just gets the answer.

Bonus. Scripts are repeatable. Run them twice and you get the same results. With a compiler they are less prone to hallucinations. Syntax errors fail fast, not after a confident but wrong answer. Model code execution is advancing faster than anything else, which makes this the clear winner.

# Wrap Up

The evolution is clear. RAG (preload everything) → agent based with MCP (call tools, get data back) → scripting (write code that calls multiple tools and filters before returning). Each stage reduces what hits the LLM's context and it saves both tokens and money.

With MCP you call one SQL query and data comes back to context. You call another and more data returns to context. Every token costs. With scripting the LLM writes code (any language) that calls multiple SQL queries, filters everything in the script, and returns just the answer. A 100MB log file becomes 5 entries. 10,000 user records become summary statistics. Context windows stay small and costs stay low.

Scripts are repeatable, compiler checked, and less prone to hallucinations. Syntax errors fail fast. Models are getting better at code faster than anything else, so scripting is the winning bet. The future is not about how much we can cram into context. It is about how intelligently we keep things out.
