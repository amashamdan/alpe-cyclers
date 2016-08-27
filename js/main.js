/* URL to retreive cyclers data. */
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
/* AJAX request to fetch the cyclers data. */
$.ajax ({
	url: url,
	dataType: "json",
	success: function(data) {
		/* The plot function which will build the chart is called. */
		plot(data);
	},
	/* In case an error occurs while retreiving data, an error message is alerted to the user. */
	error: function() {
		alert("Cannot retreive data at this point. Please try again later");
	}
});

function plot(data) {
	/* Chart is created and given dimension and white transparent background. */
	var chart = d3.select("#chart-area").append("svg");
	var height = 600;
	var width = 800;
	var padding = 50;
	chart.attr("width", width)
		.attr("height", height)
		.style("background-color", "rgba(255, 255, 255, 0.5)");
	for (var cycler in data) {
		data[cycler].timeFromTop = data[cycler]["Seconds"] - 2210;
	}
	console.log(data);

	var xScale = d3.scale.linear()
					.domain([0, d3.max(data, function(d) {
						return d['timeFromTop'] + 10;
					})])
					.range([width - padding, padding]);
	var yScale = d3.scale.linear()
					.domain([1, d3.max(data, function(d) {
						return d['Place'] + 3;
					})])
					.range([padding, height - padding]);
	var colorScale = d3.scale.linear()
					.domain([1, d3.max(data, function(d) {
						return d['Place'];
					})])
					.range([0, 255]);

	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom");
	chart.append("g")
		.attr("class", "axis")
		// brackets around height and padding are important or an error will occur
		.attr("transform", "translate(0, "+ (height - padding) +")")
		.call(xAxis);

	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ padding +",0)")
		.call(yAxis);

	chart.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d.timeFromTop);
		})
		.attr("cy", function(d) {
			return yScale(d.Place)
		})
		.attr("r", 4)
		.attr("fill", function(d) {
			if (d.Doping == "") {
				return "#0F5050";
			} else {
				return "#AE3C3C";
			}
		});
}