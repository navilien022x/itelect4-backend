import 'dotenv/config'
import app from './app'

async function startServer(): Promise<void> {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.')
  }

  const port = Number(process.env.PORT ?? 5000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.')
  }
  app.listen(port, () => {
    console.log(
      [
        '',
        '========================================',
        '       CAMPUS FOOD API STARTED',
        '========================================',
        'Backend server listening at:',
        `  http://localhost:${port}`,
        'Database health check:',
        `  http://localhost:${port}/api/health`,
        '========================================',
        '',
      ].join('\n'),
    )
  })
}

startServer().catch((error: unknown) => {
  console.error('Failed to start Campus Food API:', error)
  process.exitCode = 1
})
