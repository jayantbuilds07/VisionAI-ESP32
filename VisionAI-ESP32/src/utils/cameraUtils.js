export function parseCameraTarget(input, defaultPort = 81, defaultPath = '/stream') {
  if (!input) return { host: '', port: defaultPort, path: defaultPath, fullUrl: '' }
  let raw = input.trim()
  if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = 'http://' + raw
  }
  try {
    const url = new URL(raw)
    const host = url.hostname
    const port = url.port || defaultPort
    let path = url.pathname && url.pathname !== '/' ? url.pathname : defaultPath
    if (!path.startsWith('/')) path = '/' + path
    return { host, port, path, fullUrl: `http://${host}:${port}${path}` }
  } catch {
    const clean = input.trim().replace(/^https?:\/\//, '')
    const [hostPort, ...pathParts] = clean.split('/')
    const [host, port] = hostPort.split(':')
    const finalPath = pathParts.length > 0 ? '/' + pathParts.join('/') : defaultPath
    return {
      host: host || '',
      port: port || defaultPort,
      path: finalPath,
      fullUrl: host ? `http://${host}:${port || defaultPort}${finalPath}` : ''
    }
  }
}

export function parseIP(input) {
  if (!input) return ''
  return parseCameraTarget(input).host
}

export function validateIP(input) {
  const { host } = parseCameraTarget(input)
  if (!host) return 'Please enter an IP address (e.g. 10.19.158.145)'
  const parts = host.split('.')
  if (parts.length !== 4) return 'IP must have 4 parts separated by dots'
  for (const part of parts) {
    const n = Number(part)
    if (part === '' || isNaN(n) || !Number.isInteger(n) || n < 0 || n > 255) {
      return 'Each part must be a number between 0 and 255'
    }
  }
  return null
}

export function buildStreamUrl(input, port = 81, path = '/stream') {
  const error = validateIP(input)
  if (error) return null
  const parsed = parseCameraTarget(input, port, path)
  return parsed.fullUrl
}

export function buildSnapshotUrl(input, port = 80, path = '/capture') {
  const error = validateIP(input)
  if (error) return null
  const parsed = parseCameraTarget(input, port, path)
  return `http://${parsed.host}:${port}${path}`
}

export function formatIP(input) {
  return parseIP(input) || input
}
