import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve(async (req) => {
  if (req.method === "POST") {
    const { prompt } = await req.json();
    const key = Deno.env.get("GROQ_API_KEY");
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer "+key, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: "You are ThirdEye AI by Ishan, helpful like Meta AI." }, { role: "user", content: prompt }] })
    });
    const j = await r.json();
    return new Response(JSON.stringify({ answer: j.choices?.[0]?.message?.content }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
  return new Response(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><title>ThirdEye AI</title></head><body style="margin:0;background:#000;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;height:100vh"><div style="text-align:center;padding:18px;border-bottom:1px solid #222"><h2 style="margin:0">👁️ ThirdEye AI</h2><p style="opacity:.6;font-size:12px">Jo dikhta nahi, wo dikhata hai - by Ishan</p></div><div id=chat style="flex:1;overflow:auto;padding:16px"></div><div style="display:flex;gap:8px;padding:12px;border-top:1px solid #222"><input id=inp placeholder="Kuch bhi pucho..." style="flex:1;padding:14px;border-radius:12px;border:none;background:#1e1e1e;color:#fff"><button onclick=send() style="padding:14px 20px;border:none;border-radius:12px;background:#7c5cff;color:#fff;font-weight:bold">Send</button></div><script>async function send(){const i=document.getElementById('inp'),c=document.getElementById('chat');if(!i.value)return;c.innerHTML+='<div style="text-align:right;margin:8px"><span style="background:#7c5cff;padding:8px 12px;border-radius:12px;display:inline-block">'+i.value+'</span></div>';const p=i.value;i.value='';c.innerHTML+='<div id=l style="margin:8px;opacity:.5">Soch raha hu...</div>';c.scrollTop=c.scrollHeight;const r=await fetch('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});const d=await r.json();document.getElementById('l').remove();c.innerHTML+='<div style="margin:8px;background:#151515;padding:12px;border-radius:12px;white-space:pre-wrap">'+d.answer+'</div>';c.scrollTop=c.scrollHeight;}</script></body></html>`, { headers: { "Content-Type": "text/html" } });
});
