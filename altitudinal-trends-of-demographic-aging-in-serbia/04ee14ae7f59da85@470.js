// https://observablehq.com/@geoanaliticari/altitudinal-trends-of-demographic-aging-in-serbia@470
import define1 from "./e93997d5089d7165@2286.js";
import define2 from "./a33468b95d0b15b0@698.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["Hipso_class_Serbia_3.json",new URL("./files/a035f6a8ba50c52a4a30e75c667993a3ae44f4e8f25a369d7e734fb407c0725a3a768e608f27a797db563558dd5f83f164871d4d1a020e1820b0dfac0bde401c",import.meta.url)],["Indicator_1_mini@1.json",new URL("./files/04e504ad03368ede2d6460e56f02f9b86feb72d3810f4fb07e4ea254c841a8717bbe42d87c2a22a3a392233cc555752ed11331687a5eeb12f545469c531b2be6",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("title")).define("title", ["md"], function(md){return(
md`# Altitudinal Trends of Demographic Aging`
)});
  main.variable(observer("intro")).define("intro", ["md"], function(md){return(
md`For more info about this indicator and how data is obtained, visit [Demografsko starenje prema visinskim zonama](https://depopulacija.rs/216e03a074e841b0b8f851a83a28ad4c).`
)});
  main.variable(observer("guide")).define("guide", ["html"], function(html){return(
html`<span style="background-color:#FCF3CF">&darr; Choose a municipality, then scroll down to explore data  &darr;</span>`
)});
  main.variable(observer("map")).define("map", ["d3","opstine","DOM","mutable selected","naselja","color"], function(d3,opstine,DOM,$0,naselja,color)
{
  const width = 600;
  const projection = d3
    .geoIdentity()
    .reflectY(true)
    .fitWidth(width, opstine);
  const path = d3.geoPath(projection);
  const height = Math.ceil(path.bounds(opstine)[1][1]);

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

  function click(d) {
    $0.value = d.properties;
  }

  svg
    .append('g')
    .selectAll('path')
    .data(naselja.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => color(d.properties.Mean_ELEV));

  svg
    .append('g')
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
  main.variable(observer("legend_1")).define("legend_1", ["legend","color","i18n"], function(legend,color,i18n){return(
legend({
  color: color,
  title: i18n("altitude"),
  tickSize: 0
})
)});
  main.variable(observer("intro_1")).define("intro_1", ["md","i18n","selected"], function(md,i18n,selected){return(
md`### ${i18n("data_for_municipality")}: ${selected.Naziv_lati}
${i18n("lat_trends_desc")}`
)});
  main.variable(observer("viewof sort")).define("viewof sort", ["radio","i18n"], function(radio,i18n){return(
radio({
  options: [
    { label: `0-14 ${i18n("years_old")}`, value: "P_0_14" },
    { label: `15-39 ${i18n("years_old")}`, value: "P_15_39" },
    { label: `40-64 ${i18n("years_old")}`, value: "P_40_64" },
    { label: `65+ ${i18n("years_old")}`, value: "P_65" }
  ],
  value: "P_65"
})
)});
  main.variable(observer("sort")).define("sort", ["Generators", "viewof sort"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["data","md","i18n","d3","sort"], function(data,md,i18n,d3,sort)
{
  if (data.length === 0) {
    return md`_${i18n("no_data")} :(_`;
  }
  const width = 960;
  const height = 600;
  const margin = { top: 35, right: 25, bottom: 45, left: 40 };

  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.Mean_ELEV))
    .nice()
    .range([margin.left, width - margin.right - 60]);

  const xAxis = g =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickFormat(x => `${x} m`)
      )
      .call(g => g.select(".domain").remove())
      .call(g =>
        g
          .append("text")
          .attr("x", width - margin.right)
          .attr("y", margin.bottom - 3)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .attr("font-weight", "bold")
          .text(`${i18n("lat_trends_x")}`)
      );

  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d[sort]))
    .nice()
    .range([height - margin.bottom, margin.top]);

  const yAxis = g =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(x => `${x}%`))
      .call(g => g.select(".domain").remove())
      .call(g =>
        g
          .append("text")
          .attr("x", -margin.left)
          .attr("y", 16)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(`${i18n("lat_trends_y")}`)
      );

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "svg-tooltip")
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

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  const grid = g =>
    g
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call(g =>
        g
          .append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
          .attr("x1", d => 0.5 + x(d))
          .attr("x2", d => 0.5 + x(d))
          .attr("y1", margin.top)
          .attr("y2", height - margin.bottom)
      )
      .call(g =>
        g
          .append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
          .attr("y1", d => 0.5 + y(d))
          .attr("y2", d => 0.5 + y(d))
          .attr("x1", margin.left)
          .attr("x2", width - margin.right)
      );

  svg.append("g").call(grid);

  svg
    .append("g")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("fill", "steelblue")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.Mean_ELEV))
    .attr("cy", d => y(d[sort]))
    .attr("r", 5)
    .on('mouseover', function(d) {
      d3.select(this).classed('active', true);
      tooltip
        .html(d.ImeNasLat)
        .style("visibility", "visible")
        .text(
          `${d.ImeNasLat}\n${i18n("mean_elev")}: ${d.Mean_ELEV}m\n${sort}: ${
            d[sort]
          }%`
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 20 + "px");
    })
    .on('mouseout', function(d) {
      d3.select(this).classed('active', false);
      tooltip.style("visibility", "hidden");
    });

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
  altitude: ["Altitude (m)", "Nadmorska visina (m a.s.l.)"],
  data_for_municipality: ["Data for Municipality", "Podaci za opštinu"],
  years_old: ["years old", "godina"],
  lat_trends_desc: [
    "Mean elevation of settlements (m a.s.l.) and share (%) of the age groups (0–14, 15–39, 40–64, 65+) in total population of settlement",
    "Prosečna nadmorska visina naselja (m a.s.l.) i udeo (%) starosnih grupa (0–14, 15–39, 40–64, 65+) u ukupnoj populaciji naselja"
  ],
  lat_trends_x: [
    "Mean elevation of settlement (m a.s.l.)",
    "Prosečna nadmorska visina naselja (m a.s.l.)"
  ],
  lat_trends_y: ["Share of the age group (%)", "Udeo starosne grupe (%)"],
  mean_elev: ["Mean elevation", "Prosečna nadmorska visina"],
  no_data: ["Unfortunately no data :(", "Nažalost, nema podataka"]
}
)});
  main.variable(observer("color")).define("color", ["d3","domain"], function(d3,domain){return(
d3.scaleSequential()
  .domain(domain)
  .interpolator(d3.interpolateRgbBasis(["darkseagreen", "yellow", "crimson", "grey"]))
)});
  main.variable(observer("domain")).define("domain", ["naselja"], function(naselja){return(
[0, Math.max(...naselja.features.map(f => f.properties.Mean_ELEV))]
)});
  main.variable(observer("data")).define("data", ["naselja","selected"], function(naselja,selected){return(
naselja.features.filter(i => i.properties.MatBrO == selected.MATBRO)
  .map(function(item){ return item.properties })
)});
  main.variable(observer("naselja")).define("naselja", ["FileAttachment"], function(FileAttachment){return(
FileAttachment('Indicator_1_mini@1.json').json()
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
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  const child2 = runtime.module(define2);
  main.import("legend", child2);
  main.variable(observer()).define(["html"], function(html){return(
html`<style>
  text {
    font-size : 14px;
  }
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
