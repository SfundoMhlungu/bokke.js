// let rowCache = new Map<any, Array<any>>()
import {isDate, isNumber, counter, createChannel} from "./helpers"



self.onmessage = e => {


    let returned = []
    let index = e.data.length
    for(const str of e.data){
        let splitted = str.split(",")
        // if(!rowCache.get(index)){
        //     rowCache.set(index, Array(splitted.length))
          
        // }
        splitted[splitted.length - 1] = splitted[splitted.length -1].replace("\r", "")
        // for(let i = 0; i < splitted.length; i++){

         
        //     const val = splitted[i]
            
        //     if(isNumber(val)){
             
        //         splitted[i] = Number(val)
               
        //       }
        //       else if(isDate(val)){
        //           splitted[i] = new Date(val)
                  



        //       }
        //       else{
             
               
        //         if(val.length === 0){
        //             splitted[i] = NaN
                   
        //         }

        //       }
              
         
            
       
            
        // }
        returned.push(splitted)
     
        index++
    }

    self.postMessage({data: returned})


}