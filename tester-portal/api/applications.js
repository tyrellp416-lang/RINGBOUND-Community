// Closed intake endpoint: explicitly rejects every request without reading or storing body data.
export default function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Allow','POST');
  res.status(403).json({error:'APPLICATIONS_CLOSED',message:'RINGBOUND is not accepting tester applications yet. Follow our Discord for announcements.'});
}