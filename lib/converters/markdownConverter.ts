import { FileConverter } from '@/types/converter';

class MarkdownParser {
  private static readonly rules = [
    // Headers
    { pattern: /^# (.*$)/gm, replacement: '<h1>$1</h1>' },
    { pattern: /^## (.*$)/gm, replacement: '<h2>$1</h2>' },
    { pattern: /^### (.*$)/gm, replacement: '<h3>$1</h3>' },
    { pattern: /^#### (.*$)/gm, replacement: '<h4>$1</h4>' },
    { pattern: /^##### (.*$)/gm, replacement: '<h5>$1</h5>' },
    { pattern: /^###### (.*$)/gm, replacement: '<h6>$1</h6>' },
    
    // Bold and Italic
    { pattern: /\*\*(.+?)\*\*/g, replacement: '<strong>$1</strong>' },
    { pattern: /\*(.+?)\*/g, replacement: '<em>$1</em>' },
    { pattern: /_(.+?)_/g, replacement: '<em>$1</em>' },
    
    // Links
    { pattern: /\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<a href="$2">$1</a>' },
    
    // Images
    { pattern: /!\[([^\]]+)\]\(([^)]+)\)/g, replacement: '<img src="$2" alt="$1">' },
    
    // Lists
    { pattern: /^\s*[-+*]\s+(.+)/gm, replacement: '<li>$1</li>' },
    { pattern: /^\d+\.\s+(.+)/gm, replacement: '<li>$1</li>' },
    
    // Code blocks
    { pattern: /```([\s\S]*?)```/g, replacement: '<pre><code>$1</code></pre>' },
    { pattern: /`([^`]+)`/g, replacement: '<code>$1</code>' },
    
    // Blockquotes
    { pattern: /^>\s+(.+)/gm, replacement: '<blockquote>$1</blockquote>' },
    
    // Horizontal rules
    { pattern: /^(?:---|\*\*\*|___)\s*$/gm, replacement: '<hr>' },
    
    // Paragraphs
    { pattern: /^(?!<[a-z]|\s*$)(.+)/gm, replacement: '<p>$1</p>' }
  ];

  static parse(markdown: string): string {
    let html = markdown;
    
    // Pre-process lists to wrap them in ul/ol tags
    html = this.processList(html);
    
    // Apply all other rules
    for (const rule of this.rules) {
      html = html.replace(rule.pattern, rule.replacement);
    }
    
    // Clean up any unnecessary newlines and spaces
    html = html.trim()
      .replace(/\n\s*\n/g, '\n')
      .replace(/<\/li>\s*<li>/g, '</li>\n<li>');
    
    return html;
  }

  private static processList(markdown: string): string {
    // Process unordered lists
    markdown = markdown.replace(
      /(?:^\s*[-+*]\s+.+\n?)+/gm,
      match => `<ul>\n${match}</ul>`
    );

    // Process ordered lists
    markdown = markdown.replace(
      /(?:^\s*\d+\.\s+.+\n?)+/gm,
      match => `<ol>\n${match}</ol>`
    );

    return markdown;
  }
}

export const markdownConverter: FileConverter = {
  id: 'markdown-to-html',
  name: 'Markdown to HTML Converter',
  description: 'Converts Markdown files to formatted HTML documents',
  acceptedTypes: ['.md'],
  convert: async (file: File) => {
    try {
      const markdown = await file.text();
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${file.name} - Converted HTML</title>
    <style>
        body {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, Monaco, "Andale Mono", monospace;
            font-size: 0.9em;
            background: #f6f8fa;
            padding: 2px 4px;
            border-radius: 3px;
        }
        blockquote {
            border-left: 4px solid #ddd;
            margin: 0;
            padding-left: 16px;
            color: #666;
        }
        img {
            max-width: 100%;
            height: auto;
        }
        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 24px 0;
        }
    </style>
</head>
<body>
${MarkdownParser.parse(markdown)}
</body>
</html>`;

      // Create a new file with HTML content
      const outputFilename = file.name.replace(/\.(md|txt)$/, '.html');
      return new File([html], outputFilename, {
        type: 'text/html'
      });
    } catch (error) {
      console.error('Markdown conversion failed:', error);
      throw new Error('Failed to convert Markdown to HTML');
    }
  }
};