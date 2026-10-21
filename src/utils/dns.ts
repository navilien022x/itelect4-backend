import dns from 'node:dns'

export function configureDnsServers(): void {
  const dnsServers = process.env.DNS_SERVERS
    ?.split(',')
    .map((server) => server.trim())
    .filter(Boolean)

  if (dnsServers && dnsServers.length > 0) {
    dns.setServers(dnsServers)
  }
}
