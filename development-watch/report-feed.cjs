'use strict';
const assert = require('node:assert/strict');
const exact = (value, keys, label) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).sort().join('|') !== [...keys].sort().join('|')) throw Error(label + ': unexpected or missing fields');
};
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
const plain = (v, max) => typeof v === 'string' && v.length > 0 && v.length <= max && v === v.trim() && !/[<>\x00-\x1f\x7f]/.test(v);
const areas = new Set(['match-experience','moves-and-finishes','ringside','career','living-world','development-process']);
const states = new Set(['research','in-development','internal-testing','verified-milestone','planned','correction']);
function validate(feed) {
  exact(feed,['schema_version','project','updated_at','reports'],'feed');
  if(feed.schema_version !== 1 || feed.project !== 'RINGBOUND' || !Array.isArray(feed.reports) || feed.reports.length > 1000) throw Error('Invalid feed');
  if(feed.reports.length === 0) { if(feed.updated_at !== null) throw Error('Empty feed date must be null'); return feed; }
  if(!date(feed.updated_at)) throw Error('Invalid feed date');
  let prior = null;
  for(const r of feed.reports) {
    exact(r,['id','published_on','coverage_start','coverage_end','title','summary','highlights','public_release_approved','independent_review_passed'],'report');
    if(!/^RINGSIDE-[0-9]{6}$/.test(r.id) || (prior && r.id <= prior.id)) throw Error('Report ID must be unique and increasing');
    if(!date(r.published_on)||!date(r.coverage_start)||!date(r.coverage_end)||r.coverage_start>r.coverage_end||r.coverage_end>r.published_on||r.published_on>feed.updated_at||(prior&&r.published_on<prior.published_on)) throw Error('Invalid report chronology');
    if(r.public_release_approved !== true || r.independent_review_passed !== true) throw Error('Publication and independent review required');
    if(!plain(r.title,120)||!plain(r.summary,1000)||!Array.isArray(r.highlights)||r.highlights.length<1||r.highlights.length>10) throw Error('Invalid report content');
    for(const h of r.highlights) {
      exact(h,['area','state','title','player_impact'],'highlight');
      if(!areas.has(h.area)||!states.has(h.state)||!plain(h.title,120)||!plain(h.player_impact,600)) throw Error('Invalid highlight');
    }
    prior=r;
  }
  if(feed.updated_at!==prior.published_on) throw Error('Feed date must match newest publication date');
  return feed;
}
function canonical(v){if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
function validateAppend(previous,next){
  validate(previous);validate(next);
  if(next.reports.length<previous.reports.length)throw Error('Normal publication cannot delete reports');
  for(let i=0;i<previous.reports.length;i++)if(canonical(previous.reports[i])!==canonical(next.reports[i]))throw Error('Normal publication cannot rewrite reports');
  return next.reports.length-previous.reports.length;
}
module.exports={validate,validateAppend};
