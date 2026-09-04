import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve(async (req) => {
  if (req.method === "POST") {
    const {msg, key} = await req.json();
    console.log("Key length:", key?.length);
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key.trim(), "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{role: "user", content: msg}] })
    });
    const d = await r.json();
    console.log(d);
    if(d.error) return new Response(JSON.stringify({ans: "Groq Error: " + d.error.message}), {headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}});
    return new Response(JSON.stringify({ans: d.choices?.[0]?.message?.content || JSON.stringify(d)}), {headers: {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}});
  }
  const html = "<html><head><meta name=viewport content='width=device-width,initial-scale=1'><title>ThirdEye AI</title><style>body{background:#000;color:#0f0;font-family:sans-serif;margin:0}.header{background:#111;padding:15px;text-align:center;border-bottom:2px solid #0f0}#chat{height:65vh;overflow-y:auto;padding:20px}.msg{margin:10px;padding:12px;border-radius:10px;max-width:80%}.user{background:#0f0;color:#000;margin-left:auto}.ai{background:#111;border:1px solid #0f0}.inputbox{display:flex;padding:15px;background:#111;position:fixed;bottom:0;width:100%;box-sizing:border-box}input{flex:1;padding:12px;background:#000;color:#0f0;border:1px solid #0f0;border-radius:5px}button{padding:12px 20px;background:#0f0;color:#000;border:none;border-radius:5px;margin-left:10px;font-weight:bold}#keybox{padding:10px;text-align:center;background:#0a0a0a}#keybox input{width:60%}</style></head><body><div class=header><h2>ThirdEye AI - Ishan ka AI</h2></div><div id=keybox><input id=k placeholder='Groq API Key (gsk_...)'><button onclick=saveKey()>Save</button></div><div id=chat><div class='msg ai'>Hi Ishan! Key sahi daalo aur pucho!</div></div><div class=inputbox><input id=m placeholder='Kuch pucho...'><button onclick=send()>Send</button></div><script>let key=localStorage.getItem('groq')||'';if(key)document.getElementById('k').value=key;function saveKey(){key=document.getElementById('k').value.trim();localStorage.setItem('groq',key);alert('Key Save!');}async function send(){let i=document.getElementById('m');let msg=i.value.trim();if(!msg)return;if(!key){alert('Pehle Key daalo');return;}let c=document.getElementById('chat');c.innerHTML+='<div class=msg user>'+msg+'</div>';i.value='';let id='t'+Date.now();c.innerHTML+='<div class=msg ai id='+id+'>Soch raha hu...</div>';c.scrollTop=c.scrollHeight;let res=await fetch('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg,key})});let data=await res.json();document.getElementById(id).innerHTML=data.ans;}</script></body></html>";
  return new Response(html, {headers: {"Content-Type": "text/html"}});
});
