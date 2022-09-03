import {Chart, BarController, CategoryScale, LinearScale, BarElement,
    ScatterController, PointElement, LineElement} from "chart.js"

    
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, ScatterController, PointElement, LineElement)


export default class Plot{
  
    static barChart: any
 
   

    static Hist(colors:Array<any>,...bars){

        if(this.barChart){
            this.barChart.destroy()
        }

        const dataObj = {
            labels: undefined,
            datasets: [
                    // {
                    //     label: title,
                    //     data: y,
                        
                    // }
                ]
            }

        if(bars[0].type){
          // hists
          bars.forEach((val, index)=> {
              
              const y = Object.values(val.histObj)

              if(!dataObj.labels){
                const x = Object.keys(val.histObj)
                dataObj.labels = x
              }

              dataObj.datasets.push({
                     label: "",
                     backgroundColor: colors[index],
                     data: y
                })
           

          })

        }else if(typeof bars[0] === "object"){
                // objects

        }
        else{
            throw new Error("Not implemented");
            
        }

      
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

       this.barChart =  new Chart(c.id, {type: "bar", data: dataObj});



    }

}