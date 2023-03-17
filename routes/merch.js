import express from "express";

import { 
    getAllMerch,
    createNewMerch,
    updateMerch,
    deleteMerch,
    getOneMerch,
    getCategories
} from "../controllers/merch.js";

const router = express.Router()

router.route('/')
.get(getAllMerch)
.post(createNewMerch)

router.route("/detail/:id")
.patch(updateMerch)
.delete(deleteMerch)
.get(getOneMerch)

router.get('/categories', getCategories)

export default router