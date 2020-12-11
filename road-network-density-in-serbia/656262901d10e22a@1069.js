// https://observablehq.com/@geoanaliticari/road-network-density-in-serbia@1069
import define1 from "./e93997d5089d7165@2286.js";
import define2 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Hipso_class_Serbia_3.json",new URL("./files/a035f6a8ba50c52a4a30e75c667993a3ae44f4e8f25a369d7e734fb407c0725a3a768e608f27a797db563558dd5f83f164871d4d1a020e1820b0dfac0bde401c",import.meta.url)],["Network_density.json",new URL("./files/c28d46fecc2f1caf6d8d336baf32e5de2e483d5bd410a89acd054dc60888414c3f5f76bef2459140e996e55c84503e826513c44c36c46ca7e51a90723a32ecb0",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Road Network Density in Serbia`
)});
  main.variable(observer("intro")).define("intro", ["md"], function(md){return(
md`For more info about this indicator and how data is obtained, visit [Gustina putne mreže](https://depopulacija.rs/282c7f115d5a425a8934a4006687c393).`
)});
  main.variable(observer("guide")).define("guide", ["html"], function(html){return(
html`<span style="background-color:#FCF3CF">&darr; Choose a municipality, then scroll down to explore data  &darr;</span>`
)});
  main.variable(observer("map")).define("map", ["d3","opstine","DOM","mutable selected","naselja","color","municipalitiesWithoutData"], function(d3,opstine,DOM,$0,naselja,color,municipalitiesWithoutData)
{
  const width = 600
  const projection = d3.geoIdentity()
    .reflectY(true)
    .fitWidth(width, opstine)
  const path = d3.geoPath(projection)
  const height = Math.ceil(path.bounds(opstine)[1][1]);  
  
  let svg = d3.select(DOM.svg(width, height));
 
  const tooltip = d3.select("body").append("div")
    .style('position', 'absolute')  
    .style('text-align', 'start')    
    .style('width', 60)    
    .style('height', 30)   
    .style('font', '12px sans-serif')
    .style("opacity", 100)
    .style('border-radius', '8px')
    .style('background', '#000')
    .style('pointer-events', 'none')
    .style('padding','5px')
    .style("color", "#fff");
  
  function click(d) {
    $0.value = d.properties;
  }
  
  svg.append('g')
    .selectAll('path')
    .data(naselja.features)
    .enter()
    .append('path')
    .attr('d', path)    
    .attr('fill', d => color(d.properties["Traff_Key"]));
  
  svg.append('g')
    .selectAll('path')
    .data(opstine.features)
    .enter()
    .append('path')
      .attr('fill', d => { 
        return municipalitiesWithoutData.includes(d.properties["MATBRO"]) ? color(6) : 'white'
      })
      .attr('fill-opacity', d => {
        return municipalitiesWithoutData.includes(d.properties["MATBRO"]) ? '1' : '0'
      })
      .attr('stroke', 'black')
      .attr('stroke-width', '0.3px')
      .attr('d', path)
        .on('click', click)
        .on('mouseover', function(d) {
          d3.select(this)
            .classed('active', true);
          tooltip.html(d.properties.Naziv_lati)
            .style("visibility", "visible")
            .style("left", (d3.event.pageX ) + "px")
            .style("top", (d3.event.pageY -20) + "px");     
        })
        .on("mouseout",function(d){
          d3.select(this)
            .classed("active", false)
          tooltip.style("visibility", "hidden")
        })


  return svg.node();
}
);
  main.variable(observer("intro_1")).define("intro_1", ["md","i18n","selected"], function(md,i18n,selected){return(
md`### ${i18n("Data for Municipality")}: ${selected.Naziv_lati}`
)});
  main.variable(observer("legend_1")).define("legend_1", ["swatches","d3","i18n","color_chart_0"], function(swatches,d3,i18n,color_chart_0){return(
swatches({
  color: d3.scaleOrdinal(
    [
      `${i18n("Low Road Density with Population Decline")}`,
      `${i18n('Low Road Density with Population Growth')}`,
      `${i18n('High Road Density with Population Decline')}`,
      `${i18n('High Road Density with Population Growth')}`,
      `${i18n('No Permanent Inhabitants')}`,
      `${i18n('No Data')}`
    ],
    color_chart_0.range()
  ),
  columns: "240px"
})
)});
  main.variable(observer("chart_0")).define("chart_0", ["data","md","i18n","d3","margin","width","height","color_chart_0"], function(data,md,i18n,d3,margin,width,height,color_chart_0)
{
  if (data.length === 0) {
    return md`_${i18n('Unfortunately no data')} :(_`;
  }
  const sort = "Area";

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d[sort])])
    .rangeRound([margin.left, width - margin.right]);

  const y = d3
    .scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")
    .selectAll("rect")
    .data(data.sort((a, b) => d3.descending(a[sort], b[sort])))
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d, i) => y(i))
    .attr("fill", d => color_chart_0(d["Traff_Key"]))
    .attr("width", d => x(d[sort]) - x(0))
    .attr("height", y.bandwidth());

  svg
    .append("g")
    .attr("fill", "white")
    .attr("text-anchor", "end")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .selectAll("text")
    .data(data)
    .join("text")
    .attr("x", d => x(d[sort]))
    .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("dx", -4)
    .text(d => d3.format(".1f")(d[sort]))
    .call(text =>
      text
        .filter(d => x(d[sort]) - x(0) < 25) // short bars
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start")
    )
    .call(text =>
      text
        .filter(d => d["Traff_Key"] == 1) // light bars
        .attr("fill", "grey")
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove());

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickFormat(i => data[i].ImeNasLat)
        .tickSizeOuter(0)
    );

  svg
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("font-weight", "bold")
    .attr("y", 10)
    .attr("x", margin.left)
    .text(`${i18n("Settlement Area")} [km2]`);

  return svg.node();
}
);
  main.variable(observer("viewof sort")).define("viewof sort", ["radio","i18n"], function(radio,i18n){return(
radio({
  options: [
    { label: `${i18n("Road Network Density")}`, value: "DENS" },
    { label: `${i18n("Road Network Length")}`, value: "LEN" }
  ],
  value: "DENS"
})
)});
  main.variable(observer("sort")).define("sort", ["Generators", "viewof sort"], (G, _) => G.input(_));
  main.variable(observer("legend_2")).define("legend_2", ["swatches","d3","i18n","color_chart"], function(swatches,d3,i18n,color_chart){return(
swatches({
  color: d3.scaleOrdinal(
    [
      `${i18n("Motorway")}`,
      `${i18n('Trunk')}`,
      `${i18n('Primary')}`,
      `${i18n('Secondary')}`,
      `${i18n('Tertiary')}`
    ],
    color_chart.range()
  )
})
)});
  main.variable(observer("chart")).define("chart", ["data","md","d3","width","height","series","color_chart","x","y","sort","xAxis","yAxis","margin","i18n","config"], function(data,md,d3,width,height,series,color_chart,x,y,sort,xAxis,yAxis,margin,i18n,config)
{
  if (data.length === 0) {
    return md`_No data unfortunatelly :(_`;
  }

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color_chart(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("y", (d, i) => y(d.data.ImeNasLat))
    .attr("height", y.bandwidth())
    .append("title")
    .text(d => `${d.key}: ${d.data[sort][d.key]}`);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  const yTitle = g =>
    g
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("font-weight", "bold")
      .attr("y", 10)
      .attr("x", margin.left)
      .text(`${i18n(config[sort].label)} ${config[sort].unit}`);

  svg.call(yTitle);

  return svg.node();
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`<hr/>`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Appendix

This is just code, stop here if you're not interested :)`
)});
  main.variable(observer("locale")).define("locale", ["URLSearchParams","location"], function(URLSearchParams,location){return(
new URLSearchParams(location.search).get('lang')
)});
  main.variable(observer("i18n")).define("i18n", ["locale","dict"], function(locale,dict){return(
function i18n(key) {
  return locale == "sr" ? dict[key] : key;
}
)});
  main.variable(observer("dict")).define("dict", function(){return(
{
  "Low Road Density with Population Decline":
    "Mala gustina putne mreže sa populacionim padom",
  "Low Road Density with Population Growth":
    "Mala gustina putne mreže sa populacionim porastom",
  "High Road Density with Population Decline":
    "Velika gustina putne mreže sa populacionim padom",
  "High Road Density with Population Growth":
    "Velika gustina putne mreže sa populacionim porastom",
  "No Permanent Inhabitants": "Nema stalnih stanovnika",
  "No Data": "Nema podataka",
  "Road Network Density": "Gustina putne mreže",
  "Road Network Length": "Dužina putne mreže",
  "Road Category": "Kategorije puteva",
  Motorway: "Autoput",
  Trunk: "Obilazni putevi",
  Primary: "Putevi prvog reda",
  Secondary: "Putevi drugog reda",
  Tertiary: "Putevi trećeg reda",
  "Settlement Area": "Površina naselja",
  "Data for Municipality": "Podaci za opštinu",
  "Unfortunately no data": "Nažalost, nema podataka"
}
)});
  main.variable(observer("series")).define("series", ["d3","config","sort","data"], function(d3,config,sort,data){return(
d3.stack()
  .keys(config[sort].ranges)
  .value((d, key) => d[sort][key])
  (data)
    .map(d => (d.forEach(v => v.key = d.key), d))
)});
  main.variable(observer("data")).define("data", ["naselja_data","selected","d3","sort"], function(naselja_data,selected,d3,sort){return(
naselja_data.filter(i => i.MatBrO == selected.MATBRO)
  .sort((a, b) => d3.descending(a[sort].sum, b[sort].sum))
)});
  main.variable(observer("x")).define("x", ["d3","series","margin","width"], function(d3,series,margin,width){return(
d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scaleBand()
    .domain(data.map(d => d.ImeNasLat))
    .range([margin.top, height - margin.bottom])
    .padding(0.1)
)});
  main.variable(observer("xAxis")).define("xAxis", ["margin","d3","x","width"], function(margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], function(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 34, right: 30, bottom: 30, left: 120}
)});
  main.variable(observer("barHeight")).define("barHeight", function(){return(
18
)});
  main.variable(observer("width")).define("width", function(){return(
960
)});
  main.variable(observer("height")).define("height", ["data","barHeight","margin"], function(data,barHeight,margin){return(
Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain([1, 2, 3, 4, 5, 6])
  .range(["#f92018", "#c11235", "#feed4b", "#ff9633", "#eee", "#aaaaaa"])
)});
  main.variable(observer("color_chart_0")).define("color_chart_0", ["d3"], function(d3){return(
d3.scaleOrdinal(
  [1, 2, 3, 4, 5, 6],
  ['#feed4b', '#ff9633', '#f92018', '#c11235', '#eee', '#aaaaaa']
)
)});
  main.variable(observer("color_chart")).define("color_chart", ["d3","config","sort"], function(d3,config,sort){return(
d3.scaleOrdinal()
    .domain(config[sort].ranges)
    .range(config[sort].colorScheme)
    .unknown("#ccc")
)});
  main.variable(observer("naselja")).define("naselja", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Network_density.json').json()
)});
  main.variable(observer("naselja_data")).define("naselja_data", ["naselja","config","sort"], function(naselja,config,sort){return(
naselja.features
  .map(d => d.properties)
  .map(d => {
    Object.keys(config).forEach(key => {
      const obj = {}
      config[key].keys.forEach((k,i) => {
        if(d[k] !== -99999 || d[k] !== -9999) {
          obj[config[sort].ranges[i]] = d[k]
        }
      })
      obj.sum = d[key + "_All"]
      d[key] = obj
    })
    return d
  })
)});
  main.variable(observer("opstine")).define("opstine", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Hipso_class_Serbia_3.json').json()
)});
  main.variable(observer("municipalitiesWithoutData")).define("municipalitiesWithoutData", function(){return(
[ 90026, 90093, 90352, 90336, 90328, 90115, 90255, 90018, 90301, 90310, 90280, 90212, 90085, 90042, 90166, 90182, 90069, 90131, 90123, 90034, 90140, 90204, 90263, 90239, 90271, 90298, 90247, 90158, 90107 ]
)});
  main.define("initial selected", function(){return(
undefined
)});
  main.variable(observer("mutable selected")).define("mutable selected", ["Mutable", "initial selected"], (M, _) => new M(_));
  main.variable(observer("selected")).define("selected", ["mutable selected"], _ => _.generator);
  main.variable(observer("config")).define("config", ["d3"], function(d3){return(
{
  DENS: {
    label: "Road Network Density",
    unit: "[km/km2]",
    keys: ["DENS_Moto", "DENS_Trunk", "DENS_Prim", "DENS_Sec", "DENS_Tert"],
    ranges: ["Motorway", "Trunk", "Primary", "Secondary", "Tertiary"],
    colorScheme: d3.schemeSpectral[5]
  },
  LEN: {
    label: "Road Network Length",
    unit: "[km]",
    keys: ["LEN_Moto", "LEN_Trunk", "LEN_Prim", "LEN_Sec", "LEN_Tert"],
    ranges: ["Motorway", "Trunk", "Primary", "Secondary", "Tertiary"],
    colorScheme: d3.schemeSpectral[5]
  }
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  main.import("swatches", child2);
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
  path {
    stroke-linejoin: round;
  }
  path.active {
    fill-opacity: 0.4;
    cursor: pointer;
  }
  circle.active {
    cursor: help;
  }
  .svg-tooltip {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple   Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background: rgba(69,77,93,.9);
    border-radius: .1rem;
    color: #fff;
    display: block;
    font-size: 14px;
    max-width: 320px;
    padding: .2rem .4rem;
    position: absolute;
    text-overflow: ellipsis;
    white-space: pre;
    z-index: 300;
    visibility: hidden;
  }
</style>`
)});
  return main;
}
