export function isNumber(val:string){

   
    
    if(Number(val)){
        return true
     }
     return false  

}

export function isDate(val:string){
    let x = new Date(val)
    if(x instanceof Date && !isNaN(x)){
      return true 
    } 
    else{
        return false
    }
   
}

export function counter(arr:Array<any>){
    let count:Record<any, any> = {}
    
     arr.forEach((val)=> {
        let str = val
        // if(typeof val !== "string"){
        //    str = val.toString()
        // }
         
         if(count[str]){
             count[str]++ 
         }
         else {
             count[str] = 1
         }
     })
   
     return count
   }


   export const createChannel = () => {
    let takes:Array<any> = []
    let puts:Array<any> = []
 
     return {
       put(data:any) {
        return new Promise(resolvePut => {
            if(takes.length > 0){
                takes.shift()(data)
                resolvePut()
            }else {
                puts.push(()=> {
                    resolvePut()
                    return data
                })
            }
        })
 
 
       },
       take(){
 
         return new Promise(resolveTake => {
             if(puts.length > 0){
                 resolveTake(puts.shift()())
             }
             else {
                 takes.push(resolveTake)
             }
         })
       }
 
     }
 }