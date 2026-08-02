import { Fragment } from "react"

type InlineToken =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "italic"; text: string }
  | { type: "code"; text: string }

type Block =
  | { type: "paragraph"; tokens: InlineToken[] }
  | { type: "list"; items: InlineToken[][] }
  | { type: "label"; label: string; tokens: InlineToken[] }

function charAt(s: string, idx: number): string {
  return s[idx] ?? ""
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let i = 0
  let current = ""

  while (i < text.length) {
    const ch = charAt(text, i)
    const next = charAt(text, i + 1)

    if (ch === "*" && next === "*") {
      if (current) {
        tokens.push({ type: "text", text: current })
        current = ""
      }
      const end = text.indexOf("**", i + 2)
      if (end !== -1) {
        tokens.push({ type: "bold", text: text.slice(i + 2, end) })
        i = end + 2
      } else {
        current += "**"
        i += 2
      }
    } else if (ch === "`") {
      if (current) {
        tokens.push({ type: "text", text: current })
        current = ""
      }
      const end = text.indexOf("`", i + 1)
      if (end !== -1) {
        tokens.push({ type: "code", text: text.slice(i + 1, end) })
        i = end + 1
      } else {
        current += "`"
        i++
      }
    } else if (ch === "*" || ch === "_") {
      if (current) {
        tokens.push({ type: "text", text: current })
        current = ""
      }
      const end = text.indexOf(ch, i + 1)
      if (end !== -1) {
        const inner = text.slice(i + 1, end)
        if (inner.length > 0 && !inner.includes(ch)) {
          tokens.push({ type: "italic", text: inner })
          i = end + 1
        } else {
          current += ch
          i++
        }
      } else {
        current += ch
        i++
      }
    } else {
      current += ch
      i++
    }
  }

  if (current) {
    tokens.push({ type: "text", text: current })
  }

  return tokens
}

function lineAt(lines: string[], idx: number): string {
  return lines[idx] ?? ""
}

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  const lines = text.split("\n")
  let i = 0

  while (i < lines.length) {
    const line = lineAt(lines, i)
    const trimmed = line.trim()

    if (trimmed === "") {
      i++
      continue
    }

    // Check for label-style emphasis: [Important], [Note], [Tip], etc.
    const labelMatch = trimmed.match(/^\[([A-Z][a-z]+)\]\s*(.*)/)
    if (labelMatch) {
      const [, label = "", rest = ""] = labelMatch
      blocks.push({
        type: "label",
        label,
        tokens: rest ? parseInline(rest) : [],
      })
      i++
      continue
    }

    // Shared regex for list items: unordered (-, *, •) or numbered (1., 2), etc.)
    const listMarkerRe = /^(\d+[.)]|[-*•])\s/
    if (listMarkerRe.test(trimmed)) {
      const items: InlineToken[][] = []
      while (i < lines.length && listMarkerRe.test(lineAt(lines, i).trim())) {
        const itemText = lineAt(lines, i).trim().replace(/^(\d+[.)]\s*|[-*•]\s*)/, "")
        items.push(parseInline(itemText))
        i++
      }
      blocks.push({ type: "list", items })
      continue
    }

    // Regular paragraph: collect consecutive non-empty, non-list, non-label lines
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lineAt(lines, i).trim() !== "" &&
      !listMarkerRe.test(lineAt(lines, i).trim()) &&
      !/^\[[A-Z][a-z]+\]/.test(lineAt(lines, i).trim())
    ) {
      paragraphLines.push(lineAt(lines, i).trim())
      i++
    }
    if (paragraphLines.length > 0) {
      blocks.push({
        type: "paragraph",
        tokens: parseInline(paragraphLines.join(" ")),
      })
    }
  }

  return blocks
}

export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null

  const blocks = parseBlocks(content)

  return (
    <>
      {blocks.map((block, idx) => (
        <Fragment key={idx}>
          {idx > 0 && block.type !== "list" && <div className="mt-2" />}
          {block.type === "paragraph" && (
            <p className="leading-relaxed">
              <InlineTokens tokens={block.tokens} />
            </p>
          )}
          {block.type === "list" && (
            <ul className="list-none space-y-1 my-2 pl-1">
              {block.items.map((item, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-muted-foreground select-none shrink-0">
                    &mdash;
                  </span>
                  <span>
                    <InlineTokens tokens={item} />
                  </span>
                </li>
              ))}
            </ul>
          )}
          {block.type === "label" && (
            <p className="leading-relaxed">
              <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary mr-1.5 align-middle">
                {block.label}
              </span>
              {block.tokens.length > 0 && <InlineTokens tokens={block.tokens} />}
            </p>
          )}
        </Fragment>
      ))}
    </>
  )
}

function InlineTokens({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, i) => {
        if (token.type === "bold") {
          return <strong key={i}>{token.text}</strong>
        }
        if (token.type === "italic") {
          return <em key={i}>{token.text}</em>
        }
        if (token.type === "code") {
          return (
            <code
              key={i}
              className="rounded bg-muted px-1 py-0.5 text-[12px] font-mono"
            >
              {token.text}
            </code>
          )
        }
        return <Fragment key={i}>{token.text}</Fragment>
      })}
    </>
  )
}
