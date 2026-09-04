Deno.serve(async (req)=>{
  if(req.method==="POST"){
    const {msg,key} = await req.json();
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions",{
      method:"POST",
      headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
      body: JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"user",content:msg}]})
    });
    const d = await r.json();
    return new Response(JSON.stringify({ans:d.choices?.[0]?.message?.content||"Key check karo"}),{headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});
  }
  return new Response(`
<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>ThirdEye AI</title>
<style>
body{background:#000;color:#0f0;font-family:sans-serif;margin:0}
.header{background:#111;padding:15px;text-align:center;border-bottom:2px solid #0f0}
#chat{height:70vh;overflow-y:auto;padding:20px}
.msg{margin:10px;padding:12px;border-radius:10px;max-width:80%}
.user{background:#0f0;color:#000;margin-left:auto}
.ai{background:#111;border:1px solid #0f0}
.inputbox{display:flex;padding:15px;background:#111;position:fixed;bottom:0;width:100%;box-sizing:border-box}
input{flex:1;padding:12px;background:#000;color:#0f0;border:1px solid #0f0;border-radius:5px}
button{padding:12px 20px;background:#0f0;color:#000;border:none;border-radius:5px;margin-left:10px;font-weight:bold}
#keybox{padding:10px;text-align:center}
#keybox input{width:70%;font-size:12px}
</style></head><body>
<div class="header"><h2>👁️ ThirdEye AI - Ishan ka AI</h2></div>
<div id="keybox"><input id="k" placeholder="Groq API Key yaha paste karo (gsk_...)"><button onclick="saveKey()">Save</button></div>
<div id="chat"><div class="msg ai">Hi Ishan! 👋 Mai ThirdEye AI hu. Groq Key daalo aur pucho kuch bhi!</div></div>
<div class="inputbox"><input id="m" placeholder="Kuch pucho..."><button onclick="send()">Send</button></div>
<script>
let key=localStorage.getItem('groq')||''; if(key)document.getElementById('k').value=key;
function saveKey(){key=document.getElementById('k').value; localStorage.setItem('groq',key); alert('Key Save ho gayi!');}
async function send(){
  const i=document.getElementById('m'); const msg=i.value; if(!msg||!key)return alert('Key daalo pehle!');
  const c=document.getElementById('chat');
  c.innerHTML+='<div class="msg user">'+msg+'</div>'; i.value='';
  c.innerHTML+='<div class="msg ai" id="tmp">Soch raha hu...</div>'; c.scrollTop=c.scrollHeight;
  const res=await fetch('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg,key})});
  const data=await res.json();
  document.getElementById('tmp').id=''; document.getElementById('tmp')?.remove();
  c.lastChild.textContent=''; // fix
  c.innerHTML=c.innerHTML.replace('Soch raha hu...',data.ans);
  c.innerHTML+='<div class="msg ai">'+data.ans+'</div>'; c.scrollTop=c.scrollHeight;
}
</script></body></html>
`,{headers:{"Content-Type":"text/html"}});
});
