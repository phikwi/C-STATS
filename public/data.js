
let totalCasesP = document.querySelector("#totalCases");
let totalDeathsP = document.querySelector("#totalDeaths") 
let totalRecoveredP = document.querySelector("#totalRecovered")

let dates    = []
let dailyCount =[];
let dailyDeaths =[];    
let intensiveCare =[];
let regions =[];
let regionCases =[];
let  regionDeaths =[];
let  regionIntensive=[];
let ageRange = [];
let  ageTotalCases = [];
let  ageIntensiveCare = [];
let  ageDeaths = [];
let sex=[];
let  sexCases =[];
let  sexIntensiveCare =[];
let sexDeaths =[];
let  totalDeaths =[];
const socket = io();


let regionTable = document.querySelector("#regionTable")
let tbody = document.querySelector("tbody");

let numbers=[];

/*async function contacts(){

    const response =await fetch('contacts.csv');
    const data = await response.text();
    let table = data.split('\n')

    

    for(let i=0; i<table.length;i++){

        const columns = table[i].split(',');
       

        for(let i=0;i<columns.length;i++){
          
            columns[i] =   columns[i].replace(/-/g,"")

            columns[i] =   columns[i].replace(/" "/g,"")
            


            if(columns[i].length ==10 || columns[i].length==12 ||columns[i].length==13 ){
                 
                

                if(!columns[i].includes('* myContacts')){

                    // alphabet letters found
               if (!columns[i].match(/[a-z]/i)) {


                 if(columns[i].length ==10){
                   
                    columns[i] =   columns[i].replace("0","") 
                     columns[i] = "+46" + columns[i]
                    
                     

                 }
              

                  if(columns[i].length<=12 ){

                    numbers.push(columns[i]);
                  }
              

               
            }

                   

                }
               
    
              
            }



        }
        


            

    }

    /*let d =[...numbers]

    socket.emit('msg',{info:d})*/
  
  /*}
  
  contacts()*/
  
  
  
 
socket.on('message',function(message){
   
    totalCasesP.textContent = message.cases + " " + 'fall';
    totalDeathsP.textContent = message.dead + " " + 'avlidna';
    totalRecoveredP.textContent = '≈ '+message.recovered + " " + 'Tillfrisknade';


})

 async function getData(){
         
    const response = await fetch('monthly.csv');
    const data = await response.text();
    const table= data.split('\n').slice(1);
   
    for(let i =0; i<table.length;i++){
          
           const columns = table[i].split(',');
           let dayCounter=0;

          /* for(let i=1;i<columns.length;i++){
               dayCounter = dayCounter + parseInt(columns[i]);
              
           }*/  
            dailyCount.push(columns[1]);
            dates.push(columns[0]); 
            dailyDeaths.push(columns[2])
            intensiveCare.push(columns[3])  
    }
 }

async function getRegionData(){
  
    const response = await fetch('regionStat.csv');
    const data = await response.text();
    const table= data.split('\n');
  
    for(let i =0; i<table.length;i++){
          
        const columns = table[i].split(',');
        regions.push(columns[0]);
        regionCases.push(columns[1]);
        regionIntensive.push(columns[3]);
        regionDeaths.push(columns[4]);
    }
  

}



 async function getIndividualData(source,offset,arr){

    const response = await fetch(source);
    const data = await response.text();
    const table= data.split('\n');
   
    for(let i=1; i<offset;i++){  
        arr.push(0);
    }

    for(let i =0; i<table.length;i++){
       const columns = table[i].split(','); 
       arr.push(parseInt(columns[1]));
    }
 }

async function createChart1(){ 
        
       await   getData();
      // await   getIndividualData('avlidna.csv',37,dailyDeaths)
       //await   getIndividualData('intensivPerdag.csv',0,intensiveCare)
     let ctx1 = document.getElementById('chart1').getContext('2d');
     const myChart = new Chart(ctx1, {
     type: 'line',
     data: {
     labels:dates,
     datasets: [{
        label: 'Antal fall',
        data: dailyCount,
        fill:false,
        backgroundColor: 
            '#a3a4b8',
        
        borderColor: 
            '#a3a4b8'
        ,
        borderWidth: 3
    },{

        label: 'Antal dagliga avlidna',
        data: dailyDeaths,
        fill:false,
        backgroundColor: 
            '#bd1313',
        
        borderColor: 
            '#bd1313'
        ,
        borderWidth: 2
    },
    {
        label: 'intesiv vårdas',
        data: intensiveCare,
        fill:false,
        backgroundColor: 
            '#2f7826',
        
        borderColor: 
            '#2f7826'
        ,
        borderWidth: 2
    }
]
},
options: {
    maintainAspectRatio:false,
    responsive: true,  
    elements: {
        
        point:{
            radius:3
           
        }
    },
    title: {
        display: true,
        text: 'Månatliga fall,avlidna och på intensiv vård  '
    },
    tooltips: {
        mode: 'index',
        intersect: false,
    },
    hover: {
        mode: 'nearest',
        intersect: true
    },
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Månad'
            },
            ticks: {
                fontColor: "#CCC", // this here
              },
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Antal',
                labelColor:"red"
            },
            ticks: {
                fontColor: "#CCC", // this here
              },
        }]
      }
    }     
  });
}


 


 async function fillTable(source,selector){
   
    const response = await fetch(source);
    const data = await response.text();
    const table= data.split('\n');
    
    for(let i =0; i<table.length;i++){
       
        const columns = table[i].split(',');
        
        let tr = document.createElement("tr");
        
        let regionName = document.createElement("td");
            regionName.textContent = columns[0];
            tr.appendChild(regionName);

        let regionTotals= document.createElement("td");
            regionTotals.textContent = columns[1];
            tr.appendChild(regionTotals);
        
        let per100000= document.createElement("td");
            per100000.textContent = columns[2];
            tr.appendChild(per100000);   
            
        let totalIntensive= document.createElement("td");
            totalIntensive.textContent = columns[3];
            tr.appendChild(totalIntensive);
        
        let totalDeaths= document.createElement("td");
            totalDeaths.textContent = columns[4];
            tr.appendChild(totalDeaths);          
        
            tbody.appendChild(tr)
   }
   
  }

 async  function createRegionalChart(){
      await getRegionData();
     let ctx1 = document.getElementById('chart3').getContext('2d'); 
      const myChart = new Chart(ctx1, {
        type: 'bar',
        data: {
        labels:regions,
        datasets: [{
           label: 'Antal fall',
           data: regionCases,
           fill:false,
           backgroundColor: 
               '#a3a4b8',
           
           borderColor: 
               '#a3a4b8'
           ,
           borderWidth: 2
       },{
   
           label: 'Intesiv vårdas',
           data: regionIntensive,
           fill:false,
           backgroundColor: 
               '#2f7826',
           
           borderColor: 
               '#2f7826'
           ,
           borderWidth: 2
       },
       {
           label: 'avlidna',
           data: regionDeaths,
           fill:false,
           backgroundColor: 
               '#bd1313',
           
           borderColor: 
               '#bd1313'
           ,
           borderWidth: 2
       }
   ]
   },
   options: {
    maintainAspectRatio:false,
       responsive: true,  
       elements: {
           
           point:{
               radius: 1.5
           }
       },
       title: {
           display: true,
           text: 'Total antal fall,avlidna och på intensiv vård per region'
       },
       tooltips: {
           mode: 'index',
           intersect: false,
       },
       hover: {
           mode: 'nearest',
           intersect: true
       },
       scales: {
           xAxes: [{
               display: true,
               scaleLabel: {
                   display: true,
                   labelString: 'Region'
               },
               ticks: {
                   fontColor: "#CCC", // this here
                 },
           }],
           yAxes: [{
               display: true,
               scaleLabel: {
                   display: true,
                   labelString: 'Antal',
                   labelColor:"red"
               },
               ticks: {
                   fontColor: "#CCC", // this here
                 },
           }]
         }
       }     
     });

  }

  async function getAgeStats(){
    const response = await fetch('alderstat.csv');
    const data = await response.text();
    const table= data.split('\n');
  
    for(let i =0; i<table.length;i++){
          
        const columns = table[i].split(',');
        ageRange.push(columns[0]);
        ageTotalCases.push(columns[1]);
        ageIntensiveCare.push(columns[2]);
        ageDeaths.push(columns[3]);
    }

  }

 
  async function drawAgeChart(){
    await getAgeStats();
    let ctx1 = document.getElementById('chart5').getContext('2d'); 
     const myChart = new Chart(ctx1, {
       type: 'bar',
       data: {
       labels:ageRange,
       datasets: [{
          label: 'Antal fall',
          data: ageTotalCases,
          fill:false,
          backgroundColor: 
              '#a3a4b8',
          
          borderColor: 
              '#a3a4b8'
          ,
          borderWidth: 2
      },{
  
          label: 'Antal intesniv vårdas',
          data: ageIntensiveCare,
          fill:false,
          backgroundColor: 
              '#2f7826',
          
          borderColor: 
              '#2f7826'
          ,
          borderWidth: 2
      },
      {
          label: 'avlidna',
          data: ageDeaths,
          fill:false,
          backgroundColor: 
              '#bd1313',
          
          borderColor: 
              '#bd1313'
          ,
          borderWidth: 2
      }
  ]
  },
  options: {
   maintainAspectRatio:false,
      responsive: true,  
      elements: {
          
          point:{
              radius: 1.5
          }
      },
      title: {
          display: true,
          text: 'Total Antal fall,avlidna och  på intensiv vård  bland olika åldersgrupper'
      },
      tooltips: {
          mode: 'index',
          intersect: false,
      },
      hover: {
          mode: 'nearest',
          intersect: true
      },
      scales: {
          xAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Åldersgrupp'
              },
              ticks: {
                  fontColor: "#CCC", // this here
                },
          }],
          yAxes: [{
              display: true,
              scaleLabel: {
                  display: true,
                  labelString: 'Antal',
                  labelColor:"red"
              },
              ticks: {
                  fontColor: "#CCC", // this here
                },
          }]
        }
      }     
    });



  }

  async function getSexData(){

    const response = await fetch('konStat.csv');
    const data = await response.text();
    const table= data.split('\n');
  
    for(let i =0; i<table.length;i++){
          
        const columns = table[i].split(',');
        sex.push(columns[0]);
        sexCases.push(columns[1]);
        sexIntensiveCare.push(columns[2])
        sexDeaths.push(columns[3]);
    }
  
   
  }
  
  async function drawSexChart(){
      await getSexData();
      let ctx1 = document.getElementById('chart6').getContext('2d'); 
      const myChart = new Chart(ctx1, {
      type: 'bar',
      data: {
      labels:sex,
      datasets: [{
         label: 'Antal fall',
         data: sexCases,
         fill:false,
         backgroundColor: 
             '#a3a4b8',
         
         borderColor: 
             '#a3a4b8'
         ,
         borderWidth: 2
     },{
 
         label: 'Antal intesniv vårdas',
         data: sexIntensiveCare,
         fill:false,
         backgroundColor: 
             '#2f7826',
         
         borderColor: 
             '#2f7826'
         ,
         borderWidth: 2
     },
     {
         label: 'avlidna',
         data: sexDeaths,
         fill:false,
         backgroundColor: 
             '#bd1313',
         
         borderColor: 
             '#bd1313'
         ,
         borderWidth: 2
     }
 ]
 },
 options: {
  maintainAspectRatio:false,
     responsive: true,  
     elements: {
         
         point:{
             radius: 1.5
         }
     },
     title: {
         display: true,
         text: 'Total antall fall,avlidna och på intensiv vård  bland olika kön'
     },
     tooltips: {
         mode: 'index',
         intersect: false,
     },
     hover: {
         mode: 'nearest',
         intersect: true
     },
     scales: {
         xAxes: [{
             display: true,
             scaleLabel: {
                 display: true,
                 labelString: 'Kön'
             },
             ticks: {
                 fontColor: "#CCC", // this here
               },
         }],
         yAxes: [{
             display: true,
             scaleLabel: {
                 display: true,
                 labelString: 'Antal',
                 labelColor:"red"
             },
             ticks: {
                 fontColor: "#CCC", // this here
               },
         }]
       }
     }     
   });


        


  }
  
  createRegionalChart()
  fillTable('regionStat.csv',20);
  createChart1();
  drawAgeChart()
  drawSexChart();
  
  