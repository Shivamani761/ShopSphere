import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

const money = value => `₹${Number(value).toLocaleString("en-IN")}`;
export default function CartDrawer({ open, onClose, cart, onQuantity, onRemove, account, onSignIn }) {
  if (!open) return null;
  return <div className="cart-backdrop" onMouseDown={onClose}>
    <aside className="cart-drawer" onMouseDown={event=>event.stopPropagation()}>
      <div className="cart-heading"><div><span className="overline">YOUR SELECTION</span><h2>Shopping cart</h2></div><button className="modal-close" onClick={onClose}><X size={19}/></button></div>
      {!account ? <div className="cart-empty"><ShoppingBag size={38}/><h3>Sign in to view your cart</h3><p>Your cart is linked to your account.</p><button className="primary-action" onClick={onSignIn}>Sign in / Create account</button></div>
      : !cart?.items?.length ? <div className="cart-empty"><ShoppingBag size={38}/><h3>Your cart is waiting</h3><p>Add a few things you love and they'll show up here.</p><button className="primary-action" onClick={onClose}>Continue shopping</button></div>
      : <>
        <div className="cart-items">{cart.items.map(item=><article className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} onError={e=>{e.currentTarget.src="https://placehold.co/120x120?text=Product"}}/>
          <div className="cart-item-info"><span>{item.category}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong>
            <div className="quantity-control"><button onClick={()=>onQuantity(item.id,Math.max(1,item.quantity-1))}><Minus size={13}/></button><span>{item.quantity}</span><button onClick={()=>onQuantity(item.id,item.quantity+1)}><Plus size={13}/></button><button className="remove-item" onClick={()=>onRemove(item.id)} aria-label="Remove item"><Trash2 size={14}/></button></div>
          </div>
          <b className="line-total">{money(item.lineTotal)}</b>
        </article>)}</div>
        <div className="cart-summary"><div><span>Subtotal ({cart.itemCount} items)</span><strong>{money(cart.total)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="primary-action" onClick={()=>window.alert("Checkout is a demo feature and is not connected to payments.")}>Continue to checkout</button></div>
      </>}
    </aside>
  </div>;
}
