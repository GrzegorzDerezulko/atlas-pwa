const CACHE='atlas-pwa-3-8-2-final';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(CORE.map(asset=>cache.add(asset)));await self.skipWaiting();})());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim();})());
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET')return;const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;
 }
 event.respondWith(caches.match(request).then(cached=>{
  const network=fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>cached);
  return cached||network;
 }));
});
self.addEventListener('message',event=>{
 const data=event.data;
 if(data==='SKIP_WAITING'){self.skipWaiting();return;}
 if(data&&data.type==='SHOW_NOTIFICATION'){
  event.waitUntil(self.registration.showNotification(data.title||'ATLAS',data.options||{}));
 }
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const data=event.notification.data||{},task=encodeURIComponent(data.taskId||'workout'),action=encodeURIComponent(event.action||'open');
 const target=new URL(`./#stageN=notifications&task=${task}${action&&action!=='open'?`&action=${action}`:''}`,self.registration.scope).href;
 event.waitUntil((async()=>{
  const list=await clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of list){if('focus'in client){await client.focus();if('navigate'in client)await client.navigate(target);return;}}
  if(clients.openWindow)await clients.openWindow(target);
 })());
});
