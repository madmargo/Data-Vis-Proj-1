let dataurl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

let data
let values = []
let w = 800
let h = 600
let padding = 40
let xLabel
let yLabel
let scaleXAxis
let scaleYAxis

let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr("width", w)
    svg.attr("height", h)
}

let makeScales = () => {
    xLabel = d3.scaleLinear()
               .domain([0, values.length - 1])
               .range([padding, w - padding])
    yLabel = d3.scaleLinear()
               .domain([0, d3.max(values, (d) => d[1])])
               .range([0, h - (2 * padding)])
    let yearLabel = values.map((d) => new Date(d[0]))
    scaleXAxis = d3.scaleTime()
                   .domain([d3.min(yearLabel), d3.max(yearLabel)])
                   .range([padding, (w - padding)])
    scaleYAxis = d3.scaleLinear()
                   .domain([0, d3.max(values, (d) => d[1])])
                   .range([h - padding, padding])
}

let makeAxis = () => {
    let xAxis = d3.axisBottom(scaleXAxis)
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + (h - padding) + ")")

    let yAxis = d3.axisLeft(scaleYAxis)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
} 

let makeBars = () => {
    svg.selectAll('rect')
       .data(values)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('width', (w - (2 * padding)) / values.length)
       .attr('height', (d) => h - padding - scaleYAxis(d[1]))
       .attr('data-date', (d) => d[0])
       .attr('data-gdp', (d) => d[1])
       .attr('x', (d, i) => xLabel(i))
       .attr('y', (d) => scaleYAxis(d[1]))
       .attr('fill', 'black')
       .on('mouseover', function(event, d) {
        svg.append('text')
           .attr('id', 'tooltip')
           .attr('x', scaleXAxis(new Date(d[0])))
           .attr('y', scaleYAxis(d[1]) - 10)
           .attr('text-anchor', 'end')
           .attr('font-size', '25px')
           .attr('data-date', d[0])
           .text(d[1])
       })
       .on('mouseout', function() {
        svg.select('#tooltip').remove()
       })
    }

const req = new XMLHttpRequest()
req.open("GET", dataurl, true)
req.onload = function(){
    data = JSON.parse(this.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    makeScales()
    makeAxis()
    makeBars()
}
req.send();
