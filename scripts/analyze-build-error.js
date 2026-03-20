#!/usr/bin/env node

/**
 * AI Build Error Analyzer
 * Fetches Jenkins build log, sends to Claude API,
 * prints fix suggestions directly to Jenkins console output
 */

const https = require('https');
const http = require('http');

const JENKINS_URL = 'http://localhost:8080';
const JOB_NAME = process.env.JOB_NAME || 'sample-pipeline';
const BUILD_NUMBER = process.env.BUILD_NUMBER || 'lastBuild';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';

function fetchJenkinsLog() {
  return new Promise((resolve, reject) => {
    const url = `${JENKINS_URL}/job/${JOB_NAME}/${BUILD_NUMBER}/consoleText`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function callClaudeAPI(log) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a senior DevOps engineer reviewing a Jenkins build failure.
Analyze the log and give the developer clear, actionable fix instructions.

Format your response EXACTLY like this:

ROOT CAUSE:
(one sentence explaining why the build failed)

FILES TO FIX:
(list each file and line number that needs to change)

HOW TO FIX:
(exact code changes the developer needs to make)

PREVENTION:
(one tip to avoid this in future)

Jenkins Build Log:
\`\`\`
${log.slice(-3000)}
\`\`\``
      }]
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text);
        } catch (e) {
          reject(new Error('Failed to parse Claude response: ' + data));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  if (!CLAUDE_API_KEY) {
    console.log('⚠️  CLAUDE_API_KEY not set. Skipping AI analysis.');
    process.exit(0);
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('🤖  AI BUILD ERROR ANALYZER - Powered by Claude');
  console.log('════════════════════════════════════════════════════════\n');

  try {
    console.log(`📋 Fetching build log for ${JOB_NAME} #${BUILD_NUMBER}...`);
    const log = await fetchJenkinsLog();

    console.log('🔍 Analyzing error with Claude AI...\n');
    const suggestions = await callClaudeAPI(log);

    console.log('════════════════════════════════════════════════════════');
    console.log('💡  AI FIX SUGGESTIONS FOR DEVELOPER');
    console.log('════════════════════════════════════════════════════════\n');
    console.log(suggestions);
    console.log('\n════════════════════════════════════════════════════════\n');

  } catch (err) {
    console.log('⚠️  AI analysis failed:', err.message);
  }
}

main();
