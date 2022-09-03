export function getCol(data:Array<any>, i:number){
    let col:Array<any> = []

    data.forEach((arr)=> {
        col.push(arr[i])
    })

    return col
}

export function range(n:number, end:number | undefined = undefined, step:number| undefined = undefined){
    let i = 0 
    let j = n
    let m = 1

    if(end)
      j = end; i = n;
    if(step)
        m = step
    
   
    return  {
        [Symbol.iterator]:() => {

            return{
                next(){
               
                  
                    while(i !== j){
                        let temp = i
                        i + m

                        return {
                            value: temp, 
                            done: false
                        }
                    }
                    
                  return {done: true}
                }
        
            }

           
        }
    } 


}

export function zipToObj(arr1:Array<any>, arr2:Array<any>){
    let zipped = []
   for(let i = 0; i < arr1.length; i++){
       let key = arr1[i]
      zipped.push({  x:key,y:arr2[i]})
   }
return zipped
}