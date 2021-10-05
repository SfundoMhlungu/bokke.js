import {counter} from "./helpers"

/**
 * 
 * Most code here is adapted from the Book: Data Science from 
 *  Scratch written in python
 */

self.onmessage = e => {
    if(e.data.type === "hist"){

        
        make_histogram( e.data.points, e.data.size)
    }
}

function bucketize(point:number, bucket_size:number){
        
    return bucket_size * Math.floor(point/bucket_size)
}


function make_histogram(points:Array<any>, bucket_size:number){

    try {
        points.forEach((point:number, index: number)=> {
            points[index] = bucketize(point, bucket_size)
        })
    
       let p =  counter(points)
        console.log(p)
       self.postMessage({status: "", hist: p})
    } catch (error) {
        self.postMessage({status: "fail", reason: error})
    }
   

}


