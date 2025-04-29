"use strict";(()=>{var e={};e.id=764,e.ids=[764],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},1721:e=>{e.exports=import("@upstash/redis")},6326:e=>{e.exports=import("resend")},9926:e=>{e.exports=import("zod")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,s){return s in t?t[s]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,s)):"function"==typeof t&&"default"===s?t:void 0}}})},8470:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{config:()=>c,default:()=>u,routeModule:()=>d});var o=s(1802),a=s(7153),i=s(6249),n=s(5469),l=e([n]);n=(l.then?(await l)():l)[0];let u=(0,i.l)(n,"default"),c=(0,i.l)(n,"config"),d=new o.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/joinWaitlist",pathname:"/api/joinWaitlist",bundlePath:"",filename:""},userland:n});r()}catch(e){r(e)}})},6165:(e,t,s)=>{s.d(t,{V:()=>r});function r({email:e}){return`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to Our Waitlist</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; padding: 20px;">
        <div style="max-width: 560px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 16px;">Welcome to Our Waitlist!</h1>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            Thank you for joining our waitlist. We've received your email address (${e}) and will keep you updated on our progress.
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">
            We're working hard to create something amazing and can't wait to share it with you!
          </p>
          <p style="color: #374151; font-size: 16px; margin-bottom: 8px;">Best regards,</p>
          <p style="color: #111827; font-size: 16px; font-weight: 500;">The Team</p>
        </div>
      </body>
    </html>
  `}},1516:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.d(t,{T:()=>i});var o=s(1721),a=e([o]);let i=new(o=(a.then?(await a)():a)[0]).Redis({url:process.env.UPSTASH_REDIS_REST_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN});r()}catch(e){r(e)}})},5469:(e,t,s)=>{s.a(e,async(e,r)=>{try{s.r(t),s.d(t,{default:()=>u});var o=s(9926),a=s(6326),i=s(1516),n=s(6165),l=e([o,a,i]);[o,a,i]=l.then?(await l)():l;let c=o.z.object({email:o.z.string().email("Invalid email address")});async function u(e,t){if("POST"!==e.method)return t.status(405).json({success:!1,message:"Method not allowed"});try{let{email:s}=e.body;if(!s)return t.status(400).json({success:!1,message:"Email is required"});let r=c.safeParse({email:s});if(!r.success)return t.status(400).json({success:!1,message:r.error.errors[0].message});await i.T.sadd("waitlist_emails",s);let o=new a.Resend(process.env.RESEND_API_KEY),{error:l}=await o.emails.send({from:"Acme <cooperfeatherstonellc@gmail.com>",to:s,subject:"Welcome to Our Waitlist!",html:(0,n.V)({email:s})});if(l)return console.error("Error sending email:",l),t.status(500).json({success:!1,message:"Failed to send email"});return t.status(200).json({success:!0,message:"Successfully joined the waitlist"})}catch(e){return console.error(e),t.status(500).json({success:!1,message:"Internal server error"})}}r()}catch(e){r(e)}})},7153:(e,t)=>{var s;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return s}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(s||(s={}))},1802:(e,t,s)=>{e.exports=s(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var s=t(t.s=8470);module.exports=s})();