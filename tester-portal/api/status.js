// Public read-only recruitment status. This file contains no applicant data or secrets.
export default function handler(req, res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Access-Control-Allow-Methods','GET');
  res.setHeader('X-Content-Type-Options','nosniff');
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  return res.status(200).json({project:'RINGBOUND',applications_open:false,invitations_open:false,public_test_announced:false,status:'closed',discord:'https://discord.gg/RkmATFsk'});
}