import {isDate, isNumber, counter, createChannel} from "./helpers"

let status = createChannel()
let header = true
let rowCache = new Map<any, Array<any>>()
let header_:any
// not null rows
let nullRows = []

let secondWorker = new Worker(new URL("secondWorker.js", import.meta.url), {type: "module"})

self.onmessage = e => {
    handleData(e.data.data, e.data.headers)
}

let tab
let truth: Record<any, any> = {}

function handleData(data: Array<string>, headers:Array<any>){
    let mid = Math.round(data.length/2)
    // let observeTypes = true
    secondWorker.postMessage(data.slice(mid))

    if(header && headers.length === 0){
        header_ = data.shift() 
      
    }else{
      headers.unshift(" ")
      header_= headers
    }
      
    tab = []
    let index = 0
    let collength = data[0].split(",").length

    for(let i = 0; i <= collength; i++){
        truth[i] = []
     }

     truth[0].push("NaN")

    for(const row of data){
        // if(index === mid-1) break // searched the middle
     
       
        let splitted: Array<any> = row.split(",")
        // if(!rowCache.get(index)){
        //     rowCache.set(index, Array(splitted.length))
          
        // }
       

        splitted[splitted.length -1] =  splitted[splitted.length -1].replace("\r", "") // remove "\r" in last col

        for(let i = 0; i < splitted.length; i++){

            let type_ = null
            const val = splitted[i]
            
            if(isNumber(val)){
                
                type_ = "number" 
                splitted[i] = Number(val)
                // rowCache.get(index)[i] = val.length
            
              }
              else if(isDate(val)){
                //   splitted[i] = new Date(val)
                  type_ = "datetime"
                //   rowCache.get(index)[i] = val.length
              

              }
              else{
                type_ = "string"
                
                if(val.length === 0){
                    splitted[i] = "NaN"
                    
                    // rowCache.get(index)[i] = val.length
                }else{
                  
                }

              }
               let k = i + 1
              truth[k].push(type_)
            
       
             
        }
        // rowCache.get(index)?.push(row.length)
     
        tab.push(splitted)

        index++

    }
    //(tab, "tab")
    status.put(tab)

    
}

secondWorker.onmessage = async e => {


   let res:any = await status.take()

   let newData:Array<any> = []
    //  e.data.data.forEach((val:any, index:number)=> {
    //      if(isDate(val)){
    //          e.data.data[index] = new Date(val)
    //      }
    //  })  
  
    // if(res.length !== 0 && e.data.data.length !== 0){
    //    newData =  newData.concat(res, e.data.data)
    // }
    //(newData, "new")
    // newData = res

    res.forEach((val:Array<any>, index: number)=> {
      val.unshift(index)
    })
   

    for(const [key, value] of Object.entries(truth)){
            truth[key] = counter(value)

    }

    for(const [key, value] of Object.entries(truth)){
        const keys = Object.keys(value)
        let large = -1
        let chosen = ""
        for(let key_ of keys){
          if(value[key_] > large){
              large = value[key_]
              chosen = key_
          }

        }
        truth[key] = chosen
    }

    // //(truth)
    // console.table(header_)
    //(rowCache)
    //(e.data.cache)


    IllbeBack(res, header_, truth)
}

function IllbeBack(data:any, header_:any = undefined, meta:Record<any, any>){

    secondWorker.terminate()
    let mid = Math.round(data.length/2)
    self.postMessage({data, header_, meta, mid})
  }

