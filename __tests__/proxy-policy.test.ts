/**
 * Tests that the proxyPolicy does NOT leak application-level request headers
 * into the HTTP CONNECT tunnel handshake.
 *
 * Background: HttpsProxyAgent's `headers` constructor option specifies headers
 * to send in the CONNECT request to the proxy server. When Azure SDK request
 * headers (Content-Type, x-ms-version, x-ms-blob-type, etc.) are passed here,
 * strict corporate proxies (Fortinet, Zscaler) reject the tunnel — causing
 * ECONNRESET.  See: https://github.com/actions/upload-artifact/issues/747
 */
import {describe, test, expect, beforeEach, afterEach} from '@jest/globals'

import {
  createPipelineRequest,
  proxyPolicy,
  type PipelineRequest,
  type SendRequest
} from '@typespec/ts-http-runtime'
import {HttpsProxyAgent} from 'https-proxy-agent'
import {HttpProxyAgent} from 'http-proxy-agent'

describe('proxyPolicy', () => {
  const PROXY_URL = 'http://corporate-proxy.example.com:3128'

  let savedHttpsProxy: string | undefined
  let savedHttpProxy: string | undefined
  let savedNoProxy: string | undefined

  beforeEach(() => {
    // Save and set proxy env vars
    savedHttpsProxy = process.env['HTTPS_PROXY']
    savedHttpProxy = process.env['HTTP_PROXY']
    savedNoProxy = process.env['NO_PROXY']

    process.env['HTTPS_PROXY'] = PROXY_URL
    process.env['HTTP_PROXY'] = PROXY_URL
    delete process.env['NO_PROXY']
  })

  afterEach(() => {
    // Restore original env
    if (savedHttpsProxy !== undefined) {
      process.env['HTTPS_PROXY'] = savedHttpsProxy
    } else {
      delete process.env['HTTPS_PROXY']
    }
    if (savedHttpProxy !== undefined) {
      process.env['HTTP_PROXY'] = savedHttpProxy
    } else {
      delete process.env['HTTP_PROXY']
    }
    if (savedNoProxy !== undefined) {
      process.env['NO_PROXY'] = savedNoProxy
    } else {
      delete process.env['NO_PROXY']
    }
  })

  /**
   * A mock "next" handler that captures the request after the proxy policy
   * has set the agent, so we can inspect it.
   */
  function createCapturingNext(): SendRequest & {
    capturedRequest: PipelineRequest | undefined
  } {
    const fn = async (request: PipelineRequest) => {
      fn.capturedRequest = request
      return {
        status: 200,
        headers: createPipelineRequest({url: ''}).headers,
        request
      }
    }
    fn.capturedRequest = undefined as PipelineRequest | undefined
    return fn
  }

  test('does not leak application headers into HttpsProxyAgent CONNECT request', async () => {
    const policy = proxyPolicy()
    const next = createCapturingNext()

    // Simulate an Azure Blob Storage upload request with typical SDK headers
    const request = createPipelineRequest({
      url: 'https://productionresultssa0.blob.core.windows.net/artifacts/upload'
    })
    request.headers.set('Content-Type', 'application/octet-stream')
    request.headers.set('x-ms-version', '2024-11-04')
    request.headers.set('x-ms-blob-type', 'BlockBlob')
    request.headers.set(
      'x-ms-client-request-id',
      '00000000-0000-0000-0000-000000000000'
    )

    await policy.sendRequest(request, next)

    // The policy should have assigned an HttpsProxyAgent
    const agent = next.capturedRequest?.agent
    expect(agent).toBeDefined()
    expect(agent).toBeInstanceOf(HttpsProxyAgent)

    // CRITICAL: The agent's proxyHeaders must NOT contain application headers.
    // If this fails, application headers are being leaked into the CONNECT
    // request, which breaks strict corporate proxies.
    const proxyAgent = agent as HttpsProxyAgent<string>
    const proxyHeaders =
      typeof proxyAgent.proxyHeaders === 'function'
        ? proxyAgent.proxyHeaders()
        : proxyAgent.proxyHeaders

    expect(proxyHeaders).toBeDefined()

    // None of the Azure SDK application headers should appear
    const headerObj = proxyHeaders as Record<string, string>
    expect(headerObj['content-type']).toBeUndefined()
    expect(headerObj['Content-Type']).toBeUndefined()
    expect(headerObj['x-ms-version']).toBeUndefined()
    expect(headerObj['x-ms-blob-type']).toBeUndefined()
    expect(headerObj['x-ms-client-request-id']).toBeUndefined()

    // proxyHeaders should be empty (no application headers leaked)
    expect(Object.keys(headerObj).length).toBe(0)
  })

  test('does not leak application headers into HttpProxyAgent CONNECT request', async () => {
    const policy = proxyPolicy()
    const next = createCapturingNext()

    // Simulate an insecure (HTTP) request with application headers
    const request = createPipelineRequest({
      url: 'http://example.com/api/upload',
      allowInsecureConnection: true
    })
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('Authorization', 'Bearer some-token')

    await policy.sendRequest(request, next)

    const agent = next.capturedRequest?.agent
    expect(agent).toBeDefined()
    expect(agent).toBeInstanceOf(HttpProxyAgent)
  })

  test('still routes HTTPS requests through the proxy', async () => {
    const policy = proxyPolicy()
    const next = createCapturingNext()

    const request = createPipelineRequest({
      url: 'https://results-receiver.actions.githubusercontent.com/twirp/test'
    })

    await policy.sendRequest(request, next)

    const agent = next.capturedRequest?.agent
    expect(agent).toBeDefined()
    expect(agent).toBeInstanceOf(HttpsProxyAgent)

    // Verify the proxy URL is correct
    const proxyAgent = agent as HttpsProxyAgent<string>
    expect(proxyAgent.proxy.href).toBe(`${PROXY_URL}/`)
  })

  test('bypasses proxy for no_proxy hosts', async () => {
    // Use customNoProxyList since globalNoProxyList is only loaded once.
    // Patterns starting with "." match subdomains (e.g. ".example.com"
    // matches "api.example.com"), bare names match the host exactly.
    const policy = proxyPolicy(undefined, {
      customNoProxyList: ['.blob.core.windows.net', 'exact-host.test']
    })
    const next = createCapturingNext()

    // This host matches ".blob.core.windows.net" via subdomain matching
    const request = createPipelineRequest({
      url: 'https://productionresultssa0.blob.core.windows.net/artifacts/upload'
    })

    await policy.sendRequest(request, next)

    // Agent should not be set for a bypassed host
    expect(next.capturedRequest?.agent).toBeUndefined()
  })

  test('does not override a custom agent already set on the request', async () => {
    const policy = proxyPolicy()
    const next = createCapturingNext()

    const customAgent = new HttpsProxyAgent('http://custom-proxy:9999')
    const request = createPipelineRequest({
      url: 'https://blob.core.windows.net/test'
    })
    request.agent = customAgent

    await policy.sendRequest(request, next)

    // The policy should not overwrite the pre-existing agent
    expect(next.capturedRequest?.agent).toBe(customAgent)
  })
})
