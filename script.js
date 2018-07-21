d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
    d["Time"] = d3.timeParse("%M:%S")(d["Time"]);
  });//change time format
  var timeScale = d3.scaleLinear()
    .domain(d3.extent(data, function (d) {return d["Time"];}))
    .range([0, 500]);//create time scale
  var yearScale = d3.scaleLinear()
    .domain([d3.min(data, function (d) {return d["Year"]-1;}), d3.max(data, function (d) {return d["Year"]+1;})])
    .range([0, 800]);//create year scale
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var tooltip = d3.select("body").append("div")
    .style('width', '200px')
    .style('position', 'relative')
    .style('background', '#d1e0e0')
    .style('border', '1px solid grey')
    .style('border-radius', '5px')
    .style('opacity', '0');//create tooltip div
  var canvas = d3.select("#main").append("svg")
    .attr("width", 900)
    .attr("height", 600)
    .attr("transform", "translate(50, 50)");//create canvas
  var dots = canvas.append("g").selectAll(".dot").data(data).enter().append("circle")
    .attr("transform", "translate(80, 10)")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", function(d) { return yearScale(d["Year"]); })
    .attr("cy", function(d) { return timeScale(d["Time"]); })
    .attr("fill", function(d) { return color(d["Doping"] != ""); })
    .attr("stroke", "black")
    .on('mouseover', function(d) {
      tooltip.transition()
        .style('opacity', '1')
      tooltip.html(d["Name"] + ": " + d["Nationality"] + "<br/ >Year: " + d["Year"] + ", Time: " + d["Time"] + "<br /><br />" + d["Doping"])
        .style('left', ((d3.event.pageX+7)+'px'))
        .style('top', ((d3.event.pageY-70)+'px'))
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .style('opacity', '0')
    });//draw dots
  var yScale = d3.scaleTime()
    .domain(d3.extent(data, function (d) {return d["Time"];}))
    .range([0, 500]);//create y-axis scale
  var yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));//create y-axis
  canvas.append("g")
    .attr("transform", "translate(80, 10)")
    .call(yAxis);//display y-axis
  canvas.append("text")
    .attr("transform", "translate(40, 170) rotate(-90)")
    .style("text-anchor", "middle")
    .text("Time in Seconds");//label y-axis
  var xAxis = d3.axisBottom(yearScale).tickFormat(d3.format("d"));//create x-axis
  canvas.append("g")
    .attr("transform", "translate(80, 510)")
    .call(xAxis);//display x-axis
  var legend = canvas.selectAll(".legend").data(color.domain()).enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });//create a legend
  legend.append("rect")
    .attr("x", 882)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);//create the legend's rectangles
  legend.append("text")
    .attr("x", 876)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d ? "Riders with doping allegations" : "No doping allegations"; });//label the legend's rectangles
});
