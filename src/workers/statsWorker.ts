
self.onmessage = e => {
    if(e.data.type === 'mean'){
        console.log(e.data.data)
        let meanCols = []
        e.data.data.forEach((arr)=> {
         meanCols.push(mean(arr))
        })
       self.postMessage(meanCols)
    }
    else if(e.data.type === "med"){
        let medCols:Array<any> = []
        e.data.data.forEach((arr:Array<number>, index:number)=> {
            medCols.push(median(arr))
        })
        self.postMessage(medCols)
    }
    else if(e.data.type === "range"){
        let rangeCols:Array<any> = []
        e.data.data.forEach((arr:Array<number>)=> {
            rangeCols.push(range(arr))
        }) 
        self.postMessage(rangeCols)
    }
    else if(e.data.type === "variance"){
        let varianceCols:Array<any> = []
        
        e.data.data.forEach((arr:Array<number>)=> {
            varianceCols.push(variance(arr))
        })
        self.postMessage(varianceCols)
    }
    else if(e.data.type === "std"){
        let std:Array<any> = []
        e.data.data.forEach((arr:Array<any>)=> {
            std.push(standardDeviation(arr))
        })
        self.postMessage(std)
    }
}


function sum(data:Array<number>){
    return data.reduce((prev, curr)=> {
      
        return +prev + +curr
    })
}

function mean(data: Array<number>){
       return sum(data)/data.length
}

function median(data:Array<number>){
    const sorted = data.sort((a, b)=> a - b)
    const mid = Math.round(sorted.length/2)
   
    if (mid % 2 === 0){
       return sorted[mid]
    }else{
        return (sorted[mid -1] + sorted[mid])/2
    }
}

function range(data:Array<number>){
    
    return Math.max(...data) - Math.min(...data)
 }

 
function de_mean(data:Array<number>){
    let m = mean(data)
   
   return data.map((val)=> val - m)
   
}

function dot_product(v:Array<number>,w:Array<number>){
    let sum:Array<number> = []
     v.forEach((val, index)=> {
        sum[index] = val * w[index]
     })
    //  console.log(sum)
   return sum.reduce((prev, curr)=> {
         return prev + curr
     })
}

function sum_of_squares(v:Array<number>){

    return dot_product(v, v)
}

function variance(data:Array<number>){
    const n = data.length
    const deviations = de_mean(data)
  
   
    return sum_of_squares(deviations)/(n-1)
}

function standardDeviation(data:Array<number>){
    return Math.sqrt(variance(data))
}