import React, {useState} from 'react';
import {host, Button, Input, Checkbox, SegmentedControl, ListRow, Badge, useQuery, useValue, usePluginI18n} from '@hermes/plugin-sdk';
import {normalizeAddress} from './url';
import {ID} from './locales';

type Provider='tailscale'|'cloudflare'|'existing';
type State={platform:string;installed:boolean;can_install:boolean;connected:boolean;url:string;serve:string;web_ready:boolean;web_url:string;origin:string;issue:string;job:{state:string;action:string;message:string}};
const actions:React.CSSProperties={display:'flex',flexWrap:'wrap',gap:8,marginTop:12};
const details:React.CSSProperties={color:'var(--ui-text-tertiary)',margin:'12px 0',lineHeight:1.6};
export function Wizard({ctx,onSave,onClose}:{ctx:any;onSave:(url:string)=>void;onClose:()=>void}) {
 const t=usePluginI18n(ID);
 const profile=useValue(host.state.profile);
 const [provider,setProvider]=useState<Provider>(()=>{const value=ctx.storage.get('setup-provider','tailscale');return ['tailscale','cloudflare','existing'].includes(value)?value:'tailscale';});
 const [step,setStep]=useState(0);
 const [error,setError]=useState('');
 const [busy,setBusy]=useState(false);
 const [address,setAddress]=useState('');
 const [checked,setChecked]=useState(false);
 const [notice,setNotice]=useState('');
 const [failedLink,setFailedLink]=useState('');
 const query=useQuery({queryKey:[ID,'setup',profile],queryFn:()=>ctx.rest('/setup/status',{timeoutMs:35000}) as Promise<State>,refetchInterval:5000,retry:false});
 const state:State|undefined=query.data;
 const unavailable=Boolean(query.error);
 const running=busy||state?.job.state==='running';
 const invoke=async(action:string)=>{setBusy(true);setError('');setNotice('');try{await ctx.rest('/setup/action',{method:'POST',body:{action},timeoutMs:35000});await query.refetch();}catch{setError('failed');}finally{setBusy(false);}};
 const external=async(url:string)=>{try{if(await ctx.os.openExternal(url)===false)throw new Error();}catch{setError('openFailed');setFailedLink(url);}};
 const copy=async(url:string)=>{try{if(!await ctx.os.writeClipboard(url))throw new Error();setNotice('copied');}catch{setError('copyFailed');}};
 const save=()=>{try{const url=normalizeAddress(provider==='tailscale'?state?.url||'':address);ctx.storage.set('setup-provider',provider);onSave(url);}catch(e){setError(e instanceof Error?e.message:'error');}};
 const same=Boolean(state?.url&&state.web_url.replace(/\/$/,'')===state.url);
 const ready=Boolean(state?.connected&&state.web_ready&&same);
 const canShare=ready&&['ready','available'].includes(state?.serve||'');
 const jobMessage=state?.job.message==='finish_login_in_app'?'finishLogin':state?.job.state==='error'?'failed':'done';
 const change=(p:Provider)=>{setProvider(p);setChecked(false);setError('');setNotice('');};
 return <div>
  <ListRow wide title={t('setup')} description={t('flow')} action={<Button variant="ghost" onClick={onClose}>{t('back')}</Button>}/>
  {step===0?<>
   <ListRow wide title={t('provider')} below={<div style={{marginTop:12}}><SegmentedControl value={provider} onChange={change} options={(['tailscale','cloudflare','existing'] as const).map(id=>({id,label:t(id)}))}/><p style={details}>{t(provider==='tailscale'?'tailHelp':provider==='cloudflare'?'cloudHelp':'existingHelp')}</p></div>}/>
   <Button onClick={()=>setStep(1)}>{t('next')}</Button>
  </>:<>
   <Button variant="text" onClick={()=>setStep(0)}>{t('change')}</Button>
   {provider==='tailscale'&&<>
    {unavailable&&<ListRow wide title={t('unavailable')} below={<div style={actions}><Button variant="secondary" onClick={()=>{host.newChat('default');}}>{t('mainProfile')}</Button><Button variant="secondary" onClick={()=>void query.refetch()}>{t('check')}</Button></div>}/>}
    {query.isPending&&<p role="status">{t('checking')}</p>}
    {state&&!unavailable&&<>
     <ListRow wide title={t('installTitle')} action={<Badge variant={state.connected?'success':'muted'}>{t(state.installed?'installed':'missing')} · {t(state.connected?'connected':'disconnected')}</Badge>} description={t('installHelp')} below={<div style={actions}>
      {!state.installed&&state.can_install&&<Button disabled={running} onClick={()=>void invoke('install')}>{t('install')}</Button>}
      {!state.installed&&<Button variant="secondary" onClick={()=>void external('https://tailscale.com/download')}>{t('download')}</Button>}
      {state.installed&&!state.connected&&<Button disabled={running} onClick={()=>state.platform==='Darwin'?void invoke('login'):void external('https://tailscale.com/docs/quickstart')}>{t('login')}</Button>}
      <Button variant="secondary" disabled={running} onClick={()=>void query.refetch()}>{t('check')}</Button>
     </div>}/>
     <ListRow wide title={t('webTitle')} description={t(ready?'webReady':'webHelp')} below={<>
      {state.url&&<p style={{...details,overflowWrap:'anywhere',userSelect:'text'}}>{state.url}</p>}
      <div style={actions}>{state.url&&<Button variant="secondary" onClick={()=>void copy(state.url)}>{t('copy')}</Button>}<Button variant="secondary" onClick={()=>host.navigate('/settings?tab=web-access')}>{t('webSettings')}</Button></div><p style={details}>{t('returnHelp')}</p>
     </>}/>
     <ListRow wide title={t('shareTitle')} description={t(state.serve==='conflict'?'conflict':'shareHelp')} below={<>
      <div style={actions}><Button disabled={running||!canShare} onClick={()=>void invoke('serve')}>{t(state.serve==='ready'?'reuse':'share')}</Button><Button variant="secondary" onClick={()=>void external('https://login.tailscale.com/admin/dns')}>{t('https')}</Button></div>
      {running&&<p role="status" style={details}>{t('running')}</p>}
      {!running&&state.job.message&&<p role={state.job.state==='error'?'alert':'status'} style={details}>{t(jobMessage)}</p>}
      {state.issue&&<p role="alert" style={details}>{t('failed')}</p>}
      <p style={details}>{t('phone')}</p><Button disabled={running||!ready||state.serve!=='ready'} onClick={save}>{t('create')}</Button>
     </>}/>
    </>}
   </>}
   {provider==='cloudflare'&&<>
    <ListRow wide title={t('cf1')} description={t('cfHelp1')} below={<div style={actions}><Button variant="secondary" onClick={()=>void external('https://dash.cloudflare.com/')}>{t('console')}</Button><Button variant="secondary" onClick={()=>void external('https://developers.cloudflare.com/tunnel/get-started/')}>{t('guide')}</Button></div>}/>
    <ListRow wide title={t('cf2')} description={t('cfHelp2')}/>
    <ListRow wide title={t('cf3')} description={t('cfHelp3')} below={<><p style={{...details,userSelect:'text'}}>{state?.origin||'http://127.0.0.1:9120'}</p>{!state&&<p style={details}>{t('originFallback')}</p>}<Button variant="secondary" onClick={()=>host.navigate('/settings?tab=web-access')}>{t('webSettings')}</Button></>}/>
   </>}
   {provider!=='tailscale'&&<ListRow wide title={<label htmlFor="qr-wizard-address">{t('address')}</label>} description={t('manualHelp')} below={<div style={{marginTop:12}}><Input id="qr-wizard-address" value={address} onChange={e=>{setAddress(e.target.value);setChecked(false);}} placeholder="https://hermes.example.com" inputMode="url" autoComplete="off" spellCheck={false}/><label style={{...actions,alignItems:'center',marginBottom:16}}><Checkbox checked={checked} onCheckedChange={value=>setChecked(value===true)}/>{t('confirmed')}</label><Button disabled={!checked} onClick={save}>{t('create')}</Button></div>}/>}
  </>}
  {error&&<p role="alert" style={{color:'var(--destructive)',marginTop:16}}>{t(error)} {failedLink}</p>}<p role="status">{notice?t(notice):''}</p>
 </div>;
}
