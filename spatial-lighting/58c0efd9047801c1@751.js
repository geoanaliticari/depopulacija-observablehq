// https://observablehq.com/@geoanaliticari/spatial-lighting@751
import define1 from "./e93997d5089d7165@2286.js";
import define2 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Hipso_class_Serbia_3.json",new URL("./files/a035f6a8ba50c52a4a30e75c667993a3ae44f4e8f25a369d7e734fb407c0725a3a768e608f27a797db563558dd5f83f164871d4d1a020e1820b0dfac0bde401c",import.meta.url)],["LA_SOL_Settl.json",new URL("./files/4f1cfa051d82e40369131b2a4cf0d75c8a39f51abc686724302352b5f01e02f762c0c41222a54e8e46bec8ae0ecf1a3b497d638689c48c853c378881e2bd1e2f",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Spatial Lighting`
)});
  main.variable(observer("intro")).define("intro", ["md"], function(md){return(
md`For more info about this indicator and how data is obtained, visit [Noćna svetla](https://depopulacija.rs/687e152cef7c47b29969e2eb4e395092).`
)});
  main.variable(observer("guide")).define("guide", ["html"], function(html){return(
html`<span style="background-color:#FCF3CF">&darr; Choose an indicator and a municipality, then scroll down to explore data  &darr;</span>`
)});
  main.variable(observer("viewof sort")).define("viewof sort", ["radio","i18n"], function(radio,i18n){return(
radio({
  options: [
    { label: `${i18n("Lighted Area 2015")}`, value: "P_LA_15" },
    { label: `${i18n("Lighted Area 2015–2019")}`, value: "P_LA_15-19" },
    { label: `${i18n("Sum of Lights 2015")}`, value: "SOL_15" },
    { label: `${i18n("Sum of Lights 2015–2019")}`, value: "SOL_15-19" }
  ],
  value: "P_LA_15"
})
)});
  main.variable(observer("sort")).define("sort", ["Generators", "viewof sort"], (G, _) => G.input(_));
  main.variable(observer("subtitle")).define("subtitle", ["html","i18n","config","sort"], function(html,i18n,config,sort){return(
html`<h2>${i18n(config[sort].label)} [${config[sort].format}]</h2>`
)});
  main.variable(observer("map")).define("map", ["d3","opstine","DOM","mutable selected","naselja","color","sort"], function(d3,opstine,DOM,$0,naselja,color,sort)
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
    .attr('fill', d => color(d.properties[sort]));
  
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
      .on('click', click)
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
  main.variable(observer("intro_1")).define("intro_1", ["md","i18n","selected"], function(md,i18n,selected){return(
md`### ${i18n("Data for Municipality")}: ${selected.Naziv_lati}`
)});
  main.variable(observer("legend_1")).define("legend_1", ["legend","color","i18n","config","sort"], function(legend,color,i18n,config,sort){return(
legend({
  color: color,
  title: `${i18n(config[sort].label)}`,
  tickSize: 0
})
)});
  main.variable(observer("chart")).define("chart", ["data","md","i18n","d3","width","height","x","y","color","sort","config","xAxis","yAxis","margin"], function(data,md,i18n,d3,width,height,x,y,color,sort,config,xAxis,yAxis,margin)
{
  if (data.length === 0) {
    return md`_${i18n("Unfortunately no data")} :(_`;
  }

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")

    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d, i) => y(i))
    .attr("fill", d => color(d[sort]))
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
    .text(d => d3.format(".2f")(d[sort]))
    .call(text =>
      text
        .filter(d => x(d[sort]) - x(0) < 25) // short bars
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start")
    )
    .call(text =>
      text
        .filter(
          d => d[sort] > config[sort].domain[config[sort].domain.length - 2]
        ) // light bars
        .attr("fill", "grey")
    );

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  const yTitle = g =>
    g
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("y", 10)
      .attr("x", margin.left)
      .text(
        `${i18n(config[sort].label)} [${config[sort].format.replace(
          /<[^>]*>?/gm,
          ''
        )}]`
      );

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
  "Lighted Area 2015": "Osvetljene površine 2015",
  "Lighted Area 2015–2019": "Osvetljene površine 2015–2019",
  "Sum of Lights 2015": "Suma radijanse 2015",
  "Sum of Lights 2015–2019": "Suma radijanse 2015–2019",
  "Data for Municipality": "Podaci za opštinu",
  "Unfortunately no data": "Nažalost, nema podataka"
}
)});
  main.variable(observer("data")).define("data", ["naselja","selected","d3","sort"], function(naselja,selected,d3,sort){return(
naselja.features.filter(i => i.properties.MatBrO == selected.MATBRO)
  .map(function(item){ return item.properties })
  .sort((a, b) => d3.descending(a[sort], b[sort]))
)});
  main.variable(observer("format")).define("format", ["x","data"], function(x,data){return(
x.tickFormat(20, data.format)
)});
  main.variable(observer("x")).define("x", ["d3","data","sort","margin","width"], function(d3,data,sort,margin,width){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d[sort])])
    .rangeRound([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","margin","height"], function(d3,data,margin,height){return(
d3.scaleBand()
    .domain(d3.range(data.length))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.1)
)});
  main.variable(observer("xAxis")).define("xAxis", ["margin","d3","x","width"], function(margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","data"], function(margin,d3,y,data){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickFormat(i => data[i].ImeNasLat).tickSizeOuter(0))
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
  main.variable(observer("color")).define("color", ["d3","config","sort"], function(d3,config,sort){return(
d3.scaleThreshold()
    .domain(config[sort].domain)
    .range(config[sort].colors)
)});
  main.variable(observer("domain")).define("domain", ["naselja","sort"], function(naselja,sort){return(
[0, Math.max(...naselja.features.map(f => f.properties[sort]))]
)});
  main.variable(observer("naselja")).define("naselja", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('LA_SOL_Settl.json').json()
)});
  main.variable(observer("opstine")).define("opstine", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Hipso_class_Serbia_3.json').json()
)});
  main.define("initial selected", function(){return(
undefined
)});
  main.variable(observer("mutable selected")).define("mutable selected", ["Mutable", "initial selected"], (M, _) => new M(_));
  main.variable(observer("selected")).define("selected", ["mutable selected"], _ => _.generator);
  main.variable(observer("config")).define("config", function(){return(
{
  P_LA_15: {
    label: "Lighted Area 2015",
    domain: [0.01, 5, 10, 20, 40, 60, 80, 100],
    colors: [
      "#000004",
      "#281461",
      "#5e177f",
      "#982c80",
      "#d3426e",
      "#f8765c",
      "#febb80",
      "#fcfdbf"
    ],
    format: "%"
  },
  "P_LA_15-19": {
    label: "Lighted Area 2015–2019",
    domain: [0.01, 5, 10, 20, 40, 60, 80, 100],
    colors: [
      "#000004",
      "#281461",
      "#5e177f",
      "#982c80",
      "#d3426e",
      "#f8765c",
      "#febb80",
      "#fcfdbf"
    ],
    format: "%"
  },
  SOL_15: {
    label: "Sum of Lights 2015",
    domain: [0.01, 10, 50, 100, 500, 1000, 5000, 10000],
    colors: [
      "#000004",
      "#201352",
      "#50127b",
      "#822581",
      "#b63679",
      "#e75163",
      "#fc8761",
      "#fec387",
      "#fcfdbf"
    ],
    format: "nW m<sup>-2</sup> sr<sup>-1</sup>"
  },
  "SOL_15-19": {
    label: "Sum of Lights 2015–2019",
    domain: [0.01, 10, 50, 100, 500, 1000, 5000, 10000],
    colors: [
      "#000004",
      "#201352",
      "#50127b",
      "#822581",
      "#b63679",
      "#e75163",
      "#fc8761",
      "#fec387",
      "#fcfdbf"
    ],
    format: "nW m<sup>-2</sup> sr<sup>-1</sup>"
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
