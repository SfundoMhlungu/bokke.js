import Frame from "./frame"
import Series from "./series"
import { counter } from "./workers/helpers"


export function returnFrame(obj:Record<any, any>, data:Array<any>, headers: Array<any>, inPlace:boolean, callback:Function, meta?:Record<any, any>){
//    console.log("return frame called")
    if(inPlace){
        const work = new Worker("./workers/tableworker.js")
      
        work.postMessage(obj)

        work.onmessage = e => {
            // console.log(this.Header_, headers)
                this.table = e.data
                this.Pdata.data = data
                this.Pdata.header_ = headers
                this.Header_ = headers
                if(meta){
                    this.Pdata.meta = meta
                }
                callback(this)
                work.terminate()
        }
    }
    else{
        const work = new Worker("./workers/tableworker.js")
        work.postMessage(obj)
    
        work.onmessage = e => {
            let dataCopy = JSON.parse(JSON.stringify(data))
            let data_ = JSON.parse(JSON.stringify(this.Pdata))
            // console.log(dataCopy)
              data_.data = dataCopy
              if(meta){
                data_.meta = meta
              }
           
              data_.header_ = headers
              
             
            //  dataCopy.header_ = headers
            //  dataCopy.Header_ = headers
                callback(new Frame(e.data, data_))
                work.terminate()
        }
            
        }

   


}

export function map(values:Record<any, any>, column:any,callback:Function, inPlace:boolean = false) {

    let index:number
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
 
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))
    index = headers.indexOf(column)

    data.forEach((arr:Array<any>, i:number)=> {
        if(values[arr[index]]){
             arr[index] = values[arr[index]]
        }     
     })
     let obj = {
        data: {
            data: data,
            header_:  headers,
            notNeeded: false

        }
    }

     this.returnFrame(obj, data, headers, inPlace, callback)


}

// do not return a new frame 

export function head(len: number, callback:Function){

    const work = new Worker("./workers/tableworker.js")
    // //.log(this.Pdata.)
    // let data:Array<any> = this.Pdata.data.slice(0, len)
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
 
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data.slice(0, len)))
    // let header_ = ""

    let obj = {
        data: {
            data: data,
            header_: headers,
            notNeeded: false

        }
    }

    this.returnFrame(obj, data, headers, false, callback)

//    work.postMessage(obj)

//    work.onmessage = e => {
//          callback(e.data)
//          work.terminate()

//    }
    


}


export function tail(len: number, callback:Function){

    const work = new Worker("./workers/tableworker.js")
    // //.log(this.Pdata.)
    // let data:Array<any> = this.Pdata.data.slice(-len)
    // let header_ = ""
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data.slice(-len)))
    // let header_ = ""

    let obj = {
        data: {
            data: data,
            header_: headers,
            notNeeded: false

        }
    }

    this.returnFrame(obj, data, headers, false, callback)

//    work.postMessage(obj)

//    work.onmessage = e => {
//          callback(e.data)
//          work.terminate()

//    }
    
}

export function slice(start:number, end:number, callback:Function){

    if(start > end || start < 0 || end > this.Pdata.data.length) throw new Error(`
    start > end || start < 0 || end > data.length
    
    `) 
  const work = new Worker("./workers/tableworker.js")
  // //.log(this.Pdata.)
  let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data.slice(start, end)))


  let obj = {
      data: {
          data: data,
          header_:  headers,
          notNeeded: false

      }
  }
  this.returnFrame(obj, data, headers, false, callback)
  

//  work.postMessage(obj)

//  work.onmessage = e => {
//        callback(e.data)
//        work.terminate()

//  }
  




}

export function isNull(callback:Function, column = undefined){

    let data:Array<any> = this.Pdata.data 
    let truthTable:Array<any> = []
    let obj:Record<any, any> = {}

          if(column){
            let index:any = this.Header_.indexOf(column)
            
           
            // //.log(index, this.Pdata.header_)
                if(index !== -1){
                  data.forEach((val:Array<any>, index2)=> {
                    let temp:Array<any> = []
                    //.log(val[index])
                    temp[0] = index2
                    if(val[index] === "NaN"){
                        temp.push(true)
                    }
                    else{
                        temp.push(false)
                    }
                   
                    truthTable.push(temp)
                  })
                //   console.log(truthTable)
                  
                  obj = {
                    data: {
                        data: truthTable,
                        header_:  column,
                        notNeeded: false
            
                    }
                }
                    //.log(truthTable) 
                }
                else{
                    throw new Error(`${column} does not exist`)
                }
          }
          
          else{
            data.forEach((val:Array<any>, index)=> {
                //   truthTable.push(index)
                  let temp:Array<any> = []
                //   temp.push(index)
                val.forEach((val, index)=> {
                    temp[0] = index
                   if(val === "NaN"){
                       temp.push(true)
                   }
                   else{
                       temp.push(false)
                   }
                })
               
                truthTable.push(temp)
              })
              obj = {
                data: {
                    data: truthTable,
                    header_:  this.Header_,
                    notNeeded: false
        
                }
            }
          }
        
         
          
          const work = new Worker("./workers/tableworker.js")
         // change here
       work.postMessage(obj)
    
       work.onmessage = e => {
             callback(e.data)
             work.terminate()
       }


}

export function query(){
    const data = this.Pdata.data

    let operations = {
        
        // byIndex(i:number){

        // }

    }
 

    let handler ={
        get(target:any, key:any){
            if(key.split(",").length > 2){
                //.log(key, "isArray")
                let temp:Array<any> = []
                let temp2:Array<any> = []

                key.split(",").forEach((val)=> {
                    if(Number(val)){
                        temp.push(data[+val])
                        
                    }
                    else{
                       const index = this.Header_.indexOf(val)
                       let temp3:Array<any> = []
                       if(index !== -1){
                        this.Pdata.data.forEach((val:Array<any>, index:number)=> {
                                      temp3.push(val[index])
                        })

                       }

                       temp2.push(temp3)
                       temp3 = []

                    }
                })
            
                if(temp.length > 0 && temp2.length > 0 ){
                    return [temp, temp2]

                }
                else if(temp2.length > 0){
                    return temp2
                }
                else if(temp.length > 0){
                    return temp
                }
                else{
                    throw new Error(key + "  Query Failed column or row does not exist");
                    
                }
            }
            else if(Number(key)){
                return data[key]
            }
            else if(typeof key === "string"){
                //.log(key, "Object")

                const index = this.Header_.indexOf(key)
                let temp3:Array<any> = []
                if(index !== -1){
                 this.Pdata.data.forEach((val:Array<any>, index:number)=> {
                               temp3.push(val[index])
                 })
                 return temp3
                }

            }
            else{
                throw new Error(key + "  Query Failed column or row does not exist");

                //.log(key.name, "all")
                // //.log( Number(key))
            }
        }

    }
       
    return new Proxy(operations, handler)


}

export function unique(column:any){
     
    let index:number = this.Header_.indexOf(column)

   if(index === 0){
    // if(typeof this.Pdata.header_ === "string"){
    //     index = this.Pdata.header_.split(",").length 
    //  }else{
    //      index = this.Pdata.header_.length 
    //  }
      
     
   }
    let unique:Array<any> = []
    this.Pdata.data.forEach((arr:Array<any>, i:number)=> {
       if(!unique.includes(arr[index])){
            unique.push(arr[index])
       }     
    })



    return unique


}

export function getCol(column:string){
    let index:number = this.Header_.indexOf(column)
    let col: Array<any> = []

    if(index >= 0){
        this.Pdata.data.forEach((arr:Array<any>, i:number)=> {
            col.push(arr[index])     
       })
  
    }
    else {
        throw new Error(`${column} probably does not exist`);
        
        
    }
       
     return new Series(col, [], this.Pdata.meta[index])
}



// return a new frame 
export function rename(oldval:string, value:string, callback:Function){
    let index = this.Header_.indexOf(oldval)
    if(index !== -1)
      this.Header_[index] = value

      let obj = {
        data: {
            data: this.Pdata.data,
            header_:  this.Header_,
            notNeeded: false

        }
    }
    this.returnFrame(obj, this.Pdata.data, this.Header_, true, callback)

}

export function drop(inPlace:boolean = false,callback:Function,...values:Array<any>){
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
 
     const data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))
    let indices:Array<number> = []
    let meta:Record<any, any>| undefined = undefined

     
          values.forEach((val:any)=> {
              if(Number(val)){
                //    data.splice(val, 1)
                //    data.forEach((arr, index)=> {
                //     arr[0] = index
                // })
                indices.push(val)
              }

              else if(val === 0 || val === "0"){
                // data.splice(val, 1)
                // data.forEach((arr, index)=> {
                //     arr[0] = index
                // })
                indices.push(val)
              }
              else{
               //must be column 
               if(typeof val === "string"){
                const indice:number =  headers.indexOf(val)
                    if(indice !== -1){
                        headers.splice(indice, 1)
                        
                        // console.log(indice)
                        data.forEach((arr)=> {
                            arr.splice(indice, 1)
                        })


                        let metacopy = JSON.parse(JSON.stringify(this.Pdata.meta))
                       let res = Reflect.deleteProperty(metacopy, indice)

                       if(res){
                           let k = Object.keys(metacopy)
                           let newObj:Record<any, any> = {}

                           for(let key of k){
                             if(indice < +key){
                               let newKey = +key - 1
                               newObj[newKey] = metacopy[key]
                             }
                             else{
                                 newObj[key] = metacopy[key]
                             }
                           }

                           meta = newObj
                       }
                         
                    }
                    else{
                     throw new Error(`${val} column does not exist`)
 
                    }
               }else{
                   throw new Error(`${val} type not implemented`)
               }
              }
          })
         let index = 0
          indices.forEach((val)=> {
            data.splice(+val - index, 1)
            index++;
          })


         
             

              let obj = {
                data: {
                    data: data,
                    header_:  headers,
                    notNeeded: false
        
                }
            }
         
            this.returnFrame(obj, data, headers, inPlace, callback, meta)
        //   if(inPlace){
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
        // work.postMessage(obj)

        // work.onmessage = e => {
        //        let dataCopy = JSON.stringify(data)
        //        this.Pdata.header_ = headers
        //        this.Header_ = headers
        //         callback(new Frame(e.data, JSON.parse(dataCopy)))
        //         work.terminate()
        // }
             
        //   }

         

}

export function dropna(inPlace:boolean = false,callback:Function){
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))
  
  

     for(let i = data.length - 1; i >= 0; i--){
   
         if(data[i].includes("NaN")){
             data.splice(i, 1)
             
         }
     }

    // data.forEach((arr, index)=> {
    //     arr[0] = index
    // })
    let obj = {
        data: {
            data: data,
            header_:  headers,
            notNeeded: false

        }
    }

    this.returnFrame(obj, data, headers, inPlace, callback)

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
}

export  function replace(toReplace:any,value:any, callback:Function, inPlace: false){
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))

    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))

    data.forEach((arr, i)=> {
        arr.forEach((val, j)=> {
             if(val === toReplace){
                 arr[j] = value
             }
        })
    })

    let obj = {
        data: {
            data: data,
            header_:  headers,
            notNeeded: false

        }
    }

    this.returnFrame(obj, data, headers, inPlace, callback)


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


}



export function apply_along_axis(axis:number, fn: Function,where:string, callback:Function,inPlace:boolean = false){
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))

    if(axis === 1){
     
       let index = headers.indexOf(where)

        if(index !== -1){
             data.forEach((arr:Array<any>, i)=> {
                 arr[index] = fn(arr[index])
             })
        }
        else{
            throw new Error(`${where} does not exist, i think`)
        }


    }
    else if(axis === 0){
        // row 
        if(where === "all"){
            // for all rows
            data.forEach((arr:Array<any>, i)=> {
                   arr.forEach((val, j)=> {
                       arr[j] = fn(val)
                   })
            })
        }
        else {
            let row:number =  parseInt(where)
            let data_:Array<any> = data[row]

         data_.forEach((val, index)=> {
             data[index] = fn(val)
         })

         data[row] = data_

        }

    }
    let obj = {
        data: {
            data: data,
            header_:  headers,
            notNeeded: false

        }
    }
    this.returnFrame(obj, data, headers, inPlace, callback)

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

}


// group By 

export function group_by(column:string, predicateFn:Function, callback:Function){
    let headers:Array<any> = JSON.parse(JSON.stringify(this.Header_))
    let data: Array<Array<any>> = JSON.parse(JSON.stringify(this.Pdata.data))


    let index = headers.indexOf(column)
    let group :Array<any> = []

    if(index !== -1){
        data.forEach((arr, index_)=> {
            let val:any = arr[index]
       
            if(typeof val === 'string'){
                val = val.trim()
            }
            if(predicateFn(val)){
                group.push(arr)
            }
        })

    }else{
        throw new Error(`${column} does not exist, i think.`)
    }

   // console.log(group)
    let obj = {
        data: {
            data: group,
            header_:  headers,
            notNeeded: false

        }
    }
    this.returnFrame(obj, group, headers, false, callback)
}

// count values in a column 

export function count(column:string){
    let count = undefined

   
        let col = this.getCol(column)
        if(col){
           count =  counter(col.data)
        }
  

    return count
}

export function resetIndex(callback:Function){

    this.Pdata.data.forEach((arr, index)=> {
           arr[0] = index
    })


    
    let obj = {
        data: {
            data: this.Pdata.data,
            header_:  this.Header_,
            notNeeded: false

        }
    }
    this.returnFrame(obj, this.Pdata.data, this.Header_, true, callback)
}



export function writeCsv(name:string){
   let copy:Array<any> = JSON.parse(JSON.stringify( this.Pdata.data))
   let head = JSON.parse(JSON.stringify(this.Header_))
     copy.forEach((val:Array<any>, index:number)=> {
         let last = val.pop()
         last += "\n"
         val.push(last)

     })

    let l = head.pop()
    l += "\n"
    head.push(l)

   copy.unshift(head)

     let b = new Blob(copy)

     const a = document.createElement("a")
     a.download = name + ".csv"
     a.href = window.URL.createObjectURL(b)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)




}