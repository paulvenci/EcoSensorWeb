// const express = require('express');
const { Router } = require('express');
const router = Router();

router.post("/", (req,res)=>{
    console.log(req);
    res.send("OK")
});

module.exports = router;
