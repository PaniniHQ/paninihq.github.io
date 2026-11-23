// Turns plain-text URLs inside rehype-citation bibliography entries
// (.csl-entry) into links. Run after rehype-citation.
const URL_RE = /https?:\/\/[^\s<>"]+[^\s<>".,;:)\]]/g;

function hasClass(node, name) {
  const cls = node.properties?.className;
  return Array.isArray(cls) ? cls.includes(name) : cls === name;
}

function linkify(node) {
  if (!node.children) return;
  node.children = node.children.flatMap((child) => {
    if (child.type === 'element') {
      if (child.tagName !== 'a') linkify(child);
      return [child];
    }
    if (child.type !== 'text') return [child];
    const out = [];
    let last = 0;
    for (const m of child.value.matchAll(URL_RE)) {
      if (m.index > last) out.push({ type: 'text', value: child.value.slice(last, m.index) });
      out.push({
        type: 'element',
        tagName: 'a',
        properties: { href: m[0] },
        children: [{ type: 'text', value: m[0] }],
      });
      last = m.index + m[0].length;
    }
    if (last === 0) return [child];
    if (last < child.value.length) out.push({ type: 'text', value: child.value.slice(last) });
    return out;
  });
}

function walk(node) {
  if (node.type === 'element' && hasClass(node, 'csl-entry')) return linkify(node);
  node.children?.forEach(walk);
}

export default function rehypeBibLinks() {
  return (tree) => walk(tree);
}
