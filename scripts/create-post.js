#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function extractTagsFromContent(content) {
  // Common tags based on your existing posts
  const commonTags = [
    'conversion', 'conversions', 'conversion rate', 'bounce rate', 'revenue', 'sales',
    'page views', 'sessions', 'traffic', 'engagement', 'satisfaction', 'orders',
    'LCP', 'FID', 'INP', 'CLS', 'core web vitals', 'user timing', 'server',
    'ads', 'ad viewability', 'impressions', 'reach', 'seo', 'search',
    'abandonment', 'expense', 'publishing', 'posts', 'viewability'
  ];
  
  const foundTags = [];
  const contentLower = content.toLowerCase();
  
  commonTags.forEach(tag => {
    if (contentLower.includes(tag.toLowerCase().replace('-', ' '))) {
      foundTags.push(tag);
    }
  });
  
  // Extract year if mentioned
  const yearMatch = content.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    foundTags.push(yearMatch[1]);
  }
  
  return foundTags;
}

async function createPostFromIssue() {
  console.log('🚀 WPO Stats Post Creator\n');
  
  try {
    // Get issue details
    const title = await question('📝 Enter the case study title: ');
    const storySource = await question('🔗 Enter the story source URL: ');
    const storyYear = await question('📅 Enter the year published: ');
    const content = await question('📄 Paste the case study content (press Enter twice when done):\n');
    
    // Extract tags from content
    const autoTags = extractTagsFromContent(content);
    console.log(`\n🏷️  Auto-detected tags: ${autoTags.join(', ')}`);
    
    const additionalTags = await question('🏷️  Enter any additional tags (comma-separated, or press Enter to skip): ');
    
    // Combine tags
    const allTags = [...autoTags];
    
    // Add storyYear as a tag
    if (storyYear.trim()) {
      allTags.push(storyYear.trim());
    }
    
    if (additionalTags.trim()) {
      const extraTags = additionalTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      allTags.push(...extraTags);
    }
    
    // Generate filename
    const slug = generateSlug(title);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `${dateStr}-${slug}.md`;
    
    // Generate frontmatter
    const frontmatter = `---
layout: post
title:  "${content}"
storySource: "${storySource}"
date:   ${formatDate(now)}
permalink: "/{{ page.date | date: '%Y/%m/%d' }}/{{ page.fileSlug }}/"
tags:
${allTags.map(tag => ` - ${tag}`).join('\n')}
---

`;
    
    // Write file
    const filePath = path.join(__dirname, '..', 'site', 'posts', filename);
    fs.writeFileSync(filePath, frontmatter);
    
    console.log(`\n✅ Post created successfully!`);
    console.log(`📁 File: ${filename}`);
    console.log(`📍 Path: ${filePath}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Review the generated post`);
    console.log(`2. Run \`npm run build\` to generate the site`);
    console.log(`3. Commit and push your changes`);
    
  } catch (error) {
    console.error('❌ Error creating post:', error.message);
  } finally {
    rl.close();
  }
}

createPostFromIssue();
