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
	var height = 650;
	var width = 850;
	var padding = 125;
	chart.attr("width", width)
		.attr("height", height)
		.style("background-color", "rgba(255, 255, 255, 0.8)");
	for (var cycler in data) {
		data[cycler].timeFromTop = data[cycler]["Seconds"] - 2210;
	}
	console.log(data);

	var xScale = d3.scale.linear()
					.domain([0, d3.max(data, function(d) {
						return d['timeFromTop'] + 10 ;
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
					.orient("bottom")

	chart.append("g")
		.attr("class", "axis")
		// brackets around height and padding are important or an error will occur
		.attr("transform", "translate(0, "+ (height - padding) +")")
		.attr("id", "time-axis") // id to override time axis
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
		.attr("r", 5)
		.attr("fill", function(d) {
			if (d.Doping == "") {
				return "#0F5050";
			} else {
				return "#AE3C3C";
			}
		})
		.attr("name", function(d) {
			return d.Name;
		})
		.attr("ranking", function(d) {
			return d.Place;
		})
		.attr("time", function(d) {
			return d.Time;
		})
		.attr("year", function(d) {
			return d.Year;
		})
		.attr("nationality", function(d) {
			return d.Nationality;
		})
		.attr("doping", function(d) {
			return d.Doping;
		})

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
		.attr("font-size", "1.4em");

	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 2)
		.text("Time behind the record (in minutes)")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")

	chart.append("text")
		.attr("x", -height / 2)
		.attr("y", padding / 2)
		.text("Ranking")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")
		.attr("transform", "rotate(-90)");

	chart.append("text")
		.attr("x", padding / 2)
		.attr("y", height - padding / 5)
		.text("For more information about a cyclist, hover over his point.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em");

	/* X AXIS IN MINUTES */
	chart.selectAll("#time-axis text").text(function(d) {
		var minutes = Math.floor(d / 60);
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		var seconds = d % 60;
		if (seconds < 10) {
			seconds = seconds + "0";
		}
		return (minutes + ":" + seconds); 
	});

	var legendWidth = 180;
	var legendHeight = 60;
	chart.append("rect")
		.attr("x", width - padding * 2)
		.attr("y", height / 2 - legendHeight / 2)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("rx", 10)
		.attr("ry", 10)
		.attr("fill", "rgba(0, 0, 0, 0.8)");

	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 3)
		.text("Cyclist has doping allegations.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white");

	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 1.3)
		.text("Cyclist has a clear record.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white");

	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 3 - 4)
		.attr("r", 4)
		.attr("fill", "#AE3C3C");

	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 1.3 - 4)
		.attr("r", 4)
		.attr("fill", "#0F5050");

	var infoWindowHeight = 100;
	var infoWindowWidth = 150;

	$("circle").hover(function(e) {
		var xPosition = e.pageX - $("svg").offset().left;
		var yPosition = e.pageY - $("svg").offset().top;
		var state = $(this).attr("doping");
		var name = $(this).attr("name");
		var nationality = $(this).attr("nationality");
		var ranking = $(this).attr("ranking");
		var time = $(this).attr("time");
		var year = $(this).attr("year");
		var doping = $(this).attr("doping");
		chart.append("rect")
			.attr("width", infoWindowWidth)
			.attr("height", infoWindowHeight)
			.attr("x", xPosition- infoWindowWidth - 10)
			.attr("y", yPosition - infoWindowHeight)
			.attr("rx", 10)
			.attr("ry", 10)
			.attr("fill", function() {
				if (state == "") {
					return "rgba(15, 80, 80, 0.8)";
				} else {
					return "rgba(174, 60, 60, 0.8)";
				}
			})
			.attr("id", "infoWindow");

		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.2)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text(name + " (" + nationality + ")")
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.5)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text("Ranking: " + ranking)
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.95)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text("Time: " + time + " in " + year)
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		/* wrapped text, to have a text wrapped in D3, use D3plus.js library. should append a shape (rect in this case) and then append a text having the same position, then call textwrap function. */
		chart.append("rect")
			.attr("x", xPosition - infoWindowWidth - 10)
			.attr("y", yPosition - infoWindowHeight / 2.3)
			.attr("width", 150)
			.attr("height", 50)
			.attr("fill", "rgba(0, 0, 0, 0)")
			.attr("class", "infoText")

		chart.append("text")
			.attr("id", "rectResize")
			.attr("font-size", 12)
			.attr("fill", "white")
			.attr("x", xPosition - infoWindowWidth - 10)
			.attr("y", yPosition - infoWindowHeight / 2.3)
			.attr("text-anchor", "middle")
			.text(function() {
				if (doping == "") {
					return "The cyclist has a clear record."
				} else {
					return doping + ".";
				}
			})

		d3plus.textwrap()
  		  	.container(d3.select("#rectResize"))
   			.draw();

   		// If it's done in css it doesn't work
   		$("#rectResize").hide();

		$("#infoWindow").fadeIn(200);
		$(".infoText").fadeIn(200);
		$("#rectResize").fadeIn(200);
		
	}, function() {
		$("#infoWindow").hide();
		$(".infoText").hide();
		$("#rectResize").hide();
		d3.select("#infoWindow").remove();
		d3.selectAll(".infoText").remove();
		d3.select("#rectResize").remove();
	})
}