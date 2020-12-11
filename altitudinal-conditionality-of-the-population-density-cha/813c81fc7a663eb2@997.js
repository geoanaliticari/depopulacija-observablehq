// https://observablehq.com/@geoanaliticari/altitudinal-conditionality-of-the-population-density-cha@997
import define1 from "./e93997d5089d7165@2286.js";
import define2 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Hipso_class_Serbia_3.json",new URL("./files/a035f6a8ba50c52a4a30e75c667993a3ae44f4e8f25a369d7e734fb407c0725a3a768e608f27a797db563558dd5f83f164871d4d1a020e1820b0dfac0bde401c",import.meta.url)],["Altitudinal_Conditionality_with_Elevation.json",new URL("./files/6b24d48928d27781df52b94c4092de15feabbb7327b62a4ef0b3617fbf1aa219f5abc5df07fd06202e0739d0179d6546f848c5098f87d0c742b7a8473fb7672a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Altitudinal Conditionality of the Population Density’ Changes in Serbia`
)});
  main.variable(observer("intro")).define("intro", ["md"], function(md){return(
md`For more info about this indicator and how data is obtained, visit [Promena gustine naseljenosti po visinskim pojasevima](https://depopulacija.rs/b5f8e5916408444ebf727655b46bd962).`
)});
  main.variable(observer("guide")).define("guide", ["html"], function(html){return(
html`<span style="background-color:#FCF3CF">&darr; Choose a municipality, then scroll down to explore data  &darr;</span>`
)});
  main.variable(observer("map")).define("map", ["d3","opstine","DOM","naseljaGeo","colorMap","mutable selected"], function(d3,opstine,DOM,naseljaGeo,colorMap,$0)
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
    .style("color", "#fff")
  
  svg.append('g')
    .selectAll('path')
    .data(naseljaGeo.features)
    .enter()
    .append('path')
    .attr('d', path)    
    .attr('fill', d => colorMap(d.properties["Mean_ELEV"]))
  
  svg.append('g')
    .selectAll('path')
    .data(opstine.features)
    .enter()
    .append('path')
    .attr('fill', 'white')
    .attr('fill-opacity', '0')
    .attr('stroke', 'black')
    .attr('stroke-width', '0.3px')
    .attr('d', path)
      .on('click', d => { $0.value = d.properties })
      .on('mouseover', function(d){
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
      });

  return svg.node();
}
);
  main.variable(observer("viewof sort")).define("viewof sort", ["radio","i18n"], function(radio,i18n){return(
radio({
  options: [
    { label: `${i18n("hypso_struct")}`, value: "AREA" },
    { label: `${i18n("pop_count")}`, value: "POP" },
    { label: `${i18n("pop_dens")}`, value: "DENS" }
  ],
  value: "AREA"
})
)});
  main.variable(observer("sort")).define("sort", ["Generators", "viewof sort"], (G, _) => G.input(_));
  main.variable(observer("intro_1")).define("intro_1", ["md","i18n","selected"], function(md,i18n,selected){return(
md`### ${i18n("data_for_municipality")}: ${selected.Naziv_lati}`
)});
  main.variable(observer("legend_1")).define("legend_1", ["legend","color","i18n"], function(legend,color,i18n){return(
legend({
  color: color,
  title: `${i18n("alt_zones")}`,
  tickSize: 0
})
)});
  main.variable(observer("chart")).define("chart", ["data","md","i18n","d3","width","height","series","color","x","y","sort","xAxis","yAxis"], function(data,md,i18n,d3,width,height,series,color,x,y,sort,xAxis,yAxis)
{
  if (data.length === 0) {
    return md`_${i18n("no_data")} :(_`;
  }
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", (d, i) => y(d.data.ImeNasLat))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth())
    .append("title")
    .text(d => `${d.key}: ${d.data[sort][d.key]}`);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

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
  var i = locale == "sr" ? 1 : 0;
  return dict[key][i];
}
)});
  main.variable(observer("dict")).define("dict", function(){return(
{
  hypso_struct: [
    "Hypsometric Structure (km2)",
    "Hipsometrijska struktura (km2)"
  ],
  pop_count: [
    "Population Count by Hypsometric Zones",
    "Broj stanovnika po visinskim zonama"
  ],
  pop_dens: [
    "Population Density by Hypsometric Zones (inh./km2)",
    "Gustina naseljenosti po visinskim zonama (st./km2)"
  ],
  alt_zones: ["Altitudinal zones", "Visinske zone"],
  data_for_municipality: ["Data for Municipality", "Podaci za opštinu"],
  no_data: ["Unfortunately no data :(", "Nažalost, nema podataka"]
}
)});
  main.variable(observer("series")).define("series", ["d3","config","sort","data"], function(d3,config,sort,data){return(
d3.stack()
  .keys(config[sort].ranges)
  .value((d, key) => d[sort][key])
  (data)
    .map(d => (d.forEach(v => v.key = d.key), d))
)});
  main.variable(observer("data")).define("data", ["naselja","selected","sort","d3"], function(naselja,selected,sort,d3){return(
naselja
  .filter(i => i.MatBrO == selected.MATBRO)
  .filter(d => d[sort]["<200"] != -99999)
  .sort((a, b) => d3.descending(a[sort].sum, b[sort].sum))
)});
  main.variable(observer("format")).define("format", ["x","data"], function(x,data){return(
x.tickFormat(20, data.format)
)});
  main.variable(observer("x")).define("x", ["config","sort","d3","series","margin","width"], function(config,sort,d3,series,margin,width){return(
config[sort].scale
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scaleBand()
    .domain(data.map(d => d.ImeNasLat))
    .range([margin.top, height - margin.bottom])
    .padding(0.08)
)});
  main.variable(observer("xAxis")).define("xAxis", ["margin","d3","x"], function(margin,d3,x){return(
g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x))
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
  main.variable(observer("color")).define("color", ["d3","series"], function(d3,series){return(
d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(["#99d594", "#e6f598", "#fee08b", "#fc8d59", "#d53e4f", "grey"]) // reversed spectral scheme
    .unknown("#ccc")
)});
  main.variable(observer("colorMap")).define("colorMap", ["d3","domain"], function(d3,domain){return(
d3.scaleSequential()
    .domain(domain)
    .interpolator(d3.interpolateRgbBasis(["darkseagreen", "yellow", "crimson", "grey"]))
)});
  main.variable(observer("domain")).define("domain", ["naselja"], function(naselja){return(
[0, Math.max(...naselja.map(f => f["Mean_ELEV"]))]
)});
  main.variable(observer("naseljaGeo")).define("naseljaGeo", ["FileAttachment"], async function(FileAttachment){return(
await FileAttachment('Altitudinal_Conditionality_with_Elevation.json').json()
)});
  main.variable(observer("naselja")).define("naselja", ["naseljaGeo","config","sort"], function(naseljaGeo,config,sort){return(
naseljaGeo.features
  .map(d => d.properties)
  .map(d => {
    Object.keys(config).forEach(key => {
      const obj = {}
      var sum = 0
      config[key].keys.forEach((k,i) => {
        if(d[k] !== -99999 || d[k] !== -9999) {
          obj[config[sort].ranges[i]] = d[k]
          sum = sum + d[k]
        }
      })
      obj.sum = sum
      d[key] = obj
    })
    return d
  })
)});
  main.variable(observer("opstine")).define("opstine", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Hipso_class_Serbia_3.json').json()
)});
  main.define("initial selected", function(){return(
undefined
)});
  main.variable(observer("mutable selected")).define("mutable selected", ["Mutable", "initial selected"], (M, _) => new M(_));
  main.variable(observer("selected")).define("selected", ["mutable selected"], _ => _.generator);
  main.variable(observer("config")).define("config", ["d3"], function(d3){return(
{
  AREA: {
    label: "Hypsometric structure",
    legend: "Area of altitudinal zone [km2]",
    keys: ["AREA_1", "AREA_2", "AREA_3", "AREA_4", "AREA_5", "AREA_6"],
    ranges: ["<200", "200-500", "500-800", "800-1000", "1000-1500", ">1500"],
    scale: d3.scaleLinear()
  },
  POP: {
    label: "Population count by hypsometric zones",
    legend: "Population count in altitudinal zone",
    keys: ["POP_1", "POP_2", "POP_3", "POP_4", "POP_5", "POP_6"],
    ranges: ["<200", "200-500", "500-800", "800-1000", "1000-1500", ">1500"],
    scale: d3.scaleSqrt()
  },
  DENS: {
    label: "Population density by hypsometric zones",
    legend: "Population density in altitudinal zone [inh/km2]",
    keys: ["DENS_1", "DENS_2", "DENS_3", "DENS_4", "DENS_5", "DENS_6"],
    ranges: ["<200", "200-500", "500-800", "800-1000", "1000-1500", ">1500"],
    scale: d3.scaleSqrt()
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
