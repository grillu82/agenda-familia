self.addEventListener("install",event=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));

self.addEventListener("push",event=>{
  let data={title:"Familia MSM",body:"Tienes un recordatorio",url:"./"};
  try{
    if(event.data) data={...data,...event.data.json()};
  }catch(_){}
  const options={
    body:data.body,
    icon:"./icon-192.png",
    badge:"./icon-192.png",
    tag:data.tag||"familia-msm-reminder",
    renotify:true,
    data:{url:data.url||"./"}
  };
  event.waitUntil(self.registration.showNotification(data.title||"Familia MSM",options));
});

self.addEventListener("notificationclick",event=>{
  event.notification.close();
  const target=new URL(event.notification.data?.url||"./",self.location.origin).href;
  event.waitUntil(
    clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
      for(const client of list){
        if(client.url.startsWith(self.location.origin) && "focus" in client){
          client.navigate(target);
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
