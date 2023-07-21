import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export interface Item {
  category: string;
  value?: number;
}

const RadialStackedAreaChart = ({ data: sortedData }: { data: Item[] }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const data = [
    ...sortedData.filter(_item => _item.value && _item.value > 0),
    ...sortedData.filter(_item => !(_item.value && _item.value)).map(_item => ({ category: _item.category, value: 0 }))
  ];

  useEffect(() => {
    drawChart();
  }, []);

  const drawChart = () => {
    const width = 900;
    const height = 900;

    const defs = d3.select(chartRef.current).append("defs");

    const startAngle = Math.PI * 2 * data.filter(_item => _item.value && _item.value > 0).length / data.length;  // In radians
    const endAngle = Math.PI * 2;  // In radians

    // Create the arc generator
    const _arc = d3.arc()
      .innerRadius(0)  // Inner radius of the arc
      .outerRadius(500)  // Outer radius of the arc
      .startAngle(startAngle)
      .endAngle(endAngle);

    const filter = defs.append("filter")
      .attr("id", "blur-filter")
      .append("feGaussianBlur")
      .attr("stdDeviation", 5); // Adjust the stdDeviation value to control the blur intensity



    for (let i = 0; i < data.length; ++i) {
      const gradient1 = defs
        .append("linearGradient")
        .attr("id", "gradient-back-" + i)
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", Math.cos(- Math.PI * 2 * (i + 1) / data.length + Math.PI / data.length + Math.PI / 2) * 400)
        .attr("y2", -Math.sin(- Math.PI * 2 * (i + 1) / data.length + Math.PI / data.length + Math.PI / 2) * 400)
        .attr("gradientUnits", "userSpaceOnUse");
        gradient1.append("stop").attr("stop-color", "#3754FC").attr("stop-opacity", "0");
        gradient1.append("stop").attr("offset", "1").attr("stop-color", "#3754FC");
    
    }

    for (let i = 0; i < data.length; ++i) {
      const gradient1 = defs
        .append("linearGradient")
        .attr("id", "gradient-front-" + i)
        .attr("x1", "0")
        .attr("y1", "0")
        .attr("x2", Math.cos(- Math.PI * 2 * (i + 1) / data.length + Math.PI / data.length + Math.PI / 2) * 200)
        .attr("y2", -Math.sin(- Math.PI * 2 * (i + 1) / data.length + Math.PI / data.length + Math.PI / 2) * 200)
        .attr("gradientUnits", "userSpaceOnUse");
        gradient1.append("stop").attr("stop-color", "#FFA9FC").attr("stop-opacity", "0");
        gradient1.append("stop").attr("offset", "1").attr("stop-color", "#FFA9FC");
    
    }
  
    const color = (d3 as any).scaleOrdinal()
      .domain(data.map((d: any) => d.category))
      .range((d3 as any).quantize((t: any) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    // Create the pie layout and arc generator.
    const pie = d3.pie()
      .sort(null)
      .value(() => 100);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(250)


    const arc1 = d3.arc()
      .innerRadius(0)
      .outerRadius((item: any) => {
        if (item && item.data) {
          return 250 * item.data.value / 100
        }

        return 200;
      })
      .padRadius(100)

    const labelRadius = (arc as any).outerRadius()() * 1.4;

    // A separate arc generator for labels.
    const arcLabel = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const arcs = pie(data as any);

    // Create the SVG container.
    const svg = d3.select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; background: black;");

    // Add a sector path for each value.
    svg.append("g")
      .attr("stroke", "#3754FC")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", function (d, i) {return `url(#gradient-back-${i})` })
      .attr("d", arc as any)

    svg.append("g")
      .attr("stroke", "#FFA9FC")
      .selectAll()
      .data(arcs)
      .join("path")
      .attr("fill", function (d, i) {return `url(#gradient-front-${i})` })
      .attr("d", arc1 as any)

    svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join('rect')
      .attr("transform", (d: any) => `translate(${arcLabel.centroid(d)})`)
      .attr('x', -70)
      .attr('y', -30)
      .attr('width', 140)
      .attr('height', 60)
      .attr('stroke', 'white')
      .attr('fill', 'black')

    // Create a new arc generator to place a label close to the edge.
    // The label shows the value if there is enough room.
    svg.append("g")
      .attr("text-anchor", "middle")
      .selectAll()
      .data(arcs)
      .join("text")
      .attr("transform", (d: any) => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text((d: any) => d.data.category))

    svg.append("path")
      .attr("d", _arc as any)
      .style("fill", "black")
      .style("opacity", 0.7)
      .style("filter", "url(#blur-filter)");
  };

  return <svg ref={chartRef}></svg>
}

export default RadialStackedAreaChart