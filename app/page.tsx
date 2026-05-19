"use client";

import { useState } from 'react';

const CATEGORIES = [
  "ALL", "RICE DISHES", "SOUPS", "SWALLOW", "PROTEINS", 
  "PASTRIES", "SIDES", "ICE CREAM", "DRINKS"
];

const MENU_DATA = [
  { id: 1, name: "Special Jollof Rice Premium", price: 4500, category: "RICE DISHES", desc: "Smoky party jollof served with fried plantain and salad.", popular: true },
  { id: 2, name: "Fried Rice Deluxe", price: 4500, category: "RICE DISHES", desc: "Classic stir-fried rice loaded with vibrant local vegetables.", popular: false },
  { id: 3, name: "Fisherman Soup", price: 6500, category: "SOUPS", desc: "Rich, fresh seafood broth loaded with local spices and fresh fish.", popular: true },
  { id: 4, name: "Pounded Yam", price: 1500, category: "SWALLOW", desc: "Smooth, fluffy traditional pounded yam, served fresh.", popular: false },
  { id: 5, name: "Eba (Yellow)", price: 1000, category: "SWALLOW", desc: "Perfectly turned garri, light and textured.", popular: false },
  { id: 6, name: "Grilled Quarter Chicken", price: 3500, category: "PROTEINS", desc: "Spiced, tender flame-grilled chicken glazed in local herbs.", popular: true },
  { id: 7, name: "Garnished Shredded Beef", price: 3000, category: "PROTEINS", desc: "Slow-cooked beef strips tossed with bell peppers and onions.", popular: false },
  { id: 8, name: "Signature Meat Pie", price: 1500, category: "PASTRIES", desc: "Flaky golden crust packed with seasoned minced beef.", popular: true },
  { id: 9, name: "Glazed Cinnamon Roll", price: 1800, category: "PASTRIES", desc: "Soft, pillowy pastry topped with a rich vanilla sugar glaze.", popular: false },
  { id: 10, name: "Crispy French Fries", price: 2000, category: "SIDES", desc: "Golden, perfectly salted potato fries served with ketchup.", popular: false },
  { id: 11, name: "Creamy Vanilla Scoop", price: 2500, category: "ICE CREAM", desc: "Premium rich vanilla bean ice cream with chocolate drizzle.", popular: false },
  { id: 12, name: "Chilled Zobo Infusion", price: 1200, category: "DRINKS", desc: "House-brewed hibiscus tea with ginger and pineapple twist.", popular: true }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // The Cart State: Stores { itemId: quantity }
  // Example: { 1: 2, 4: 1 } means two Jollof, one Pounded Yam
  const [cart, setCart] = useState<Record<number, number>>({});

  // Function to handle adding/removing items
  const updateCart = (id: number, delta: number) => {
    setCart((prev) => {
      const currentQuantity = prev[id] || 0;
      const newQuantity = currentQuantity + delta;
      
      // If quantity drops to 0, completely remove it from the cart object
      if (newQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      
      return { ...prev, [id]: newQuantity };
    });
  };

  // 🟢 PASTE THIS MISSING BLOCK RIGHT HERE 🟢
  const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = MENU_DATA.reduce((sum, item) => {
    return sum + (cart[item.id] || 0) * item.price;
  }, 0);

 // The WhatsApp Checkout Engine
  const handleWhatsAppCheckout = () => {
    // Replace this with the restaurant's actual WhatsApp number tomorrow (include 234, no + sign)
    const phoneNumber = "2349061464450"; 

    // Build the opening message
    let message = "Hello *Homes Kitchen*! 👋\n\nI would like to place an order:\n\n";

    // Loop through the cart and add each item to the receipt
    Object.entries(cart).forEach(([itemId, quantity]) => {
      const item = MENU_DATA.find((i) => i.id === parseInt(itemId));
      if (item) {
        const itemTotal = item.price * quantity;
        message += `▪️ ${quantity}x ${item.name} (₦${item.price.toLocaleString()}) = ₦${itemTotal.toLocaleString()}\n`;
      }
    });

    // Add the final total and a closing note
    message += `\n*Total Amount: ₦${totalPrice.toLocaleString()}*\n\n`;
    message += "Please let me know how to make payment and the delivery timeline. Thank you!";

    // Encode the text so it works perfectly in a browser URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp directly
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const filteredMenu = MENU_DATA.filter(item => {
    const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased pb-40">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-[0_0_50px_rgba(0,0,0,0.04)] relative flex flex-col">
        
        {/* Brand Showcase Section */}
        <div className="bg-gradient-to-b from-emerald-950 to-slate-950 text-white px-6 pt-8 pb-24 relative rounded-b-[2.5rem] shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Direct Ordering
              </span>
              <h1 className="text-3xl font-black tracking-tight mt-2 text-white">
                Homes Kitchen
              </h1>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wide text-emerald-100">Until 08:00 PM</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium">Skip the platform fees. Order fresh food directly via WhatsApp.</p>
        </div>

        {/* Floating Search & Navigation Box */}
        <div className="px-4 -mt-16 z-20">
          <div className="bg-white rounded-3xl p-4 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-100">
            <div className="relative flex items-center">
              <svg className="absolute left-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search rice, pastries, swallow..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border border-transparent focus:border-slate-200 placeholder-slate-400"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pt-4 pb-1 scrollbar-none snap-x snap-mandatory">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider whitespace-nowrap transition-all duration-300 snap-center ${
                    activeCategory === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10 scale-105"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Food Grid/List Layout */}
        <section className="px-4 pt-6 pb-12 flex-grow">
          <div className="flex items-center justify-between px-2 mb-4">
            <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase">
              {activeCategory} SELECTION ({filteredMenu.length})
            </h2>
          </div>

          {filteredMenu.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-medium">
              No delicious items match your selection.
            </div>
          ) : (
            <div className="grid gap-3.5">
              {filteredMenu.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 transition-all duration-200 relative overflow-hidden group"
                >
                  {item.popular && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                      POPULAR
                    </div>
                  )}

                  <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">PREVIEW</span>
                  </div>

                  <div className="flex flex-col justify-between py-0.5 flex-grow">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-black text-emerald-600 tracking-tight">
                        ₦{item.price.toLocaleString()}
                      </span>
                      
                      {/* Smart Quantity Toggle Logic */}
                      {cart[item.id] ? (
                        <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-2 h-8 border border-emerald-100">
                          <button 
                            onClick={() => updateCart(item.id, -1)} 
                            className="text-emerald-600 font-bold px-1.5 active:scale-90 text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="text-xs font-black text-emerald-900 w-3 text-center">
                            {cart[item.id]}
                          </span>
                          <button 
                            onClick={() => updateCart(item.id, 1)} 
                            className="text-emerald-600 font-bold px-1.5 active:scale-90 text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => updateCart(item.id, 1)} 
                          className="bg-slate-900 hover:bg-emerald-600 text-white h-8 px-3 rounded-xl flex items-center gap-1 shadow-sm active:scale-95 transition-all text-xs font-bold"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Floating Cart Sheet - Only shows when items are in the cart */}
        {totalItems > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-slate-950 text-white rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-between border border-white/10 backdrop-blur-md bg-slate-950/95">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YOUR CART</p>
                  <p className="text-sm font-black tracking-tight text-white">₦{totalPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <button 
  onClick={handleWhatsAppCheckout}
  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-black text-xs tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all uppercase whitespace-nowrap flex-shrink-0"
>
  Order via WhatsApp
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
</button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}