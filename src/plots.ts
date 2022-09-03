import {Chart, BarController, CategoryScale, LinearScale, BarElement,
ScatterController, PointElement, LineElement} from "chart.js"
import {getCol, range, zipToObj} from "./mainHelpers"

Chart.register(BarController, CategoryScale, LinearScale, BarElement, ScatterController, PointElement, LineElement)
// console.log(Chart)
// one dimensional

let barChart:any  = undefined
let scatter = []

let el:HTMLDivElement = undefined

export function make_histogram(data:Array<any>, bucket_size:number){
      return new Promise((resolve,reject)=> {
           const work = new Worker(new URL('./workers/plotWorker.js', import.meta.url),  {type: 'module'})

           work.postMessage({type: "hist", points:data, size: bucket_size})

        work.onmessage = e => {
            if(e.data.status === "fail"){
                reject(e.data.reason)
            }
            else{
                resolve(e.data.hist)
            }
        }
      })

}


export async function plot_histogram(bucket_size:number, title:any ="", data:Array<any>){
    // console.log(data)
    if(barChart){
        barChart.destroy()
    }
    
     let histogram = await make_histogram(data, bucket_size)
     const x = Object.keys(histogram)
     const y = Object.values(histogram)
 
    //  console.log(x, y)
     const dataObj = {
         labels: x,
         datasets: [
                 {
                     label: title,
                     data: y,
                     
                 }
             ]
         }
 
        //  console.log(new Chart("hist", {type: "bar", data: dataObj}));

        let c = document.createElement("canvas")
        c.width = 100
        c.height = 100
        c.id = "h"
        let div:HTMLDivElement = document.createElement("div")
        div.style.width = "600px"
        div.style.height = "600px"
        div.className = "hist"
      
        div.appendChild(c)
        document.body.appendChild(div)
        // document.getElementById("har")?.appendChild(c)
        barChart =   new Chart(c.id, {type: "bar", data: dataObj});
      
      
}


// chart matrix 

export function make_scatter_matrix(elementId:string){
     const data:Array<any> = this.Pdata.data
    const num_columns = data[0].length
        el = document.createElement("div")
        el.id = "scatter"  
        el.style.display = "grid"
        let str = ""
        for(let _ of range(num_columns)){
            str += " 1fr"
        }
        console.log(str)
        el.style.gridTemplateColumns = str
       document.body.appendChild(el)
     
    while(scatter.length !== 0){
        let obj = scatter.pop()
        obj.destroy()
    }

    for(let i of range(num_columns)){
        for(let j of range(num_columns)){
             make_scatter_chart(getCol(data, i), getCol(data, j), i , j, elementId)
        }
    }

}

function make_scatter_chart(x:Array<any>, y:Array<any>, i:number, j:number, elementId:string){

 

  

    const dataObj = {
        datasets: [
        {
            data: zipToObj(x,y),
            label: `${i} ${j}`,
            pointRadius: 4,
            backgroundColor: 'blue'
        }
      ]
    }

    const chartObj = {
        type: "scatter",
        data: dataObj,
            options: { 
                legend: {
                display: false
                },
            }
        };


    const c = document.createElement("canvas")
    c.width = 50
    c.height = 50

    c.id = i.toString() + j
    let div:HTMLDivElement = document.createElement("div")
    div.style.width = "200px"
    div.style.height = "200px"

    div.appendChild(c)
    el?.appendChild(div)

    scatter.push(new Chart(c, chartObj))



}


let two:any = undefined
export function twoD(xs:Array<any>,colors:Array<any>, ...ys:Array<any>){
    if(two){
        two.destroy()
    }
    let points:Array<any> = []

    ys.forEach((ys1)=> {
        points.push(zipToObj(xs, ys1))
    })


    const dataObj = {
        datasets: [
     
      ]
    }
      let colors_:boolean = false
     if(colors.length !== 0 ){
       colors_ = true
     }
    points.forEach((val, index)=> {

        let color = "blue"
         if(colors_ && colors[index]){
             color = colors[index]
         }
         else{
             color = "blue"
         }
       let ob =  {
            data: val,
            pointRadius: 4,
            backgroundColor:  color
        }

        dataObj.datasets.push(ob)



    })


    let c = document.createElement("canvas")

    c.width = 600
    c.height = 600
    c.id = "2D"
    let div:HTMLDivElement = document.createElement("div")
    div.style.width = "600px"
    div.style.height = "600px"
    div.classList.add("twoD")

    div.appendChild(c)

    document.body.appendChild(div)
    const chartObj = {
        type: "scatter",
        data: dataObj,
            options: { 
                legend: {
                display: false
                },
            }
        };


        two = new Chart("2D", chartObj)


}