// https://observablehq.com/@geoanaliticari/accessibility-as-a-determinant-of-the-depopulation-in-serb@1084
import define1 from "./e93997d5089d7165@2286.js";
import define2 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Hipso_class_Serbia_3.json",new URL("./files/a035f6a8ba50c52a4a30e75c667993a3ae44f4e8f25a369d7e734fb407c0725a3a768e608f27a797db563558dd5f83f164871d4d1a020e1820b0dfac0bde401c",import.meta.url)],["Accessibility.json",new URL("./files/537c4776e9819ac9bf3ebef78f6994d0736b8d94034f84c8a2a9d3018009675d6fe6b1ecfa1111c935e2ea67872127e977565fd83c62dc48bf5d3108782a7a83",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Accessibility as a Determinant of the Depopulation in Serbia`
)});
  main.variable(observer("intro")).define("intro", ["md"], function(md){return(
md`
For more info about this indicator and how data is obtained, visit 
[Pristupačnost kao determinanta depopulacije](https://depopulacija.rs/a4ddff6abf92410a95fd999293a65bb9).`
)});
  main.variable(observer("guide")).define("guide", ["html"], function(html){return(
html`<span style="background-color:#FCF3CF">&darr; Choose a municipality, then scroll down to explore data  &darr;</span>`
)});
  main.variable(observer("map")).define("map", ["d3","municipalities","DOM","settlements","color","municipalityColor","municipalityColorOpacity","mutable selected"], function(d3,municipalities,DOM,settlements,color,municipalityColor,municipalityColorOpacity,$0)
{
  const width = 640;
  const projection = d3
    .geoIdentity()
    .reflectY(true)
    .fitWidth(width, municipalities);
  const path = d3.geoPath(projection);
  const height = Math.ceil(path.bounds(municipalities)[1][1]);

  let svg = d3.select(DOM.svg(width, height));

  const tooltip = d3
    .select("body")
    .append("div")
    .style('position', 'absolute')
    .style('text-align', 'start')
    .style('width', 60)
    .style('height', 30)
    .style('font', '12px sans-serif')
    .style("opacity", 100)
    .style('border-radius', '8px')
    .style('background', '#000')
    .style('pointer-events', 'none')
    .style('padding', '5px')
    .style("color", "#fff");

  svg
    .append('g')
    .selectAll('path')
    .data(settlements.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => color(d.properties["Acc_Key"]));

  svg
    .append('g')
    .selectAll('path')
    .data(municipalities.features)
    .enter()
    .append('path')
    .attr('fill', d => municipalityColor(d.properties["MATBRO"]))
    .attr('fill-opacity', d => municipalityColorOpacity(d.properties["MATBRO"]))
    .attr('stroke', 'black')
    .attr('stroke-width', '0.3px')
    .attr('d', path)
    .on('click', d => {
      $0.value = d.properties;
    })
    .on('mouseover', function(d) {
      d3.select(this).classed('active', true);
      tooltip
        .html(d.properties.Naziv_lati)
        .style("visibility", "visible")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 20 + "px");
    })
    .on("mouseout", function(d) {
      d3.select(this).classed("active", false);
      tooltip.style("visibility", "hidden");
    });

  return svg.node();
}
);
  main.variable(observer("legend")).define("legend", ["swatches","d3","i18n"], function(swatches,d3,i18n){return(
swatches({
  color: d3.scaleOrdinal(
    [
      `${i18n('Accessible Areas with Population Growth')}`,
      `${i18n('Accessible Areas with Population Decline')}`,
      `${i18n('Inaccessible Areas with Population Growth')}`,
      `${i18n('Inaccessible Areas with Population Decline')}`,
      `${i18n('Municipality Centre')}`,
      `${i18n('No Permanent Inhabitants')}`,
      `${i18n('No Data')}`
    ],
    ["#6100d0", "#9d75e3", "#155cbf", "#1ab9ec", "#f24e10", "#eee", "#aaaaaa"]
  ),
  columns: "320px"
})
)});
  main.variable(observer("intro_1")).define("intro_1", ["md","i18n","selected"], function(md,i18n,selected){return(
md`### ${i18n("Data for Municipality")}: ${selected.Naziv_lati}
${i18n(
  "The average travel time (in minutes) to the municipal center and accessibility classes (Red line is the average time distance at the state level)"
)}`
)});
  main.variable(observer("chart")).define("chart", ["data","md","i18n","d3","width","height","x","y","color","sort","margin"], function(data,md,i18n,d3,width,height,x,y,color,sort,margin)
{
  if (data.length === 0) {
    return md`_${i18n('Unfortunately no data')} :(_`;
  }

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", (d, i) => y(i))
    .attr("fill", d => color(d["Acc_Key"]))
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
    .text(d => d[sort])
    .call(text =>
      text
        .filter(d => x(d[sort]) - x(0) < 20) // short bars
        .attr("dx", +4)
        .attr("fill", "black")
        .attr("text-anchor", "start")
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
    .append("g")
    .attr("transform", `translate(${x(21.3)},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickFormat(() => "")
        .tickSize(0)
    )
    .attr("color", "red");

  svg
    .append("g") // averageXAxis
    .attr("transform", `translate(0,${margin.top})`)
    .call(
      d3
        .axisTop(x)
        .tickValues([21.3])
        .tickFormat(d3.format(".1f"))
    )
    .call(g => g.select(".domain").remove())
    .attr("color", "red");

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
  "Accessible Areas with Population Growth":
    "Pristupačna područja sa populacionim porastom",
  "Accessible Areas with Population Decline":
    "Pristupačna područja sa populacionim padom",
  "Inaccessible Areas with Population Growth":
    "Nepristupačna područja sa populacionim porastom",
  "Inaccessible Areas with Population Decline":
    "Nepristupačna područja sa populacionim padom",
  "Municipality Centre": "Opštinski centar",
  "No Permanent Inhabitants": "Nema stalnih stanovnika",
  "No Data": "Nema podataka",
  "The average travel time (in minutes) to the municipal center and accessibility classes (Red line is the average time distance at the state level)":
    "Prosečno vreme putovanja (u minutima) od opštinskog centra i klase pristupačnosti (crvena linija označava prosečnu vremensku distancu na državnom nivou)",
  "Data for Municipality": "Podaci za opštinu",
  "Unfortunately no data": "Nažalost, nema podataka"
}
)});
  main.variable(observer("sort")).define("sort", function(){return(
"TT_car_min"
)});
  main.variable(observer("data")).define("data", ["settlements","selected","sort","d3"], function(settlements,selected,sort,d3){return(
settlements.features.filter(i => i.properties.MatBrO == selected.MATBRO)
  .map(function(item){ return item.properties })
  .filter(d => (d[sort] !== 0 && d[sort] !== null))
  .sort((a, b) => d3.descending(a[sort], b[sort]))
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
  main.variable(observer("margin")).define("margin", function(){return(
{top: 34, right: 30, bottom: 30, left: 120}
)});
  main.variable(observer("width")).define("width", function(){return(
960
)});
  main.variable(observer("height")).define("height", ["data","barHeight","margin"], function(data,barHeight,margin){return(
Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom
)});
  main.variable(observer("barHeight")).define("barHeight", function(){return(
18
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3
  .scaleOrdinal()
  .domain([1, 2, 3, 4, 5, 6, 7])
  .range([
    "#6100d0",
    "#9d75e3",
    "#155cbf",
    "#1ab9ec",
    "#f24e10",
    "#eee",
    "#aaaaaa"
  ])
)});
  main.variable(observer("municipalityColor")).define("municipalityColor", ["municipalitiesWithoutData","color"], function(municipalitiesWithoutData,color){return(
function(d) {
  return municipalitiesWithoutData.includes(d) ? color(7) : 'white'
}
)});
  main.variable(observer("municipalityColorOpacity")).define("municipalityColorOpacity", ["municipalitiesWithoutData"], function(municipalitiesWithoutData){return(
function(d) {
  return municipalitiesWithoutData.includes(d) ? '1'  : '0'
}
)});
  main.variable(observer("domain")).define("domain", ["settlements","sort"], function(settlements,sort){return(
[0, Math.max(...settlements.features.map(f => f.properties[sort]))]
)});
  main.variable(observer("settlements")).define("settlements", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Accessibility.json').json()
)});
  main.variable(observer("municipalities")).define("municipalities", ["FileAttachment"], function(FileAttachment){return(
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
  main.variable(observer("config")).define("config", function(){return(
{
  "P_LA_15": { 
    label: "Lighted Area 2015", 
    domain: [0.01, 5, 10, 20, 40, 60, 80, 100], 
    colors: ["#000004", "#281461", "#5e177f", "#982c80", "#d3426e", "#f8765c", "#febb80", "#fcfdbf"],
    format: "%" 
  },
  "P_LA_15-19": { 
    label: "Lighted Area 2015-2019", 
    domain: [0.01, 5, 10, 20, 40, 60, 80, 100], 
    colors: ["#000004", "#281461", "#5e177f", "#982c80", "#d3426e", "#f8765c", "#febb80", "#fcfdbf"],
    format: "%" 
  },
  "SOL_15": { 
    label: "Sum of Lights 2015", 
    domain: [0.01, 10, 50, 100, 500, 1000, 5000, 10000],
    colors: ["#000004", "#201352", "#50127b", "#822581", "#b63679", "#e75163", "#fc8761", "#fec387", "#fcfdbf"],
    format: "nW m<sup>-2</sup> sr<sup>-1</sup>"
  }, 
  "SOL_15-19": { 
    label: "Sum of Lights 2015-2019", 
    domain: [0.01, 10, 50, 100, 500, 1000, 5000, 10000],
    colors: ["#000004", "#201352", "#50127b", "#822581", "#b63679", "#e75163", "#fc8761", "#fec387", "#fcfdbf"],
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
  main.import("swatches", child2);
  main.variable(observer("style")).define("style", ["html"], function(html){return(
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
