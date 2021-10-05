self.onmessage = e => {
    //.log(e.data)
    

    createTable(e.data)

}

function createTable(data:Record<any,any>){
let template = ``

  const tableStart = `<table width="100%" border = "1" cellpadding = "5">`
  const tableEnd = `<\\table>`

  let thS = `<th>`
  let thE = `<\\th>`

  let trS = `<tr>`
  let trE = `<\\tr>`

  let tdS = `<td>`
  let tdE = `<\\td>`


  
    
    template += tableStart
    let head:Array<any> 
    if(typeof data.data.header_ === "string"){
         head = data.data.header_.split(",")
        head.unshift(" ")
    }
    else {
        head = data.data.header_
    }
   
    let actualData  = []
    const dataLen =  data.data.data.length
   

   if(head.length > 10){
       const firstHalf = head.slice(0, 5)
       const secondHalf = head.slice(-5)
       const dots:Array<any> = new Array(1).fill(" ... ")

     head =   firstHalf.concat([dots], secondHalf)

   
    
    let data_:Array<any> =  data.data.data

    let temp:Array<any> = []
    data_.forEach((val:Array<any>, index:number)=> {
        
        let dataFirstHalf  =   val.slice(0, 5)
        const dots = new Array(1).fill(" ... ")

        let dataSecondHalf =   val.slice(-5)

        temp.push(dataFirstHalf.concat([dots], dataSecondHalf))

      

        
    })

    if(dataLen > 15){
        let firstHalf = temp.slice(0, 8)
        let secondHalf = temp.slice(-8)
        let dots = new Array(head.length).fill(" ... ")

        temp = firstHalf.concat([dots],secondHalf)
        

    }

    // //.log(temp)
    actualData = temp
   }
   else{
    let temp  =  data.data.data
    if(dataLen > 15 && !data.data.notNeeded ){
        let firstHalf = temp.slice(0, 8)
        let secondHalf = temp.slice(-8)
        let dots = new Array(head.length).fill(" ... ")


        temp = firstHalf.concat([dots],secondHalf)
        //.log(temp)
        

    }
    if(head.length > 10){
        let data_:Array<any> =  data.data.data

        let temp_:Array<any> = []
        data_.forEach((val:Array<any>, index:number)=> {
            
            let dataFirstHalf  =   val.slice(0, 5)
            const dots = new Array(1).fill(" ... ")
    
            let dataSecondHalf =   val.slice(-5)
    
            temp_.push(dataFirstHalf.concat([dots], dataSecondHalf))
    
          
    
            
        })
        temp = temp_
        
    }
  
       actualData = temp
   }



    if(!data.data.notNeeded){
        head[head.length - 1] = head[head.length - 1].replace("\r", "")
        template += trS
        head.forEach((val:string)=> {
           template += `${thS} ${val} `
        })
        // template += trE
    }
    

    

    actualData.forEach((val:Array<any>)=> {
        template += trS
         val.forEach((val:string)=> {
            template += `${tdS} ${val} `
         })

        // template += trE

    })


    

    // template += tableEnd

     self.postMessage(template)
}