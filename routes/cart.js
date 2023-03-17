import express from "express"

import {
    addToCart,
    removeFromCart,
    getCartItems
} from "../controllers/cart.js"


const router = express.Router()

router.route('/')
.get(getCartItems)
.post(addToCart)

router.route('/remove')
.delete(removeFromCart)

export default router