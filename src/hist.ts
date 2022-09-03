import {make_histogram} from "./plots"

export default class Hist {
     histObj:Record<any, any> = {}
     x:any = undefined
     y:Array<any> = undefined
     type:string = "Hist"

       constructor(bin:number, data:Array<any>){
     make_histogram(data, bin).then((hist)=> {

        this.histObj = hist
         this.x = Object.keys(hist)
         this.y = Object.values(hist)
       })
    }

    freq(n:any){
        if(this.histObj[n]){
            return this.histObj[n]
        }else{
            throw new Error(`${n} does not exist`)
        }

    }
    
    largest(n){
      let sorted:Array<any> = JSON.parse(JSON.stringify(this.x))
      
       return sorted.sort((a, b)=> +a- +b).slice(-n)
    }

    smallest(n){
        let sorted:Array<any> = JSON.parse(JSON.stringify(this.x))
        return sorted.sort((a, b)=>+a- +b ).slice(0, n)
    }




}