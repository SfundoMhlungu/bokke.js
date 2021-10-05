import wabt from "wabt"

console.log(wabt)

const mem = new WebAssembly.Memory({initial: 1})

let initialMem = mem.buffer.byteLength


self.onmessage = e => {
    // console.log(e.data)

  handleData(e.data)

}



async function  handleData(data:Record<any, any>){
    const importObject = {
        env: {
            mem
        }
    }
   let src = await wabt()
   console.log(src)


    let datalen = data.data.mid * 2
    // let wasm = await addstr()
    // let buffer = await wasm.arrayBuffer()
    // let mod = await WebAssembly.instantiate(wasm, importObject)
    // console.log(wasm.instance.exports)

    while(datalen > initialMem){
        growMem()
    }

    let view = new Uint8Array(mem.buffer)
    let base = 0
    let rowLen = 0
    let outindex = 0
    data.data.forEach((val:any, index:any)=> {
        let cache:Array<any> = []
        let internalStride = 0
      

        if(index < data.mid){
            cache = data.firstCache.get(index)
        }
        else{
            cache = data.secondCache.get(index)
        }
         val.forEach((val_:any, index2:any) => {
             let len:any = +cache[index2]
             len = len.toString(16) 

             const fullstr =  val_  + "\0o"

             let encoded = new TextEncoder("utf8").encode(fullstr)
            //  console.log(encoded, new TextDecoder("utf8").decode(encoded))
             
             let start =  outindex.toString()
             encoded.forEach((val, index)=> {
                 view[outindex] = val
                 outindex++

                 
             })
             let end = encoded.byteLength.toString()
             rowLen += encoded.byteLength
            //  outindex++
             
             
            // view.set(encoded)
            if(index < data.mid){
                data.firstCache.get(index)[index2] = start+ ","+end
            }
            else{
               
                data.secondCache.get(index)[index2] = start+","+end
    
            }
    
             
         })
         if(index < data.mid){
            data.firstCache.get(index).push([base, rowLen])
        }
        else{
           
            data.secondCache.get(index).push([base, rowLen])

        }

        base += rowLen
        rowLen = 0
    })




for(let i = 0; i < 13; i++){
    let c = data.firstCache.get(i)
    let [start, end] = c[c.length-1]
    console.log(+start, +end)
    const row = new Uint8Array(mem.buffer, +start, +end)
    console.log("row: ", i , " ", new TextDecoder("utf8").decode(row).split("\0o"))
}



}

function growMem(){
    mem.grow(1)

    initialMem = mem.buffer.byteLength
    console.log(initialMem, "buffer increased")
}