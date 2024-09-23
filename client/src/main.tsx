import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import { ProductProvider } from './context/ProductContextProvider.tsx'
import { UserProvider } from './context/UserContextProvider.tsx'
import { CartContextProvider } from './context/CartContextProvider.tsx'
import { OrderContextProvider } from './context/OrderContextProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
            <BrowserRouter>
                  <UserProvider>
                        <ProductProvider>
                              <CartContextProvider>
                                    <OrderContextProvider>
                                          <App />
                                    </OrderContextProvider>
                              </CartContextProvider>
                        </ProductProvider>
                  </UserProvider>
            </BrowserRouter>

      </React.StrictMode>
)
