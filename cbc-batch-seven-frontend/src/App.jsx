import { useState } from 'react'
import ProductCard from './components/productCard'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1> Lakshitha</h1>
      <ProductCard name ="Iphone 17pro" price ="$1000" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_kYts_ui77fMeiU2uPuxVZtvFbquo9E6TEQ&s"/>
      <ProductCard name = "MAC Book Pro" price="$1500" image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj5iAUHzgZ8PW4rFhHzlkfkMy6PxPqaG8URA&s"/>
     

      
    </>
  )
}

export default App
