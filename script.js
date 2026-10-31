// DEMO ONLY: sample data + localStorage. Production needs real auth, payments and a database.
const CATS=[["Electronics & Gadgets","📱"],["Fashion & Accessories","👗"],["Books & Study Materials","📚"],["Home & Furniture","🛋️"],["Food & Beverages","🍱"],["Vehicles & Accessories","🏍️"],["Property & Room Rental","🏠"],["Sports & Recreation","⚽"],["Beauty & Personal Care","💄"],["Services & Part-Time Jobs","🧰"]];
const LOC={inasis:"Inside Campus – INASIS",taman:"Outside Campus – Taman Universiti"};
const ICON=Object.fromEntries(CATS.map(c=>[c[0],svgArt(c[0])]));
const d=n=>new Date(Date.now()-n*864e5).toISOString().slice(0,10);
const SEED=[
["iPhone 13",1450,"Electronics & Gadgets","Used","Aiman R.","Student","inasis",1,"128GB, battery health 89%, with box and charger."],
["Acer Aspire 5",1890,"Electronics & Gadgets","Used","Dr. Salmah","Staff","taman",2,"i5, 8GB RAM, 512GB SSD. Great for coding and assignments."],
["Scientific Calculator",45,"Books & Study Materials","Used","Nurul A.","Student","inasis",1,"Casio fx-570, works perfectly."],
["Study Desk",120,"Home & Furniture","Used","Farhan K.","Student","inasis",3,"Sturdy desk with drawer. Self-collect."],
["Accounting Textbook",35,"Books & Study Materials","Used","Siti H.","Student","inasis",2,"Latest edition, light highlighting only."],
["Gaming Headset",80,"Electronics & Gadgets","New","Hafiz M.","Student","taman",4,"7.1 surround, RGB, still sealed."],
["Mini Refrigerator",250,"Home & Furniture","Used","En. Zulkifli","Staff","taman",5,"90L, cold and quiet, 1 year old."],
["Single Room Rental",350,"Property & Room Rental","New","Pn. Rohana","Staff","taman",1,"Fully furnished, near bus stop. Utilities included."]
].map((a,i)=>({id:i+1,title:a[0],price:a[1],cat:a[2],cond:a[3],seller:a[4],stype:a[5],loc:a[6],date:d(a[7]),desc:a[8],phone:"60123456789",status:i==7?"Pending":"Approved",img:null}));
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const EX=[["Denim Jacket",60,"Fashion & Accessories","Used","Balqis N.","Student","inasis",2,"Size M, barely worn."],["Baju Kurung Set",75,"Fashion & Accessories","New","Pn. Aishah","Staff","taman",3,"Size L, cotton, with tag."],["Badminton Racket",90,"Sports & Recreation","Used","Danial S.","Student","inasis",4,"Yonex, with cover and 2 grips."],["Rice Cooker",55,"Home & Furniture","Used","Wani A.","Student","inasis",1,"1.8L, works well."],["Bookshelf",85,"Home & Furniture","Used","Hakimi Z.","Student","taman",6,"4-tier, easy to dismantle."],["Programming Textbook",40,"Books & Study Materials","Used","Irfan L.","Student","inasis",2,"Java and data structures."],["Wireless Mouse",25,"Electronics & Gadgets","New","Syafiq O.","Student","inasis",1,"Silent click, USB receiver."],["Smart Watch",220,"Electronics & Gadgets","Used","Dr. Hamid","Staff","taman",5,"Heart rate and GPS, 1 year old."],["Mountain Bike",380,"Vehicles & Accessories","Used","En. Roslan","Staff","taman",7,"21-speed, new tyres."]];
SEED.push(...EX.map((a,i)=>({id:i+9,title:a[0],price:a[1],cat:a[2],cond:a[3],seller:a[4],stype:a[5],loc:a[6],date:d(a[7]),desc:a[8],phone:"60123456789",status:"Approved",img:null})));
SEED.forEach(i=>i.feat=[1,2,7,9,14].includes(i.id));
// DEMO ONLY: plain-text passwords in localStorage. Production needs server-side auth.
const SEEDU=[{email:"admin@uum.edu.my",pw:"admin123",name:"Admin",type:"Staff",role:"admin",phone:"",status:"Active"},{email:"aina@student.uum.edu.my",pw:"demo123",name:"Aina Hakim",type:"Student",phone:"60123456789",status:"Active"},{email:"salmah@uum.edu.my",pw:"demo123",name:"Dr. Salmah",type:"Staff",phone:"60123456780",status:"Active"},{email:"aiman@student.uum.edu.my",pw:"demo123",name:"Aiman R.",type:"Student",phone:"60123456781",status:"Active"}];
let users=get("uc_users",SEEDU),msgs=get("uc_msgs",[]),notes=get("uc_notes",[]),sess=get("uc_sess",null);
const me=()=>users.find(u=>u.email===sess)||null;
const suspended=i=>{const u=users.find(x=>x.email===i.owner);return !!u&&u.status!=="Active"};
let items=get("uc_items3",SEED),favs=get("uc_favs",[]),reports=get("uc_reports",[{id:3,reason:"Price looks suspicious"}]);
let S={q:"",cat:"",loc:"all",sort:"new"};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const save=()=>{set("uc_items3",items);set("uc_favs",favs);set("uc_reports",reports)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}
function show(v){$$(".view").forEach(s=>s.hidden=s.id!==v);scrollTo(0,0);
 if(v==="browse")renderBrowse();if(v==="favs")renderFavs();if(v==="account")renderAccount();if(v==="admin")renderAdmin("overview")}
function card(i){const on=favs.includes(i.id);
 return `<article class="card"><div class="ph">${i.img?`<img src="${i.img}" alt="">`:ICON[i.cat]||"📦"}<button class="fav ${on?"on":""}" data-fav="${i.id}" aria-label="Favourite">♥</button></div>
 <div class="cb"><b>${esc(i.title)}</b><span class="price">RM${i.price.toLocaleString()}</span>
 <span><span class="tag">${i.cond}</span><span class="tag ${i.loc=="taman"?"out":""}">${LOC[i.loc]}</span></span>
 <small>${esc(i.seller)} (${i.stype}) · ${i.date}</small><button data-view-item="${i.id}">View Details</button></div></article>`}
const live=()=>items.filter(i=>i.status==="Approved"&&!suspended(i));
function filtered(){let r=live().filter(i=>(S.loc==="all"||i.loc===S.loc)&&(!S.cat||i.cat===S.cat)&&i.title.toLowerCase().includes(S.q.toLowerCase()));
 return r.sort((a,b)=>S.sort=="low"?a.price-b.price:S.sort=="high"?b.price-a.price:b.date.localeCompare(a.date)||b.id-a.id)}
function renderHome(){$("#cats").innerHTML=CATS.map(c=>`<a class="cat" data-cat="${c[0]}"><i>${c[1]}</i><b>${c[0]}</b><br><small>Explore More</small></a>`).join("");
 const l=live().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);$("#latest").innerHTML=l.map(card).join("");
 $("#deals").innerHTML=live().filter(i=>i.price<=100).map(card).join("")}
function renderBrowse(){const r=filtered();$("#results").innerHTML=r.map(card).join("")||"<p>No listings match. Try clearing filters.</p>";
 $("#count").textContent=`${r.length} listing(s)`+(S.loc!=="all"?` · ${LOC[S.loc]}`:"")+(S.cat?` · ${S.cat}`:"");
 $("#browseT").textContent=S.q?`Results for “${S.q}”`:"All listings";$("#sort").value=S.sort;$("#locSel").value=S.loc;$("#catSel").value=S.cat}
function renderFavs(){$("#favGrid").innerHTML=items.filter(i=>favs.includes(i.id)).map(card).join("")||"<p>No favourites yet. Tap ♥ on a listing to save it.</p>"}
function renderAccount(){const m=items.filter(i=>i.mine);const c=s=>m.filter(i=>i.status===s).length;
 $("#myStats").innerHTML=[["My listings",m.length],["Active",c("Approved")],["Pending",c("Pending")],["Sold",c("Sold")],["Favourites",favs.length]].map(x=>`<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("");
 $("#myList").innerHTML=m.length?`<table><tr><th>Title</th><th>Price</th><th>Location</th><th>Status</th><th></th></tr>${m.map(i=>`<tr><td>${esc(i.title)}</td><td>RM${i.price}</td><td>${LOC[i.loc]}</td><td><span class="badge ${i.status}">${i.status}</span></td><td>${i.status==="Approved"?`<button data-sold="${i.id}">Mark sold</button>`:""}<button class="bad" data-del="${i.id}">Delete</button></td></tr>`).join("")}</table>`:"<p style='padding:14px'>You have no listings yet. Use Sell Now to add one.</p>"}
function renderAdmin(tab){$$("[data-tab]").forEach(a=>a.classList.toggle("on",a.dataset.tab===tab));const B=$("#admBody");const n=s=>items.filter(i=>i.status===s).length;
 const row=i=>`<tr data-s="${i.status}"><td>${esc(i.title)}</td><td>RM${i.price}</td><td>${LOC[i.loc]||"⚠ Invalid"}</td><td><span class="badge ${i.status}">${i.status}</span></td><td>${i.status!=="Approved"?`<button data-ap="${i.id}">Approve</button>`:""}${i.status!=="Rejected"?`<button class="bad" data-rj="${i.id}">Reject</button>`:""}<button class="bad" data-del="${i.id}">Remove</button></td></tr>`;
 const tbl=a=>`<div class="table"><table><tr><th>Title</th><th>Price</th><th>Location</th><th>Status</th><th>Actions</th></tr>${a.map(row).join("")}</table></div>`;
 if(tab==="overview")B.innerHTML=`<h2>Overview</h2><div class="stats">${[["Registered users",users.filter(u=>u.role!=="admin").length],["Active listings",n("Approved")],["Pending",n("Pending")],["Approved",n("Approved")],["Rejected",n("Rejected")],["Reported",reports.length],["Sold",n("Sold")]].map(x=>`<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("")}</div><h3>Awaiting approval</h3>${tbl(items.filter(i=>i.status==="Pending"))}`;
 if(tab==="products")B.innerHTML=`<h2>All listings</h2><div class="filters"><input id="aq" placeholder="Search listings…"><select id="af"><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option><option>Sold</option></select></div>${tbl(items)}`;
 if(tab==="users")usersTab(B);
 if(tab==="locations")B.innerHTML=`<h2>Locations</h2><div class="stats">${Object.keys(LOC).map(k=>`<div class="stat"><b>${items.filter(i=>i.loc===k).length}</b>${LOC[k]}</div>`).join("")}<div class="stat"><b>${items.filter(i=>!LOC[i.loc]).length}</b>Unauthorised locations</div></div>`;
 if(tab==="reports")B.innerHTML=`<h2>Reported listings</h2>${reports.length?tbl(reports.map(r=>items.find(i=>i.id===r.id)).filter(Boolean)):"<p>No reports.</p>"}`}
document.addEventListener("click",e=>{const t=e.target.closest("[data-view],[data-cat],[data-loc],[data-fav],[data-view-item],[data-report],[data-ap],[data-rj],[data-del],[data-sold],[data-tab],[data-toast]");if(!t)return;
 const D=t.dataset;if(D.view){e.preventDefault();if(D.view==="browse"){S={q:"",cat:"",loc:"all",sort:"new"}}show(D.view)}
 else if(D.cat!==undefined){e.preventDefault();S.cat=D.cat;show("browse")}
 else if(D.loc){S.loc=D.loc;S.cat="";S.q="";show("browse")}
 else if(D.fav){const id=+D.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save();$("#favN").textContent=favs.length;
  $$(`[data-fav="${id}"]`).forEach(b=>b.classList.toggle("on",favs.includes(id)));toast(favs.includes(id)?"Saved to favourites":"Removed from favourites");if(!$("#favs").hidden)renderFavs()}
 else if(D.viewItem)openItem(D.viewItem)
 else if(D.report){reports.push({id:+D.report,reason:"User report"});save();toast("Report sent to admin")}
 else if(D.ap||D.rj||D.sold||D.del){const id=+(D.ap||D.rj||D.sold||D.del);const i=items.find(x=>x.id===id);
  if(D.ap)i.status="Approved";if(D.rj)i.status="Rejected";if(D.sold)i.status="Sold";if(D.del)items=items.filter(x=>x.id!==id);
  save();renderHome();$("#admin").hidden?renderAccount():renderAdmin($("[data-tab].on").dataset.tab);toast("Updated")}
 else if(D.tab)renderAdmin(D.tab);else if(D.toast)toast(D.toast)});
$("#closeM").onclick=()=>$("#modal").hidden=true;$("#modal").onclick=e=>{if(e.target.id==="modal")e.target.hidden=true};
const doSearch=v=>{S.q=v;show("browse")};
$("#goSearch").onclick=()=>doSearch($("#q").value);$("#goSearch2").onclick=()=>doSearch($("#q2").value);
$("#q").onkeydown=e=>e.key==="Enter"&&doSearch(e.target.value);$("#q2").onkeydown=e=>e.key==="Enter"&&doSearch(e.target.value);
$("#catSel").onchange=e=>{S.cat=e.target.value;show("browse")};$("#locSel").onchange=e=>{S.loc=e.target.value;show("browse")};
$("#sort").onchange=e=>{S.sort=e.target.value;renderBrowse()};$("#clear").onclick=()=>{S={q:"",cat:"",loc:"all",sort:"new"};$("#q").value="";renderBrowse()};
$("#sellForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);if(!LOC[f.get("loc")])return toast("Choose INASIS or Taman Universiti");
 const file=f.get("img");const fin=img=>{items.unshift({id:Date.now(),title:f.get("title"),cat:f.get("cat"),price:+f.get("price"),cond:f.get("cond"),desc:f.get("desc"),seller:f.get("seller"),phone:f.get("phone"),stype:f.get("stype"),loc:f.get("loc"),date:d(0),status:"Pending",mine:true,img});
  save();e.target.reset();toast("Submitted. Status: Pending Approval");show("account")};
 if(file&&file.size&&file.size<4e5){const r=new FileReader();r.onload=()=>fin(r.result);r.readAsDataURL(file)}else fin(null)};
/* ===== Round 2: SVG art, detail page, sliders, demo auth, messaging, edit, admin controls ===== */
function svgArt(cat,v=0){const P=["#00529B","#003366","#1d6fb8","#0b3d73","#2a7fd0"];const k=Math.max(0,CATS.findIndex(c=>c[0]===cat));const e=CATS[k][1];const id=`g${k}${v}`;
 return `<svg viewBox="0 0 200 130" role="img" aria-label="${cat}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P[(k+v)%5]}"/><stop offset="1" stop-color="#F5C400" stop-opacity=".6"/></linearGradient></defs><rect width="200" height="130" fill="url(#${id})"/><circle cx="${40+v*50}" cy="30" r="46" fill="#fff" opacity=".12"/><circle cx="170" cy="${110-v*20}" r="38" fill="#fff" opacity=".1"/><rect x="62" y="22" width="76" height="76" rx="18" fill="#fff" opacity=".92"/><text x="100" y="78" font-size="46" text-anchor="middle">${e}</text></svg>`}
let authAfter=null,curThread=null,cd=null;
const save2=()=>{set("uc_users",users);set("uc_msgs",msgs);set("uc_notes",notes);set("uc_sess",sess)};
const note=(u,text)=>{notes.push({u,text,ts:Date.now(),read:false});save2()};
function updateBadge(){const u=me();$("#noteN").textContent=u?notes.filter(n=>n.u===u.email&&!n.read).length:0}
function updateAuthUI(){const u=me();$("#authBtn").textContent=u?`Logout (${u.name.split(" ")[0]})`:"Login / Register";updateBadge()}
const slider=(t,l)=>l.length?`<h2>${t}</h2><div class="slider">${l.map(card).join("")}</div>`:"";
function renderHome(){$("#cats").innerHTML=CATS.map(c=>`<a class="cat" data-cat="${c[0]}"><i>${ICON[c[0]]}</i><b>${c[0]}</b><br><small>Explore More</small></a>`).join("");
 const L=live(),by=c=>L.filter(i=>i.cat===c);
 $("#latest").innerHTML=[...L].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,8).map(card).join("");
 const fc=items.filter(i=>favs.includes(i.id)).map(i=>i.cat);
 $("#sliders").innerHTML=slider("Featured listings",L.filter(i=>i.feat))+slider("Best deals",L.filter(i=>i.price<=100))+slider("Recommended for you",L.filter(i=>fc.length?fc.includes(i.cat):i.id%3==0))+slider("Popular electronics",by("Electronics & Gadgets"))+slider("Books & study materials",by("Books & Study Materials"))+slider("Fashion & lifestyle",by("Fashion & Accessories"))+slider("Home & living",by("Home & Furniture"))}
function openItem(id){const i=items.find(x=>x.id==id);cd=i;const im=v=>i.imgs&&i.imgs[v]?`<img src="${i.imgs[v]}" alt="">`:svgArt(i.cat,v);
 const sim=live().filter(x=>x.cat===i.cat&&x.id!==i.id).slice(0,6);
 $("#detail").innerHTML=`<p><a href="#" data-view="browse">← Back to listings</a></p><div class="dgrid"><div><div class="mainimg" id="mainimg">${im(0)}</div><div class="gal">${[0,1,2].map(v=>`<div data-thumb="${v}">${im(v)}</div>`).join("")}</div></div>
 <div><h2 style="margin-top:0">${esc(i.title)}</h2><p class="price">RM${i.price.toLocaleString()}</p><p>${esc(i.desc)}</p><p><span class="tag">${i.cond}</span><span class="tag">${i.cat}</span></p>
 <p><b>Seller:</b> ${esc(i.seller)} (${i.stype})<br><b>Meet at:</b> ${LOC[i.loc]}<br><b>Posted:</b> ${i.date}</p>
 <p><button class="gold" data-contact="${i.id}">Contact on WhatsApp</button> <button class="gold" data-msg="${i.id}">Message Seller</button></p>
 <p><button data-fav="${i.id}" class="ghost dark">♥ Add to Favourites</button> <button data-report="${i.id}" class="ghost dark">Report Listing</button></p><small>Browsing is open to everyone. Register to contact sellers or sell.</small></div></div>${slider("Similar listings",sim)}`;show("detail")}
function authModal(mode,msg,after){authAfter=after||null;const r=mode==="register";
 $("#mBody").innerHTML=`<h2 style="margin-top:0">${r?"Create your account":"Log in"}</h2>${msg?`<p>${msg}</p>`:""}<form id="authF" class="form" style="grid-template-columns:1fr;padding:0">
 ${r?'<label>Full name<input name="name" required></label>':""}<label>UUM email<input name="email" type="email" required placeholder="name@student.uum.edu.my"></label><label>Password<input name="pw" type="password" minlength="6" required></label>
 ${r?'<label>I am a<select name="type"><option>Student</option><option>Staff</option></select></label><label>WhatsApp number<input name="phone" type="tel" placeholder="60123456789" required></label>':""}
 <button class="gold">${r?"Register":"Log in"}</button></form><p>${r?'Already registered? <a href="#" data-auth="login"><b>Log in</b></a>':'New to UUM Connect? <a href="#" data-auth="register"><b>Register</b></a>'}<br><small>Demo only: accounts live in this browser, not on a server. Try aina@student.uum.edu.my / demo123, or admin@uum.edu.my / admin123.</small></p>`;
 $("#modal").hidden=false;
 $("#authF").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));f.email=f.email.trim().toLowerCase();
  if(!/@(student\.)?uum\.edu\.my$/.test(f.email))return toast("Use your UUM email (…@uum.edu.my or …@student.uum.edu.my)");
  let u=users.find(x=>x.email===f.email);
  if(r){if(u)return toast("This email is already registered. Please log in.");u={email:f.email,pw:f.pw,name:f.name,type:f.type,phone:f.phone,status:"Active"};users.push(u);note(u.email,"Welcome to UUM Connect! You can now buy and sell within the UUM community.")}
  else{if(!u||u.pw!==f.pw)return toast("Email or password is incorrect");if(u.status!=="Active")return toast("This account is suspended. Contact the administrator.")}
  sess=u.email;save2();$("#modal").hidden=true;updateAuthUI();toast(`Welcome, ${u.name.split(" ")[0]}`);const a=authAfter;authAfter=null;a&&a()}}
const _s=show;show=function(v){const u=me();
 if(["sell","account","messages"].includes(v)&&!u)return authModal("login",v==="sell"?"Log in or register to sell items.":"Log in or register to continue.",()=>show(v));
 if(v==="admin"&&(!u||u.role!=="admin"))return authModal("login","Admin area. Log in with an administrator account (demo: admin@uum.edu.my / admin123).",()=>me().role==="admin"?show("admin"):toast("Administrators only"));
 _s(v);if(v==="messages")renderMsgs();if(v==="sell"&&u){const F=$("#sellForm").elements;F.seller.value=u.name;F.phone.value=u.phone||"";F.stype.value=u.type}};
function renderAccount(){const u=me();const m=items.filter(i=>i.owner===u.email),c=s=>m.filter(i=>i.status===s).length;
 $("#prof").innerHTML=`<div class="av">${esc(u.name.split(" ").map(w=>w[0]).join("").slice(0,2))}</div><div><b>${esc(u.name)}</b><br>${u.type} · ${esc(u.email)}<br>${esc(u.phone||"")}</div><span class="sp"></span><button class="ghost dark" data-editprofile>Edit Profile</button><button class="ghost dark" data-logout>Logout</button>`;
 $("#myStats").innerHTML=[["My listings",m.length],["Active",c("Approved")],["Pending",c("Pending")],["Sold",c("Sold")],["Favourites",favs.length]].map(x=>`<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("");
 $("#myList").innerHTML=m.length?`<table><tr><th>Title</th><th>Price</th><th>Location</th><th>Status</th><th></th></tr>${m.map(i=>`<tr><td>${esc(i.title)}</td><td>RM${i.price}</td><td>${LOC[i.loc]}</td><td><span class="badge ${i.status}">${i.status}</span></td><td><button data-edit="${i.id}">Edit</button>${i.status==="Approved"?`<button data-sold="${i.id}">Mark sold</button>`:""}<button class="bad" data-del="${i.id}">Delete</button></td></tr>`).join("")}</table>`:"<p style='padding:14px'>You have no listings yet. Use Sell Now to add one.</p>"}
function renderMsgs(){const u=me();const mine=msgs.filter(m=>m.u===u.email);const ids=[...new Set(mine.map(m=>m.item))];if(curThread&&!ids.includes(curThread))ids.unshift(curThread);if(!ids.includes(curThread))curThread=ids[0];
 const my=notes.filter(n=>n.u===u.email).sort((a,b)=>b.ts-a.ts);
 $("#messages").innerHTML=`<h2>Messages</h2><div class="mbox"><div class="threads">${ids.map(id=>{const it=items.find(x=>x.id===id);return `<a href="#" data-thread="${id}" class="${id===curThread?"on":""}"><b>${esc(it?it.title:"Listing")}</b><br><small>${esc(it?it.seller:"")}</small></a>`}).join("")||"<p>No conversations yet. Open a listing and choose Message Seller.</p>"}</div>
 <div class="thread">${curThread?mine.filter(m=>m.item===curThread).map(m=>`<div class="bub ${m.from==="me"?"me":""}">${esc(m.text)}</div>`).join("")+`<form id="msgF"><input name="t" required placeholder="Type a message…"><button class="gold">Send</button></form>`:""}</div></div>
 <h2>Notifications</h2><ul class="notes">${my.map(n=>`<li>${esc(n.text)}<br><small>${new Date(n.ts).toLocaleString()}</small></li>`).join("")||"<li>No notifications yet.</li>"}</ul>`;
 my.forEach(n=>n.read=true);save2();updateBadge();const F=$("#msgF");
 if(F)F.onsubmit=e=>{e.preventDefault();const t=F.t.value.trim();if(!t)return;const it=items.find(x=>x.id===curThread),id=curThread;msgs.push({u:u.email,item:id,from:"me",text:t,ts:Date.now()});save2();renderMsgs();
  setTimeout(()=>{msgs.push({u:u.email,item:id,from:"them",text:"Hi! Yes, it's still available. When can we meet?",ts:Date.now()});note(u.email,`New reply from ${it?it.seller:"seller"} about “${it?it.title:"a listing"}”.`);if(!$("#messages").hidden)renderMsgs()},1500)}}
function editItem(id){const i=items.find(x=>x.id==id);const o=(a,s)=>a.map(x=>`<option ${x===s?"selected":""}>${x}</option>`).join("");
 $("#mBody").innerHTML=`<h2 style="margin-top:0">Edit listing</h2><form id="editF" class="form" style="padding:0"><label class="full">Title<input name="title" value="${esc(i.title)}" required></label><label>Price (RM)<input name="price" type="number" min="1" value="${i.price}" required></label><label>Condition<select name="cond">${o(["New","Used"],i.cond)}</select></label><label>Category<select name="cat">${o(CATS.map(c=>c[0]),i.cat)}</select></label><label>Location<select name="loc">${Object.entries(LOC).map(([k,v])=>`<option value="${k}" ${k===i.loc?"selected":""}>${v}</option>`).join("")}</select></label><label class="full">Description<textarea name="desc" rows="3">${esc(i.desc)}</textarea></label><button class="gold full">Save changes</button></form>`;$("#modal").hidden=false;
 $("#editF").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));Object.assign(i,f,{price:+f.price});save();$("#modal").hidden=true;renderAccount();renderHome();toast("Listing updated")}}
function editProfile(){const u=me();$("#mBody").innerHTML=`<h2 style="margin-top:0">Edit profile</h2><form id="profF" class="form" style="padding:0"><label class="full">Full name<input name="name" value="${esc(u.name)}" required></label><label>WhatsApp number<input name="phone" value="${esc(u.phone||"")}" required></label><label>I am a<select name="type"><option ${u.type==="Student"?"selected":""}>Student</option><option ${u.type==="Staff"?"selected":""}>Staff</option></select></label><button class="gold full">Save changes</button></form>`;$("#modal").hidden=false;
 $("#profF").onsubmit=e=>{e.preventDefault();Object.assign(u,Object.fromEntries(new FormData(e.target)));save2();$("#modal").hidden=true;renderAccount();updateAuthUI();toast("Profile updated")}}
function usersTab(B){const l=users.filter(u=>u.role!=="admin");B.innerHTML=`<h2>Users</h2><div class="filters"><input id="aq" placeholder="Search name or email…"><select id="af"><option value="">All types</option><option>Student</option><option>Staff</option></select></div><div class="table"><table><tr><th>Name</th><th>Email</th><th>Type</th><th>Status</th><th></th></tr>${l.map(u=>`<tr data-t="${u.type}"><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${u.type}</td><td><span class="badge ${u.status==="Active"?"Approved":"Rejected"}">${u.status}</span></td><td><button data-uinfo="${esc(u.email)}">View</button><button class="bad" data-susp="${esc(u.email)}">${u.status==="Active"?"Suspend":"Activate"}</button></td></tr>`).join("")}</table></div>`}
function adminFilter(){const q=$("#aq"),f=$("#af");if(!q)return;const run=()=>$$("#admBody tr[data-s],#admBody tr[data-t]").forEach(r=>{r.hidden=!(r.textContent.toLowerCase().includes(q.value.toLowerCase())&&(!f.value||(r.dataset.s||r.dataset.t)===f.value))});q.oninput=run;f.onchange=run}
const _ra=renderAdmin;renderAdmin=function(t){_ra(t);adminFilter()};
$("#sellForm").onsubmit=async e=>{e.preventDefault();const u=me();if(!u)return authModal("login","Log in to submit a listing.");const f=new FormData(e.target);if(!LOC[f.get("loc")])return toast("Choose INASIS or Taman Universiti");
 const files=[...e.target.elements.img.files].slice(0,3).filter(x=>x.size<4e5);
 const imgs=await Promise.all(files.map(x=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(x)})));
 items.unshift({id:Date.now(),title:f.get("title"),cat:f.get("cat"),price:+f.get("price"),cond:f.get("cond"),desc:f.get("desc"),seller:f.get("seller"),phone:f.get("phone"),stype:f.get("stype"),loc:f.get("loc"),date:d(0),status:"Pending",owner:u.email,imgs,img:imgs[0]||null});
 save();e.target.reset();toast("Submitted. Status: Pending Approval");show("account")};
document.addEventListener("click",e=>{const t=e.target.closest("[data-auth],[data-thumb],[data-contact],[data-msg],[data-edit],[data-editprofile],[data-logout],[data-thread],[data-susp],[data-uinfo],[data-ap],[data-rj]");if(!t)return;const D=t.dataset;
 if(D.auth!==undefined){e.preventDefault();authModal(D.auth)}
 else if(D.thumb!==undefined)$("#mainimg").innerHTML=t.innerHTML;
 else if(D.contact){const i=items.find(x=>x.id==D.contact);const go=()=>window.open(`https://wa.me/${i.phone}?text=${encodeURIComponent("Hi, is '"+i.title+"' still available on UUM Connect?")}`,"_blank","noopener");me()?go():authModal("register","Register to contact sellers.",go)}
 else if(D.msg){const id=+D.msg;const go=()=>{curThread=id;show("messages")};me()?go():authModal("register","Register to message sellers.",go)}
 else if(D.edit)editItem(D.edit);else if(D.editprofile!==undefined)editProfile();else if(D.logout!==undefined)$("#authBtn").click();
 else if(D.thread){e.preventDefault();curThread=+D.thread;renderMsgs()}
 else if(D.susp){const u=users.find(x=>x.email===D.susp);u.status=u.status==="Active"?"Suspended":"Active";save2();renderAdmin("users");renderHome();toast(`${u.name} is now ${u.status}`)}
 else if(D.uinfo){const u=users.find(x=>x.email===D.uinfo);$("#mBody").innerHTML=`<h2 style="margin-top:0">${esc(u.name)}</h2><p>${u.type} · ${esc(u.email)}<br>WhatsApp: ${esc(u.phone||"-")}<br>Status: ${u.status}<br>Listings: ${items.filter(i=>i.owner===u.email).length}</p>`;$("#modal").hidden=false}
 else if(D.ap||D.rj){const i=items.find(x=>x.id===+(D.ap||D.rj));if(i&&i.owner){note(i.owner,`Your listing “${i.title}” was ${D.ap?"approved":"rejected"} by the administrator.`);updateBadge()}}});
$("#authBtn").onclick=()=>{if(me()){sess=null;save2();updateAuthUI();show("home");toast("Logged out")}else authModal("login")};
$("#catSel").innerHTML='<option value="">All Categories</option>'+CATS.map(c=>`<option>${c[0]}</option>`).join("");
$("#sellCat").innerHTML=CATS.map(c=>`<option>${c[0]}</option>`).join("");
$("#favN").textContent=favs.length;renderHome();updateAuthUI();
