const SUPABASE_URL = "YOUR_URL"
const SUPABASE_KEY = "YOUR_KEY"

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

const list = document.getElementById("wishlist")

async function loadWishlist(){

const { data, error } = await supabase
.from("wishlist")
.select("*")
.order("created_at",{ascending:false})

list.innerHTML=""

data.forEach(item => {

const el = document.createElement("div")

el.innerHTML=`

<b>${item.gift_name}</b>

<br>

<a href="${item.link}" target="_blank">Open product</a>

<br>

Priority: ${item.priority}

<br>

<button onclick="deleteGift('${item.id}')">
Delete
</button>

<hr>
`

list.appendChild(el)

})

}

async function deleteGift(id){

await supabase
.from("wishlist")
.delete()
.eq("id",id)

loadWishlist()

}

loadWishlist()