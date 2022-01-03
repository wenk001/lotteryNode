const express = require('express')
const fs = require('fs')
const Path = require("path");
const app = express()
const port = 8888

const saveData = (data,path)=>{
    try{
        fs.writeFileSync(Path.join(__dirname, path),JSON.stringify(data))
    }catch(err){
        console.log(err)
    }
}
const getData = (path)=>{
    try{
        return fs.readFileSync(Path.join(__dirname, path),'utf8')
    }catch(err){
        console.log(err)
        return false
    }
}


app.get('/luckyList', (req, res) => {
  res.send(getData('data/luckyList.json'))
})
app.get('/userList', (req, res) => {
    res.send(getData('data/allList.json'))
  })
  app.get('/win', (req, res) => {
      let luckyList = JSON.parse(getData('data/luckyList.json'))
      let allList = JSON.parse(getData('data/allList.json'))
      if(luckyList.data.findIndex((r)=>{return r.openid === req.query.openid}) === -1){
        let index = allList.data.findIndex((r)=>{return r.openid === req.query.openid})
        luckyList.data.push(Object.assign(allList.data[index],{prizeType: req.query.prizeType}))
        allList.data.splice(index,1)
      }
      saveData(luckyList,'data/luckyList.json')
      saveData(allList,'data/allList.json')
    res.send({"data":{"status": "success"}})
  })
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})