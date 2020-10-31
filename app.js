const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const express = require('express');
const fetch = require('node-fetch');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('dotenv').config();


//express config

app.use(express.static('public'));


//ROUTE

app.get('/',(req,res)=>{

      res.sendFile(__dirname + '/index.html');
 })



 

  io.on('connection', (socket) => {
       
      scrapee();
      


  });


  function  scrapee(){ 

    return fetch('https://www.worldometers.info/coronavirus/country/sweden/')
      .then(res => res.text())
      .then(pageBody=>{
          data= pageBody;
          const cheerio = require('cheerio');
          const $ = cheerio.load(data);
          let info ={};
          let totalCases;
          let totalDead;
          let caseIncrease;
          let deathIncrease;
          totalCases=$('.content-inner >:nth-of-type(4)>div>span').text();
          totalDead=$('.content-inner >:nth-of-type(5)>div>span').text();
          totalRecovered=$('.content-inner >:nth-of-type(6)>div>span').text();
          caseIncrease =$('').text();
          deathIncrease =$('').text();
          
          io.emit('message',{cases:totalCases,dead:totalDead,recovered:totalRecovered});
           
        })   


      
         

}




http.listen( process.env.PORT || 3000, function() {
    console.log('listening on 3000');
 });



