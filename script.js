// DEMO ONLY: sample data + localStorage. Production needs real auth, payments and a database.
const CATS=[["Electronics & Gadgets","📱"],["Fashion & Accessories","👗"],["Books & Study Materials","📚"],["Home & Furniture","🛋️"],["Food & Beverages","🍱"],["Vehicles & Accessories","🏍️"],["Property & Room Rental","🏠"],["Sports & Recreation","⚽"],["Beauty & Personal Care","💄"],["Services & Part-Time Jobs","🧰"]];
const LOC={inasis:"Inside Campus – INASIS",taman:"Outside Campus – Taman Universiti"};
const ICON=Object.fromEntries(CATS);
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
let items=get("uc_items",SEED),favs=get("uc_favs",[]),reports=get("uc_reports",[{id:3,reason:"Price looks suspicious"}]);
let S={q:"",cat:"",loc:"all",sort:"new"};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const save=()=>{set("uc_items",items);set("uc_favs",favs);set("uc_reports",reports)};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function toast(m){const t=$("#toast");t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}
function show(v){$$(".view").forEach(s=>s.hidden=s.id!==v);scrollTo(0,0);
 if(v==="browse")renderBrowse();if(v==="favs")renderFavs();if(v==="account")renderAccount();if(v==="admin")renderAdmin("overview")}
function card(i){const on=favs.includes(i.id);
 return `<article class="card"><div class="ph">${i.img?`<img src="${i.img}" alt="">`:ICON[i.cat]||"📦"}<button class="fav ${on?"on":""}" data-fav="${i.id}" aria-label="Favourite">♥</button></div>
 <div class="cb"><b>${esc(i.title)}</b><span class="price">RM${i.price.toLocaleString()}</span>
 <span><span class="tag">${i.cond}</span><span class="tag ${i.loc=="taman"?"out":""}">${LOC[i.loc]}</span></span>
 <small>${esc(i.seller)} (${i.stype}) · ${i.date}</small><button data-view-item="${i.id}">View Details</button></div></article>`}
const live=()=>items.filter(i=>i.status==="Approved");
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
 const row=i=>`<tr><td>${esc(i.title)}</td><td>RM${i.price}</td><td>${LOC[i.loc]||"⚠ Invalid"}</td><td><span class="badge ${i.status}">${i.status}</span></td><td>${i.status!=="Approved"?`<button data-ap="${i.id}">Approve</button>`:""}${i.status!=="Rejected"?`<button class="bad" data-rj="${i.id}">Reject</button>`:""}<button class="bad" data-del="${i.id}">Remove</button></td></tr>`;
 const tbl=a=>`<div class="table"><table><tr><th>Title</th><th>Price</th><th>Location</th><th>Status</th><th>Actions</th></tr>${a.map(row).join("")}</table></div>`;
 if(tab==="overview")B.innerHTML=`<h2>Overview</h2><div class="stats">${[["Registered users",128],["Active listings",n("Approved")],["Pending",n("Pending")],["Approved",n("Approved")],["Rejected",n("Rejected")],["Reported",reports.length],["Sold",n("Sold")]].map(x=>`<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("")}</div><h3>Awaiting approval</h3>${tbl(items.filter(i=>i.status==="Pending"))}`;
 if(tab==="products")B.innerHTML=`<h2>All listings</h2><input id="aq" placeholder="Search listings…">${tbl(items)}`;
 if(tab==="users")B.innerHTML=`<h2>Users</h2><div class="table"><table><tr><th>Name</th><th>Type</th><th>Status</th><th></th></tr>${[["Aina Hakim","Student"],["Aiman R.","Student"],["Dr. Salmah","Staff"],["En. Zulkifli","Staff"]].map(u=>`<tr><td>${u[0]}</td><td>${u[1]}</td><td><span class="badge Approved">Active</span></td><td><button class="bad" data-toast="Demo: account suspended">Suspend</button></td></tr>`).join("")}</table></div>`;
 if(tab==="locations")B.innerHTML=`<h2>Locations</h2><div class="stats">${Object.keys(LOC).map(k=>`<div class="stat"><b>${items.filter(i=>i.loc===k).length}</b>${LOC[k]}</div>`).join("")}<div class="stat"><b>${items.filter(i=>!LOC[i.loc]).length}</b>Unauthorised locations</div></div>`;
 if(tab==="reports")B.innerHTML=`<h2>Reported listings</h2>${reports.length?tbl(reports.map(r=>items.find(i=>i.id===r.id)).filter(Boolean)):"<p>No reports.</p>"}`}
function openItem(id){const i=items.find(x=>x.id==id);const wa=`https://wa.me/${i.phone}?text=${encodeURIComponent("Hi, is '"+i.title+"' still available on UUM Connect?")}`;
 $("#mBody").innerHTML=`<h2 style="margin-top:0">${esc(i.title)}</h2><div class="gal">${[0,1,2].map(()=>`<div>${i.img?`<img src="${i.img}" style="max-width:100%;max-height:100%">`:ICON[i.cat]}</div>`).join("")}</div>
 <p class="price">RM${i.price.toLocaleString()}</p><p>${esc(i.desc)}</p>
 <p><span class="tag">${i.cond}</span><span class="tag">${i.cat}</span></p>
 <p><b>Seller:</b> ${esc(i.seller)} (${i.stype})<br><b>Meet at:</b> ${LOC[i.loc]}<br><b>Posted:</b> ${i.date}</p>
 <p><a class="gold" style="display:inline-block;padding:10px 18px;border-radius:10px" href="${wa}" target="_blank" rel="noopener">Contact Seller on WhatsApp</a>
 <button data-fav="${i.id}" class="ghost dark">Add to Favourites</button> <button data-report="${i.id}" class="ghost dark">Report Listing</button></p>`;$("#modal").hidden=false}
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
$("#catSel").innerHTML='<option value="">All Categories</option>'+CATS.map(c=>`<option>${c[0]}</option>`).join("");
$("#sellCat").innerHTML=CATS.map(c=>`<option>${c[0]}</option>`).join("");
$("#favN").textContent=favs.length;renderHome();
