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

/* This function is called from within AJAX's success method and it draws the chart. */
function plot(data) {
	/* Chart is created and given dimension and white transparent background. */
	var chart = d3.select("#chart-area").append("svg");
	var height = 650;
	var width = 850;
	var padding = 125;
	chart.attr("width", width)
		.attr("height", height)
		.style("background-color", "rgba(255, 255, 255, 0.8)");
	/* Each cyclist has time in seconds, on the chart we want the difference between each cyclist and the top one, and that's calculated here. 2210 is the top cyclist's time. This time difference is stored in a new property 'timeFromTop' */
	for (var cycler in data) {
		data[cycler].timeFromTop = data[cycler]["Seconds"] - 2210;
	}

	/* x-Axis scale is created, it will have the time of each cyclist relative to the top cyclist. */
	var xScale = d3.scale.linear()
					.domain([0, d3.max(data, function(d) {
						// +10 here so we don't start from the origin of the axis.
						return d['timeFromTop'] + 10 ;
					})])
					// Range is reversed to reverse the order of the points.
					.range([width - padding, padding]);

	/* y-axis scale, also with an offset (this time 3) */
	var yScale = d3.scale.linear()
					.domain([1, d3.max(data, function(d) {
						return d['Place'] + 3;
					})])
					.range([padding, height - padding]);

	/* x-axis is created and its properties specified. */
	var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient("bottom")

	chart.append("g")
		.attr("class", "axis")
		// brackets around height and padding are important or an error will occur
		.attr("transform", "translate(0, "+ (height - padding) +")")
		.attr("id", "time-axis") // id will be used to override time axis labels
		.call(xAxis);

	/* x-axis is created and its properties specified. */
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient("left");
	chart.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+ padding +",0)")
		.call(yAxis);

	/* Data points are represented with circles which are appended below */
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
		/* fill depends on whether the cyclist has doping allegations or not */
		.attr("fill", function(d) {
			// No allegations
			if (d.Doping == "") {
				return "#0F5050";
			} else {
				return "#AE3C3C";
			}
		})
		/* The following attributes are given to each circle and will be used when the circle is hovered to add information to the infoWindow. */
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

	/* Chart's label is appended. */
	chart.append("text")
		.attr("x", width / 2)
		.attr("y", padding / 2)
		.text("Alpe d'Huez Best Times")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.4em");

	/* x-axis label is added. */
	chart.append("text")
		.attr("x", width / 2)
		.attr("y", height - padding / 2)
		.text("Time behind the record (in minutes)")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")

	/* y-axis label is added */
	chart.append("text")
		.attr("x", -height / 2)
		.attr("y", padding / 2)
		.text("Ranking")
		.attr("text-anchor", "middle")
		.attr("font-size", "1.1em")
		.attr("transform", "rotate(-90)");

	/* Note on the bottom of the chart is added. */
	chart.append("text")
		.attr("x", padding / 2)
		.attr("y", height - padding / 5)
		.text("For more information about a cyclist, hover over his point.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em");

	/* The method overrides default x-axis labels (seconds) and replaces it with custom labels (time in mm:ss format).
	the selectAll selects id 'time-axis' which was given to the x-axis, and then select the text of that axis */
	chart.selectAll("#time-axis text").text(function(d) {
		var minutes = Math.floor(d / 60);
		if (minutes < 10) {
			// Adds 0 digit if the minutes are single digit. 
			minutes = "0" + minutes;
		}
		var seconds = d % 60;
		if (seconds < 10) {
			seconds = seconds + "0";
		}
		return (minutes + ":" + seconds); 
	});

	/* The following two lines specify the legend box dimensions */
	var legendWidth = 180;
	var legendHeight = 60;
	/* Adds the legend box. */
	chart.append("rect")
		.attr("x", width - padding * 2)
		.attr("y", height / 2 - legendHeight / 2)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("rx", 10)
		.attr("ry", 10)
		.attr("fill", "rgba(0, 0, 0, 0.8)");
	/* Adds the first entry in the legend box. */
	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 3)
		.text("Cyclist has doping allegations.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white");
	/* Adds the second entry in the legend box. */
	chart.append("text")
		.attr("x", width - padding * 2 + 20)
		.attr("y", height / 2 - legendHeight / 2 + legendHeight / 1.3)
		.text("Cyclist has a clear record.")
		.attr("text-anchor", "start")
		.attr("font-size", "0.7em")
		.attr("fill", "white");
	/* Adds symbol in the legend box */
	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 3 - 4)
		.attr("r", 4)
		.attr("fill", "#AE3C3C");
	/* Adds second symbol in the legend box */
	chart.append("circle")
		.attr("cx", width - padding * 2 + 10)
		.attr("cy", height / 2 - legendHeight / 2 + legendHeight / 1.3 - 4)
		.attr("r", 4)
		.attr("fill", "#0F5050");

	/* infoWindow dimensions */
	var infoWindowHeight = 100;
	var infoWindowWidth = 150;

	/* jQuery hover function to show and hide infoWindow once a data point is hovered. */
	$("circle").hover(function(e) {
		/* The next two lines read the position of the pointer relative to the parent svg. */
		var xPosition = e.pageX - $("svg").offset().left;
		var yPosition = e.pageY - $("svg").offset().top;
		/* Each circle was assigned attributes representing each cyclist's information. these properties are saved in corresponding variables. */
		var state = $(this).attr("doping");
		var name = $(this).attr("name");
		var nationality = $(this).attr("nationality");
		var ranking = $(this).attr("ranking");
		var time = $(this).attr("time");
		var year = $(this).attr("year");
		var doping = $(this).attr("doping");
		/* The infoWuindow is appended to the chart. */
		chart.append("rect")
			.attr("width", infoWindowWidth)
			.attr("height", infoWindowHeight)
			.attr("x", xPosition- infoWindowWidth - 10)
			.attr("y", yPosition - infoWindowHeight)
			/* rx and ry gives round corners. */
			.attr("rx", 10)
			.attr("ry", 10)
			.attr("fill", function() {
				/* The color of the infoWindow depends on the doping state of the cyclist. */
				if (state == "") {
					return "rgba(15, 80, 80, 0.8)";
				} else {
					return "rgba(174, 60, 60, 0.8)";
				}
			})
			/* To control visibility of the infoWindow, it's given an id. */
			.attr("id", "infoWindow");

		/* The name and nationality of the cyclist are appended. */
		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.2)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text(name + " (" + nationality + ")")
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		/* The ranking of the cyclist is appended. */
		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.5)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text("Ranking: " + ranking)
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		/* The cyclist's time and year are appended to the infoWindow */
		chart.append("text")
			.attr("x", xPosition - infoWindowWidth / 2 - 10)
			.attr("y", yPosition - infoWindowHeight / 1.95)
			.attr("text-anchor", "middle")
			.attr("fill", "white")
			.text("Time: " + time + " in " + year)
			.attr("font-size", "0.7em")
			.attr("class", "infoText");

		/* wrapped text, to have a text wrapped in D3, use D3plus.js library. should append a shape (rect in this case) and then append a text having the same position, then call textwrap function. */
		/* The rectangle which will wrap the doping text. It's invisible but should be defined to hold the text */
		chart.append("rect")
			.attr("x", xPosition - infoWindowWidth - 10)
			.attr("y", yPosition - infoWindowHeight / 2.3)
			.attr("width", 150)
			.attr("height", 50)
			.attr("fill", "rgba(0, 0, 0, 0)")
			// A class is used to control visibility.
			.attr("class", "infoText")
		/* The wrapped text, should have a position within the container.*/
		chart.append("text")
			/* id assigned to use with the textwrap method. */
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

		/* The textwrap function, it calls the selected text and wraps it in its container. */
		d3plus.textwrap()
  		  	.container(d3.select("#rectResize"))
   			.draw();

   		// If it's done in css it doesn't work, it is hidden to allow for fading it in.
   		$("#rectResize").hide();
		$("#infoWindow").fadeIn(200);
		$(".infoText").fadeIn(200);
		$("#rectResize").fadeIn(200);
	/* The hover out function. It removes the infoWindow and all its contents. */
	}, function() {
		d3.select("#infoWindow").remove();
		d3.selectAll(".infoText").remove();
		d3.select("#rectResize").remove();
	})
}