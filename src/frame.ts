import {writeCsv,resetIndex,rename,map, returnFrame, head, tail, slice, isNull, query, drop, dropna, replace, unique, getCol, apply_along_axis, group_by, count } from "./frameFuntions"

import {plot_histogram, make_scatter_matrix, twoD} from "./plots"

import {workerMean} from "./stats"

/**
 * data: 
 *     data: [[]]
 *     header_: ""
 *     meta: {}
 *     mid: 0
 */

// TODO: continual dropping decreases meta data indefinetley(really bad) affecting stats


export default class Frame{
    table = undefined
    private Pdata:Record<any, any>
    private Header_:Array<any> = []

    constructor(table:any, data:Record<any, any>){
          this.table = table
          this.Pdata = data
         if(typeof this.Pdata.header_ === "string"){
            this.Header_ = this.Pdata.header_.split(",")
            this.Header_.unshift(" ")
            this.Header_[this.Header_.length - 1] =   this.Header_[this.Header_.length - 1].replace("\r", "")
         }
         else {
             this.Header_ = this.Pdata.header_
         }
         
      
    }
    get shape(){
        return [this.Pdata.data.length,  this.Pdata.data[0].length]
    }
    get columns(){
        return this.Header_
    }

    // get mean(){
    //    let stats:any = [" "]
    //     for(const [key, val] of Object.entries(this.Pdata.meta)){
            
    //         if(val === "number"){
    //             let sum = 0
    //            let k = parseInt(key)
    //            k = k + 1
    //            //.log(k)

    //            this.Pdata.data.forEach((arr:Array<any>, i)=> {
    //                if(Number(arr[k])){
    //                 //    //.log(arr[k])
    //                    sum += arr[k]
    //                }
                     
    //            })

    //            stats[k]  = sum/this.Pdata.data.length
    //         }else{
    //             let k = parseInt(key)
    //             k += 1
    //             stats[k] = NaN
    //         }
    //     }


    //     return [stats]
    // }

}


Frame.prototype.returnFrame = returnFrame

Frame.prototype.head = head
Frame.prototype.tail = tail
Frame.prototype.map   = map
Frame.prototype.slice = slice
Frame.prototype.isNull = isNull
Frame.prototype.query  = query
Frame.prototype.drop = drop

Frame.prototype.dropna = dropna
Frame.prototype.replace =  replace
Frame.prototype.unique = unique
Frame.prototype.getCol = getCol

Frame.prototype.apply_along_axis = apply_along_axis
Frame.prototype.counter = count
Frame.prototype.rename = rename
Frame.prototype.reset = resetIndex


Frame.prototype.fillna = function (method:string){
    if(method === "mean"){
   
    }
    else if(method === "avg"){

    }
    else if (method === "Most"){

    }
    else{
        throw new Error(`${method} not implemented yet`)
    }

}

//plots 

Frame.prototype.hist = plot_histogram
Frame.prototype.scatterM = make_scatter_matrix
Frame.prototype.scatter = twoD

// Frame.prototype.validate  = function(){
//     let status:Record<any, any> =  {status: true}
//     this.Pdata.data.forEach((arr:Array<any>,i:number)=> {

//         arr.forEach((val, j)=> {
//             if(typeof val === "string"){
//                status.status = false;
//                status.rowNcol = {i, j}
//                return
//             }
         
//         })
//         return

//     })

//     return status
  
// }

Frame.prototype.toWasm = function(){

}

Frame.prototype.group_by =  group_by

Frame.prototype.newCol = function(arr:Array<any>, header:string,type:string, callback:Function){
         if(arr.length !== this.Pdata.data.length)
            throw new Error("new column length !== dataframe len")
        
        else{
            this.Pdata.data.forEach((arr_, index)=> {
                arr_.push(arr[index])
            })

            this.Header_.push(header)
            
        }
        let obj = {
            data: {
                data: this.Pdata.data,
                header_:  this.Header_,
                notNeeded: false
    
            }
        }
       let m = this.Header_.length
       this.Pdata.meta[m] = type
        // handle updating the meta with new data
        this.returnFrame(obj, this.Pdata.data, this.Header_, true, callback)
}

Frame.prototype.basicStat = workerMean

Frame.prototype.writeCSV = writeCsv 
// function fillna(method, inplace)


//function(value:any, toReplace:any, callback:Function, inPlace: false){
//     let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))

//     let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))

//     data.forEach((arr, i)=> {
//         arr.forEach((val, j)=> {
//              if(val === toReplace){
//                  arr[j] = value
//              }
//         })
//     })
//     if(inPlace){
//         const work = new Worker("./workers/tableworker.js")
//         let obj = {
//         data: {
//             data: data,
//             header_:  headers,
//             notNeeded: false

//         }
//     }
//     work.postMessage(obj)

//     work.onmessage = e => {
//             this.table = e.data
//             this.Pdata.data = data
//             this.Pdata.header_ = headers
//             this.Header_ = headers
//             callback(this)
//             work.terminate()
//     }
//   }
//   else{
//     const work = new Worker("./workers/tableworker.js")
//     let obj = {
//     data: {
//         data: data,
//         header_:  headers,
//         notNeeded: false

//     }
// }
//     work.postMessage(obj)

//     work.onmessage = e => {
//         let dataCopy = JSON.stringify(data)
        
//             callback(new Frame(e.data, JSON.parse(dataCopy)))
//             work.terminate()
//     }
        
//     }


// }

// unique in columns


//function(column:any){
     
//     let index:number = this.Header_.indexOf(column)

//    if(index === 0){
//     // if(typeof this.Pdata.header_ === "string"){
//     //     index = this.Pdata.header_.split(",").length 
//     //  }else{
//     //      index = this.Pdata.header_.length 
//     //  }
      
     
//    }
//     let unique:Array<any> = []
//     this.Pdata.data.forEach((arr:Array<any>, i:number)=> {
//        if(!unique.includes(arr[index])){
//             unique.push(arr[index])
//        }     
//     })



//     return unique


// }

// map 




// fix drop with headers

// function(column:string){
//     let index:number = this.Header_.indexOf(column)
//     let col: Array<any> = []

//     if(index >= 0){
//         this.Pdata.data.forEach((arr:Array<any>, i:number)=> {
//             col.push(arr[index])     
//        })
  
//     }
//     else {
//         throw new Error(`${column} probably does not exist`);
        
        
//     }
    
//      return col
// }


//function(axis:number, fn: Function,where:string, callback:Function,inPlace:boolean = false){
//     let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
//     let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))

//     if(axis === 1){
     
//        let index = headers.indexOf(where)

//         if(index !== -1){
//              data.forEach((arr:Array<any>, i)=> {
//                  arr[index] = fn(arr[index])
//              })
//         }
//         else{
//             throw new Error(`${where} does not exist, i think`)
//         }


//     }
//     else if(axis === 0){
//         // row 
//         if(where === "all"){
//             // for all rows
//             data.forEach((arr:Array<any>, i)=> {
//                    arr.forEach((val, j)=> {
//                        arr[j] = fn(val)
//                    })
//             })
//         }
//         else {
//             let row:number =  parseInt(where)
//             let data_:Array<any> = data[row]

//          data_.forEach((val, index)=> {
//              data[index] = fn(val)
//          })

//          data[row] = data_

//         }

//     }


//     if(inPlace){
//         const work = new Worker("./workers/tableworker.js")
//         let obj = {
//         data: {
//             data: data,
//             header_:  headers,
//             notNeeded: false

//         }
//     }
//     work.postMessage(obj)

//     work.onmessage = e => {
//             this.table = e.data
//             this.Pdata.data = data
//             this.Pdata.header_ = headers
//             this.Header_ = headers
//             callback(this)
//             work.terminate()
//     }
//   }
//   else{
//     const work = new Worker("./workers/tableworker.js")
//     let obj = {
//     data: {
//         data: data,
//         header_:  headers,
//         notNeeded: false

//     }
// }
//     work.postMessage(obj)

//     work.onmessage = e => {
//         let dataCopy = JSON.stringify(data)
        
//             callback(new Frame(e.data, JSON.parse(dataCopy)))
//             work.terminate()
//     }
        
//     }

// }




//function(inPlace:boolean = false,callback:Function){
//     let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
//     let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))
  
  

//      for(let i = data.length - 1; i >= 0; i--){
   
//          if(data[i].includes("NaN")){
//              data.splice(i, 1)
             
//          }
//      }

//     data.forEach((arr, index)=> {
//         arr[0] = index
//     })


//     if(inPlace){
//         const work = new Worker("./workers/tableworker.js")
//         let obj = {
//         data: {
//             data: data,
//             header_:  headers,
//             notNeeded: false

//         }
//     }
//     work.postMessage(obj)

//     work.onmessage = e => {
//             this.table = e.data
//             this.Pdata.data = data
//             this.Pdata.header_ = headers
//             this.Header_ = headers
//             callback(this)
//             work.terminate()
//     }
//   }
//   else{
//     const work = new Worker("./workers/tableworker.js")
//     let obj = {
//     data: {
//         data: data,
//         header_:  headers,
//         notNeeded: false

//     }
// }
//     work.postMessage(obj)

//     work.onmessage = e => {
//         let dataCopy = JSON.stringify(data)
//             this.Pdata.header_ = headers
//             this.Header_ = headers
//             callback(new Frame(e.data, JSON.parse(dataCopy)))
//             work.terminate()
//     }
        
//     }
// }


// = function(values:Record<any, any>, column:any,callback:Function, inPlace:boolean = false){
//     let index:number
//     let headers:Array<any> = []
//     if(typeof this.Pdata.header_ === "string"){
//         headers = JSON.parse(JSON.stringify(this.Pdata.header_.split(",")))
//         headers.unshift(" ")
//     }else{
//         headers = JSON.parse(JSON.stringify(this.Pdata.header_))
        

//     }
//     let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))
//     index = headers.indexOf(column)

//     data.forEach((arr:Array<any>, i:number)=> {
//         if(values[arr[index]]){
//              arr[index] = values[arr[index]]
//         }     
//      })

//      if(inPlace){
//         const work = new Worker("./workers/tableworker.js")
//         let obj = {
//         data: {
//             data: data,
//             header_:  headers,
//             notNeeded: false

//         }
//     }
//     work.postMessage(obj)

//     work.onmessage = e => {
//             this.table = e.data
//             this.Pdata.data = data
//             this.Pdata.header_ = headers
//             callback(this)
//             work.terminate()
//     }
//   }
//   else{
//     const work = new Worker("./workers/tableworker.js")
//     let obj = {
//     data: {
//         data: data,
//         header_:  headers,
//         notNeeded: false

//     }
// }
//     work.postMessage(obj)

//     work.onmessage = e => {
//         let dataCopy = JSON.stringify(data)
        
//             callback(new Frame(e.data, JSON.parse(dataCopy)))
//             work.terminate()
//     }
        
//     }



// } 


// reval unique, implement the proxy for rows and cols

// apply function



//  function(len: number, callback:Function){

//     const work = new Worker("./workers/tableworker.js")
//     // //.log(this.Pdata.)
//     let data:Array<any> = this.Pdata.data.slice(0, len)
//     // let header_ = ""

//     let obj = {
//         data: {
//             data: data,
//             header_: this.Header_,
//             notNeeded: false

//         }
//     }
//    work.postMessage(obj)

//    work.onmessage = e => {
//          callback(e.data)
//          work.terminate()

//    }
    




// }


 
//function(len: number, callback:Function){

//     const work = new Worker("./workers/tableworker.js")
//     // //.log(this.Pdata.)
//     let data:Array<any> = this.Pdata.data.slice(-len)
//     let header_ = ""

//     let obj = {
//         data: {
//             data: data,
//             header_:  this.Header_,
//             notNeeded: false

//         }
//     }
//    work.postMessage(obj)

//    work.onmessage = e => {
//          callback(e.data)
//          work.terminate()

//    }
    




// }


//  function(start:number, end:number, callback:Function){

//       if(start > end || start < 0 || end > this.Pdata.data.length) throw new Error(`
//       start > end || start < 0 || end > data.length
      
//       `) 
//     const work = new Worker("./workers/tableworker.js")
//     // //.log(this.Pdata.)
//     let data:Array<any> = this.Pdata.data.slice(start, end)


//     let obj = {
//         data: {
//             data: data,
//             header_:  this.Header_,
//             notNeeded: false

//         }
//     }
//    work.postMessage(obj)

//    work.onmessage = e => {
//          callback(e.data)
//          work.terminate()

//    }
    




// }



// function(callback:Function, column = undefined){

//     let data:Array<any> = this.Pdata.data 
//     let truthTable:Array<any> = []
//     let obj:Record<any, any> = {}

//           if(column){
//             let index:any = this.Header_.indexOf(column)
            
           
//             // //.log(index, this.Pdata.header_)
//                 if(index !== -1){
//                   data.forEach((val:Array<any>, index2)=> {
//                     let temp:Array<any> = []
//                     //.log(val[index])
//                     temp[0] = index2
//                     if(val[index] === "NaN"){
//                         temp.push(true)
//                     }
//                     else{
//                         temp.push(false)
//                     }
                   
//                     truthTable.push(temp)
//                   })
//                 //   console.log(truthTable)
                  
//                   obj = {
//                     data: {
//                         data: truthTable,
//                         header_:  column,
//                         notNeeded: false
            
//                     }
//                 }
//                     //.log(truthTable) 
//                 }
//                 else{
//                     throw new Error(`${column} does not exist`)
//                 }
//           }
          
//           else{
//             data.forEach((val:Array<any>, index)=> {
//                 //   truthTable.push(index)
//                   let temp:Array<any> = []
//                 //   temp.push(index)
//                 val.forEach((val, index)=> {
//                     temp[0] = index
//                    if(val === "NaN"){
//                        temp.push(true)
//                    }
//                    else{
//                        temp.push(false)
//                    }
//                 })
               
//                 truthTable.push(temp)
//               })
//               obj = {
//                 data: {
//                     data: truthTable,
//                     header_:  this.Header_,
//                     notNeeded: false
        
//                 }
//             }
//           }
        
         
          
//           const work = new Worker("./workers/tableworker.js")
         
//        work.postMessage(obj)
    
//        work.onmessage = e => {
//              callback(e.data)
//              work.terminate()
//        }


// }



// function(){
//     const data = this.Pdata.data

//     let operations = {
        
//         // byIndex(i:number){

//         // }

//     }
 

//     let handler ={
//         get(target:any, key:any){
//             if(key.split(",").length > 2){
//                 //.log(key, "isArray")
//                 let temp:Array<any> = []
//                 let temp2:Array<any> = []

//                 key.split(",").forEach((val)=> {
//                     if(Number(val)){
//                         temp.push(data[+val])
                        
//                     }
//                     else{
//                        const index = this.Header_.indexOf(val)
//                        let temp3:Array<any> = []
//                        if(index !== -1){
//                         this.Pdata.data.forEach((val:Array<any>, index:number)=> {
//                                       temp3.push(val[index])
//                         })

//                        }

//                        temp2.push(temp3)
//                        temp3 = []

//                     }
//                 })
            
//                 if(temp.length > 0 && temp2.length > 0 ){
//                     return [temp, temp2]

//                 }
//                 else if(temp2.length > 0){
//                     return temp2
//                 }
//                 else if(temp.length > 0){
//                     return temp
//                 }
//                 else{
//                     throw new Error(key + "  Query Failed column or row does not exist");
                    
//                 }
//             }
//             else if(Number(key)){
//                 return data[key]
//             }
//             else if(typeof key === "string"){
//                 //.log(key, "Object")

//                 const index = this.Header_.indexOf(key)
//                 let temp3:Array<any> = []
//                 if(index !== -1){
//                  this.Pdata.data.forEach((val:Array<any>, index:number)=> {
//                                temp3.push(val[index])
//                  })
//                  return temp3
//                 }

//             }
//             else{
//                 throw new Error(key + "  Query Failed column or row does not exist");

//                 //.log(key.name, "all")
//                 // //.log( Number(key))
//             }
//         }

//     }
       
//     return new Proxy(operations, handler)


// }


// function(inPlace:boolean = false,callback:Function,...values:Array<any>){
//     let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
 
//      const data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))


     
//           values.forEach((val:any)=> {
//               if(Number(val)){
//                    data.splice(val, 1)
//               }
//               else if(val === 0 || val === "0"){
//                 data.splice(val, 1)
//               }
//               else{
//                //must be column 
//                if(typeof val === "string"){
//                 const indice:number =  headers.indexOf(val)
//                     if(indice !== -1){
//                         headers.splice(indice, 1)
//                         console.log(headers)
//                         data.forEach((arr)=> {
//                             arr.splice(indice, 1)
//                         })
                         
//                     }
//                     else{
//                      throw new Error(`${val} column does not exist`)
 
//                     }
//                }else{
//                    throw new Error(`${val} type not implemented`)
//                }
//               }
//           })
  


         
//               data.forEach((arr, index)=> {
//                   arr[0] = index
//               })
         

//           if(inPlace){
//                 const work = new Worker("./workers/tableworker.js")
//                 let obj = {
//                 data: {
//                     data: data,
//                     header_:  headers,
//                     notNeeded: false
        
//                 }
//             }
//             work.postMessage(obj)

//             work.onmessage = e => {
//                     this.table = e.data
//                     this.Pdata.data = data
//                     this.Pdata.header_ = headers
//                     this.Header_ = headers
//                     callback(this)
//                     work.terminate()
//             }
//           }
//           else{
//             const work = new Worker("./workers/tableworker.js")
//             let obj = {
//             data: {
//                 data: data,
//                 header_:  headers,
//                 notNeeded: false
    
//             }
//         }
//         work.postMessage(obj)

//         work.onmessage = e => {
//                let dataCopy = JSON.stringify(data)
//                this.Pdata.header_ = headers
//                this.Header_ = headers
//                 callback(new Frame(e.data, JSON.parse(dataCopy)))
//                 work.terminate()
//         }
             
//           }


// }
