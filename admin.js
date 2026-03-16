const SUPABASE_URL = "YOUR_SUPABASE_URL"
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLIC_KEY"

const supabase = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
)

const wishlistEl = document.getElementById("wishlist")

let wishlistData = []

async function loadWishlist(){

const {data,error} = await supabase
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

<button onclick="togglePurchased('${item.id}')">
Purchased
</button>

`

wishlistEl.appendChild(card)

})

}

async function deleteGift(id){

await supabase
.from("wishlist")
.delete()
.eq("id",id)

loadWishlist()

}

async function togglePurchased(id){

await supabase
.from("wishlist")
.update({
purchased:true
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
