let header:Array<any> = []
let basicstats:Array<any> = []


function *calcMeans(){
    const meta = this.Pdata.meta 
    const key = Object.keys(meta)
    let index = 0
     while(index !== key.length){
         if(meta[key[index]] === "number"){
             yield this.Pdata.data[key[index] + 1]
         }

        
     }




}

let meanGen = calcMeans()
let meta:any = undefined
let key:any = undefined
let nums = []
let index = 0


export function workerMean(){
    let work = new Worker("./workers/statsWorker.js")
   if(meta === undefined){
       basicstats = []
       header  = []
       meta = this.Pdata.meta 
       key = Object.keys(meta)
       for(let k in key){
        if(meta[k] === "number"){
           nums.push(+k)
        }
    
    }
   }
  
    
    // if(index === nums.length - 1) return

    let cols = []
    nums.forEach((val, index)=> {
        cols.push(this.getCol(this.Header_[nums[index]]).data)
        header.push(this.Header_[nums[index]])
    })
    // console.log(col)
     
    work.postMessage({type: "mean", data: cols})

    

    work.onmessage = e => {
     console.log(e.data)
      e.data.unshift("mean")
       basicstats.push(e.data)
      console.log(basicstats)
      median(cols)
      work.terminate()
       
 
    }


}

function median(cols:Array<any>){
    const work = new Worker("./workers/statsWorker.js")
    work.postMessage({type: "med", data: cols})

    work.onmessage = e => {
        e.data.unshift("median")
        basicstats.push(e.data)
        console.log(basicstats)
        range(cols)
        work.terminate()

    }

}

function range(cols:Array<any>){
    const work = new Worker("./workers/statsWorker.js")
    work.postMessage({type: "range", data: cols})


    work.onmessage = e => {
        e.data.unshift("range")
        basicstats.push(e.data)
        console.log(basicstats)
       variance(cols)
       work.terminate()

    }
}

function variance(cols:Array<number>){
    // const work = new Worker("./workers/statsWorker.js")
    // work.postMessage({type: "variance", data: cols})
    std(cols)
    // work.onmessage = e => {
    //     // e.data.unshift("variance")
    //     // basicstats.push(e.data)
    //     // console.log(basicstats)
    //     std(cols)
    //     work.terminate()
    // }
}

function std(cols:Array<number>){
    const work = new Worker("./workers/statsWorker.js")
    work.postMessage({type: "std", data: cols})
    
    work.onmessage = e => {
        e.data.unshift("std")
        basicstats.push(e.data)
        header.unshift(' ')
        console.table(header)
        console.table(basicstats)
         meta = undefined
         key= undefined
         nums = []
        work.terminate()
    }
}