import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
serve(async (req) => {
  if (req.method == "POST") {
    const body = await req.json();
    const key = Deno.env.get("GROQ_API_KEY");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: "You are ThirdEye AI by Ishan. Helpful and smart." }, { role: "user", content: body.prompt }] })
    });
    const data = await res.json();
    const ans = data.choices?.[0]?.message?.content || "Key missing";
    return new Response(JSON.stringify({ answer: ans }), { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
  }
  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>ThirdEye</title></head><body style="margin:0;background:#000;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;height:100vh"><div style="text-align:center;padding:15px;border-bottom:1px solid #333"><h2>ThirdEye AI</h2></div><div id="c" style="flex:1;overflow:auto;padding:15px"></div><div style="display:flex;padding:10px;gap:8px"><input id="i" placeholder="Pucho kuch..." style="flex:1;padding:12px;border-radius:8px;border:0;background:#222;color:#fff"><button onclick="s()" style="padding:12px 18px;background:#7c5cff;border:0;border-radius:8px;color:#fff">Send</button></div><script>async function s(){const i=document.getElementById('i'),c=document.getElementById('c');if(!i.value)return;c.innerHTML+='<div style="text-align:right;margin:6px;color:#8af">'+i.value+'</div>';let p=i.value;i.value='';c.innerHTML+='<div id="l">...</div>';let r=await fetch('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:p})});let d=await r.json();document.getElementById('l').remove();c.innerHTML+='<div style="background:#111;padding:10px;border-radius:8px;margin:6px;white-space:pre-wrap">'+d.answer+'</div>'}</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html" } });
});
