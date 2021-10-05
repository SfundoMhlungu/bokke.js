import Frame from "./frame"


let tableReadyCallback:(frame: Frame)=> {}

export default function dataFrame(file:any, tableReady:any, headers:Array<any> = []){

    if(typeof file === "object"){
      readFile(file, headers)
      tableReadyCallback = tableReady


    }
    else if(typeof file === "string"){
        // url

        fetchFile(file)
    }
    

}

function readFile(file, headers:Array<any>){
    const work = new Worker("./workers/worker.js")
 
    let reader = new FileReader()
    reader.readAsText(file.files[0])

    reader.onloadend = (e) => {
           let str = e?.currentTarget?.result
    
           work.postMessage({data:str.split("\n"), headers})
           
    }

    work.onmessage = e => {

        // console.log("terminating worker", e.data)
          toTable(e.data)
          work.terminate()
        //   console.log("terminating worker")
    }


}

async function fetchFile(url){
  
}


function toTable(data:Record<any, any>){
    // do everthing here to dereference [[]]
    // console.log(data)
    data.notNeeded = false
    const work = new Worker("./workers/tableworker.js")
     work.postMessage({data: data})

     work.onmessage = e => {
         let frame = new Frame(e.data, data)
        //  console.log(frame)
         tableReadyCallback(frame)



        work.terminate()
     }

}


