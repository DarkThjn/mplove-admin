const SUPABASE_URL = "https://dkmlutpxnikwtzrntmts.supabase.co"
const SUPABASE_KEY = "sb_publishable_bUoFVF3pk_IKgu0R0oweaw_NSdAe6xV"

const db = window.supabase.createClient(
"https://dkmlutpxnikwtzrntmts.supabase.co",
"sb_publishable_bUoFVF3pk_IKgu0R0oweaw_NSdAe6xV"
)

const wishlistEl = document.getElementById("wishlist")

let wishlistData = []

async function loadWishlist(){

const {data,error} = await db
.from("wishlist")
.select("*")
.order("created_at",{ascending:false})

wishlistData = data

renderStats()

renderWishlist()

}

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

async function deleteGift(id){

await db
.from("wishlist")
.delete()
.eq("id",id)

loadWishlist()

}

async function togglePurchased(id,current){

await db
.from("wishlist")
.update({
purchased: !current
})
.eq("id",id)

loadWishlist()

}

document.getElementById("randomBtn")
.onclick = randomGift

function randomGift(){

if(wishlistData.length===0) return

const random =
wishlistData[
Math.floor(Math.random()*wishlistData.length)
]

document.getElementById("randomResult")
innerText =
"🎁 "+random.gift_name

}

loadWishlist()
