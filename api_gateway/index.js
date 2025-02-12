const express = require("express");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer();
const app = express();

// user-management service
app.use("/user", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3001" });
});

// notification service
app.use("/notification", (req, res) => {
  proxy.web(req, res, { target: "http://localhost:3002" });
});

// authentication service
app.use("/auth",(req,res)=>{
  proxy.web(req,res,{target : "http://localhost:3003"})
})

// initiative service
app.use("/initiative",(req,res) => {
  proxy.web(req,res,{target:"http://localhost:3004"})
})

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
