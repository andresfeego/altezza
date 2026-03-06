export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    app: process.env.APP_NAME || 'mievento',
    env: process.env.APP_ENV || 'lab',
    sha: process.env.APP_SHA || null,
    builtAt: process.env.BUILT_AT || null,
  })
}
