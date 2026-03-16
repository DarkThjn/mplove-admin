const SUPABASE_URL = "https://dkmlutpxnikwtzrntmts.supabase.co"
const SUPABASE_KEY = "sb_publishable_bUoFVF3pk_IKgu0R0oweaw_NSdAe6xV"

const db = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
)

const wishlistEl = document.getElementById("wishlist")

let wishlistData = []

/* ---------- WHEEL ---------- */

const canvas = document.getElementById("wheel")
const ctx = canvas.getContext("2d")

let angle = 0
let spinning = false

function drawWheel(){

if(!wishlistData.length) return

const arc = (2*Math.PI)/wishlistData.length

ctx.clearRect(0,0,320,320)

wishlistData.forEach((item,i)=>{

const start = angle + i*arc

ctx.beginPath()
ctx.moveTo(160,160)
ctx.arc(160,160,150,start,start+arc)

ctx.fillStyle = i%2 ? "#ff8fa3" : "#ffd6e0"
ctx.fill()

ctx.save()

ctx.translate(160,160)
ctx.rotate(start + arc/2)

ctx.fillStyle = "#000"
ctx.font = "13px sans-serif"

ctx.fillText(item.gift_name,60,5)

ctx.restore()

})

}

/* ---------- LOAD WISHLIST ---------- */

async function loadWishlist(){

const {data,error} = await db
.from("wishlist")
.select("*")
.order("created_at",{ascending:false})

wishlistData = data || []

renderStats()
renderWishlist()

drawWheel()

}

/* ---------- STATS ---------- */

function renderStats(){

document.getElementById("total").innerText =
wishlistData.length

document.getElementById("high").innerText =
wishlistData.filter(i=>i.priority==="High").length

document.getElementById("medium").innerText =
wishlistData.filter(i=>i.priority==="Medium").length

document.getElementById("low").innerText =
wishlistData.filter(i=>i.priority==="Low").length

}

/* ---------- WISHLIST UI ---------- */

function renderWishlist(){

wishlistEl.innerHTML=""

wishlistData.forEach(item=>{

const card = document.createElement("div")

card.className = "card"

card.innerHTML = `

<div class="title">
${item.gift_name}
</div>

<div class="priority ${item.priority.toLowerCase()}">
${item.priority}
</div>

<a href="${item.link}" target="_blank">
Open Product
</a>

<br>

<button onclick="deleteGift('${item.id}')">
Delete
</button>

<button onclick="togglePurchased('${item.id}',${item.purchased})">
${item.purchased ? "Unmark" : "Purchased"}
</button>

`

wishlistEl.appendChild(card)

})

}

/* ---------- DELETE ---------- */

async function deleteGift(id){

await db
.from("wishlist")
.delete()
.eq("id",id)

loadWishlist()

}

/* ---------- PURCHASED ---------- */

async function togglePurchased(id,current){

await db
.from("wishlist")
.update({
purchased: !current
})
.eq("id",id)

loadWishlist()

}

/* ---------- SPIN WHEEL ---------- */

function spinWheel(){

if(spinning || wishlistData.length===0) return

spinning = true

let spinTime = Math.random()*2000 + 2500
let start = performance.now()

function animate(time){

let progress = time - start

angle += 0.15

drawWheel()

if(progress < spinTime){

requestAnimationFrame(animate)

}else{

spinning = false

const index =
Math.floor(
(wishlistData.length -
((angle%(2*Math.PI))/(2*Math.PI))*wishlistData.length)
% wishlistData.length
)

const gift = wishlistData[index]

document.getElementById("randomResult").innerText =
"🎁 "+gift.gift_name

}

}

requestAnimationFrame(animate)

}

/* ---------- BUTTON ---------- */

document.getElementById("randomBtn")
.onclick = spinWheel

/* ---------- INIT ---------- */

loadWishlist()
