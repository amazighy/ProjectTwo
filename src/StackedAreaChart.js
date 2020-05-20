import React, { useEffect, useRef } from "react";

import {
  select,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending,
  area,
  scalePoint,
  format,
  curveCardinal
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a StackedBarChart
 */

function StackedBarChart({ data, keys, colors }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // stacks / layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(data);
    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
    ];

    // scales
    const xScale = scalePoint()
      .domain(data.map(d => d.year))
      .range([0, width]);

    const yScale = scaleLinear()
      .domain(extent)
      .range([height, 0]);

    // area generator
    const areaGenerator = area()
      .x(sequence => xScale(sequence.data.year))
      .y0(sequence => yScale(sequence[0]))
      .y1(sequence => yScale(sequence[1]))
      .curve(curveCardinal);

    // rendering
    svg
      .selectAll(".layer")
      .data(layers)
      .join("path")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .attr("d", areaGenerator);

    // axes
    // const xAxis = axisBottom(xScale)
    // ;
    // svg
    //   .select(".x-axis")
    //   .attr("transform", `translate(0, ${height})`)
    //   .call(xAxis)
    //   .selectAll('.domain')
    //   .remove();

    //   ;

    const yAxis = axisLeft(yScale)
    .tickFormat(format(".2s"));
    svg.select(".y-axis").call(yAxis)
    .selectAll('.domain, .tick line')
    .remove();
  }, [colors, data, dimensions, keys]);


  return (
   
      
      <div className='AreaDiv'  ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      
        <svg className='AreaChart' ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
          
        </svg>
       
      </div>
      
   
  );
}

export default StackedBarChart;
