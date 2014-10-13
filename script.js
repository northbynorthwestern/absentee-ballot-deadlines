
d3.json('america.simplify.topo.json', function(america) {
	d3.csv('data.csv', function(csv) { 

		var w = $('#map').width();
		var h = $('#map').height();

		var purple = '#501F84';

		var mapRatio = 1;
		var mapScaleFactor = 4;
		var margin = {top: 0, left: 0, bottom: 0, right: 0};
	    var width = w - margin.left - margin.right;
	    var height = width * mapRatio;
	    var scale = width * mapScaleFactor;

		var states = topojson.feature(america, america.objects.america);

		var projection = d3.geo.albersUsa()
		    .scale(700)
		    .translate([width / 2, height / 4]);

		var path = d3.geo.path()
		    .projection(projection);

		var svg = d3.select("#map").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		svg.selectAll("path")
			.data(states.features)
		.enter().append("path")
			.attr("class", "state")
			.attr("d", path)
			.attr("data-state", function(d) { return d.properties.NAME.split(' ').join(''); })
			.on("click", click);

		svg.append("path")
			.datum(topojson.feature(america, america.objects.america, function(a, b) { return a !== b; }))
			.attr("class", "state-border")
			.attr("d", path);

		for (i = 0; i < csv.length; i++) {
			row = csv[i];
			id = row.state.split(' ').join('');

			a = '<tr id="' + id + '"></tr>';
			$('tbody').append(a);

			keys = Object.keys(row);

			for (j = 0; j < keys.length - 1; j++) {
				b = '<td id="' + id + '" data-title="' + keys[j] + '">' + 
						'<a target="blank" href="http://www.longdistancevoter.org' + row.info_link + '">' + row[keys[j]] + 
					'</a></td>';
				$('tr#' + id).append(b);
			}

			pymChild.sendHeight();
		}

		function click(d) { 
			id = '#' + d.properties.NAME.split(' ').join('');
			$row = $(id);
			rows = $('table tr');

			for (var i = rows.length - 1; i >= 0; i--) {
				$(rows[i]).removeClass('selected');
			}

			pymChild.sendMessage('child-click', id);

			smoothScroll.animateScroll(null, id);
			$row.addClass('selected');

		}
	});
});