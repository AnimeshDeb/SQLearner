import express from "express"

const app=express();
app.get("/", (req, res)=>{
  res.send("server running");
});

app.listen(3000)