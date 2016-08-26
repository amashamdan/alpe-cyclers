/* URL to retreive cyclers data. */
var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
/* AJAX request to fetch the cyclers data. */
$.ajax ({
	url: url,
	data: "json",
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
	var chart = d3.select("#chart-area").append("svg");
	chart.attr("width", 900)
		.attr("height", 600)
		.style("background-color", "rgba(255, 255, 255, 0.5)");	
}