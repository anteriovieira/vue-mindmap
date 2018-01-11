/*
 * Extract text from the inner HTML of a node.
 */
const getText = (html) => {
  const res = []

  // Match all text inside A tags. If there's no A tags,
  // match text inside P tags instead.
  const matchText = /<a[^>]*>([^<]*)<\/a>|<p[^>]*>([^>]*)<\/p>/g
  let match = matchText.exec(html)

  while (match) {
    res.push(match[1] || match[2])
    match = matchText.exec(html)
  }

  return res.join(' ')
}

/*
 * Extract HREF content from the first link on a node.
 */
const getURL = (html) => {
  // Match HREF content inside A tags.
  const matchURL = /<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/
  const match = matchURL.exec(html)

  if (match) {
    return match[1]
  }

  return ''
}

module.exports = {
  getText,
  getURL
}
