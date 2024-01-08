
// provider 
//context 
//use krte h uss context ko 

import { ReactNode, createContext, useContext, useState } from "react"
import ShoppingCartItem from "../components/ShoppingCartItem"
import { useLocalStorage } from "../hooks/useLocalStorage"


type ShoppingCartProviderProps={
    children:ReactNode
}

type ShoppingCartProps = {
  cartQuantity:number
  openCart:()=>void
  closeCart:()=>void
  getItemQuantity:(id:number) =>number
  increaseCartQuantity:(id:number)=>void
  decreaseCartQuantity:(id:number)=>void
  removeFromCart:(id:number)=>void
  cartItems:CartItem[]
  isOpen:boolean
}

type CartItem = {
  id:number,
  quantity:number
}
const ShoppingCartContext = createContext({} as ShoppingCartProps)

export function useShoppingCart(){
  return useContext(ShoppingCartContext);
}


export function ShoppingCartProvider ({children}:ShoppingCartProviderProps){
  const[isOpen,setIsOpen] = useState(false)
  const[cartItems,setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])
  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0
  }
  function increaseCartQuantity(id: number) {
    setCartItems(currItems => {
      if (currItems.find(item => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }]
      } else {
        return currItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      }
    })
  }
  function decreaseCartQuantity(id: number) {
    setCartItems(currItems => {
      if (currItems.find(item => item.id === id)?.quantity === 1) {
        return currItems.filter(item => item.id !== id)
      } else {
        return currItems.map(item => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 }
          } else {
            return item
          }
        })
      }
    })
  }
  function removeFromCart(id: number) {
    setCartItems(currItems => {
      return currItems.filter(item => item.id !== id)
    })
  }

  //total in cart
  const cartQuantity = cartItems.reduce((quantity,item)=> item.quantity+quantity,0)

  const openCart = ()=> setIsOpen(true)
  const closeCart = ()=>setIsOpen(false)

  return (
    <ShoppingCartContext.Provider value={{

        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
        isOpen

      }}>
        {children}
        <ShoppingCartItem/>
    </ShoppingCartContext.Provider>
  )
}