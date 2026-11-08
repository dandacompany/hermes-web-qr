import React, {useState} from 'react';
import QRCode from 'qrcode';
import {host, Button, Input, Codicon, ListRow, usePluginI18n, PALETTE_AREA, pluginSettingsHref} from '@hermes/plugin-sdk';
import {normalizeAddress} from './url';
import {Wizard} from './wizard';
import {ID,locales} from './locales';
declare const __DEFAULT_URL__: string;
export const pageStyle: React.CSSProperties = {maxWidth:760,margin:'0 auto',padding:'8px 24px 32px',color:'var(--ui-text-primary)',fontSize:'var(--conversation-text-font-size)'};
export default {
 id:ID,name:'Web Access QR',description:'Remote access setup and mobile QR.',defaultEnabled:true,
 register(ctx:any) {
  ctx.i18n.register(locales);
  const open=()=>host.navigate(pluginSettingsHref(ID));
  function StatusButton(){const t=usePluginI18n(ID);return <Button variant="ghost" size="icon-xs" title={t('open')} aria-label={t('open')} onClick={open}><Codicon name="device-mobile"/></Button>;}
  function Page(){
   const t=usePluginI18n(ID);
   const [saved,setSaved]=useState<string>(()=>{try{return normalizeAddress(ctx.storage.get('url',__DEFAULT_URL__));}catch{return '';}});
   const [draft,setDraft]=useState(saved);
   const [wizard,setWizard]=useState(!saved);
   const [message,setMessage]=useState('');
   const [error,setError]=useState('');
   const save=(value:string)=>{const url=normalizeAddress(value);ctx.storage.set('url',url);setSaved(url);setDraft(url);setWizard(false);setError('');setMessage('saved');};
   const copy=async()=>{try{if(!await ctx.os.writeClipboard(saved))throw new Error();setMessage('copied');setError('');}catch{setError('copyFailed');}};
   let qr:ReturnType<typeof QRCode.create>|undefined;
   try{if(saved)qr=QRCode.create(saved,{errorCorrectionLevel:'M'});}catch{}
   const path=qr?Array.from(qr.modules.data,(v,i)=>v?`M${i%qr!.modules.size+4} ${Math.floor(i/qr!.modules.size)+4}h1v1h-1z`:'').join(''):'';
   return <section style={pageStyle}>{wizard?<Wizard ctx={ctx} onSave={save} onClose={()=>setWizard(false)}/>:<>
    <ListRow wide title={t('title')} description={t('intro')} action={<Button variant="secondary" onClick={()=>setWizard(true)}>{t('setup')}</Button>}/>
    {qr?<div style={{textAlign:'center',padding:'16px 0'}}><svg role="img" aria-label={t('qrLabel')} viewBox={`0 0 ${qr.modules.size+8} ${qr.modules.size+8}`} shapeRendering="crispEdges" style={{display:'block',width:'100%',maxWidth:280,height:'auto',margin:'0 auto',background:'#fff'}}><rect width="100%" height="100%" fill="#fff"/><path d={path} fill="#000"/></svg><p style={{overflowWrap:'anywhere',userSelect:'text',margin:'16px 0'}}>{saved}</p><Button variant="secondary" onClick={copy}>{t('copy')}</Button>{new URL(saved).hostname.endsWith('.ts.net')&&<p style={{color:'var(--ui-text-tertiary)',marginTop:12}}>{t('phone')}</p>}</div>:<p>{t(saved?'qrFailed':'empty')}</p>}
    <form onSubmit={e=>{e.preventDefault();try{save(draft);}catch(e){setError(e instanceof Error?e.message:'error');}}}>
     <ListRow wide title={<label htmlFor="hermes-web-qr-url">{t('address')}</label>} description={t('addressHelp')} action={<Button type="submit">{t('save')}</Button>} below={<Input id="hermes-web-qr-url" inputMode="url" autoComplete="off" spellCheck={false} value={draft} placeholder="https://hermes.example.com" onChange={e=>{setDraft(e.target.value);setMessage('');setError('');}} style={{marginTop:12}}/>}/>
    </form>
    {error&&<p role="alert" style={{color:'var(--destructive)'}}>{t(error)}</p>}<p role="status">{message?t(message):''}</p>
   </>}</section>;
  }
  ctx.registerSettingsPage({id:'settings',title:'Web Access QR',icon:'device-mobile',render:()=> <Page/>});
  let disposeCommand:undefined|(()=>void);
  const labels=()=>{disposeCommand?.();disposeCommand=ctx.register({id:'open',area:PALETTE_AREA,data:{id:ID+'.open',label:ctx.i18n.t('open'),keywords:['qr','phone','mobile','web'],run:open}});};
  labels();ctx.i18n.onLocaleChange(labels);
  ctx.register({id:'status',area:'statusBar.right',order:130,render:()=> <StatusButton/>});
 }
};
