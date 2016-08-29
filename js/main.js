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
	var padding = 100;
	chart.attr("width", width)
		.attr("height", height)
		.style("background-color", "rgba(255, 255, 255, 0.8)");
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

	// Once tried to append names using enter(), for some reason only half the names appear. This is a work around to loop using a for loop and append a text for each point.
	for (var cycler in data) {
		chart.append("text")
			.attr("x", function() {
				return xScale(data[cycler].timeFromTop) + 7;
			})
			.attr("y", function() {
				return yScale(data[cycler].Place) + 4;
			})
			.text(function() {
				return data[cycler].Name;
			})
			.attr("font-size", "0.7em");
	}

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", padding / 2)
		.text("Alpe d'Huez Best Times")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.4em")

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 2)
		.text("Time is seconds behind the record")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")

	chart.append("text")
		.attr("x", -height / 2)
		.attr("y", padding / 2)
		.text("Ranking")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")
		.attr("transform", "rotate(-90)")

	chart.append("text")
		.attr("x", padding / 2)
		.attr("y", height - padding / 5)
		.text("For more information about a cyclist, hover over his point.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")

	var legendWidth = 180;
	var legendHeight = 60;
	chart.append("rect")
		.attr("x", width - padding * 2)
		.attr("y", height / 2 - legendHeight / 2)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("rx", 10)
		.attr("ry", 10)
		.attr("fill", "rgba(0, 0, 0, 0.8)")

	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 3)
		.text("Cyclist has doping allegations.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white")

	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 1.3)
		.text("Cyclist has a clear record.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white")

	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 3 - 4)
		.attr("r", 4)
		.attr("fill", "#AE3C3C")

	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 1.3 - 4)
		.attr("r", 4)
		.attr("fill", "#0F5050")
}