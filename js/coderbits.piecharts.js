window.onload = function () {            
    var zoomPie = function (self) {
        self.sector.stop();
        self.sector.scale(1.1, 1.1, self.cx, self.cy);

        if (self.label) {
            self.label[0].stop();
            self.label[0].attr({ r: 7.5 });
            self.label[1].attr({ 'font-weight': 800 });
        }
    };

    var unzoomPie = function (self) {
        self.sector.animate({ transform: 's1 1 ' + self.cx + ' ' + self.cy }, 500, 'bounce');

        if (self.label) {
            self.label[0].animate({ r: 5 }, 500, 'bounce');
            self.label[1].attr({ 'font-weight': 400 });
        }
    };

    var createPie = function (r, x, y, radius, values, keys, colors) {
        var pie = r.piechart(x, y, radius, values, { colors: colors, legend: keys, legendpos: 'south', legendcolor: '#000', stroke: '#FFF8D3', strokewidth: '1' });

        pie.hover(function () {
            zoomPie(this);
        }, function () {
            unzoomPie(this);
        });
    };

    var createPieLabel = function (r, x, y, value) {
        r.text(x, y, value).attr({ font: '20px Helvetica, Arial, sans-serif' }).attr({ fill: '#000' });
    };

    var drawPieCharts = function (elementName, labels, keys, vals) {
        var colors = ['#2ba8cb', '#68b6cb', '#8bbdcb', '#b4cdd4', '#d9dedf'];
        var labelTop = 50;
        var chartTop = 160;
        var margin = 40;
        var radius = 75;
        var start = 90;
        var offset = (radius * 2) + margin;
        
        var r = Raphael(elementName);
        createPieLabel(r, start, labelTop, labels[0]);
        createPieLabel(r, start + offset, labelTop, labels[1]);
        createPieLabel(r, start + (offset * 2), labelTop, labels[2]);
        createPieLabel(r, start + (offset * 3), labelTop, labels[3]);
        createPie(r, start, chartTop, radius, vals[0], keys[0], colors);
        createPie(r, start + offset, chartTop, radius, vals[1], keys[1], colors);
        createPie(r, start + (offset * 2), chartTop, radius, vals[2], keys[2], colors);
        createPie(r, start + (offset * 3), chartTop, radius, vals[3], keys[3], colors);
    }

    var request = function (url) {
        var script = document.getElementsByTagName('script')[0];
        var handler = document.createElement('script');
        handler.src = url;
        script.parentNode.insertBefore(handler, script);
    };

    var split_arrays = function (data, firstElement, secondElement) {
        var first = [], second = [];
        for (var i = 0; i < data.length; i++) {
            first[i] = data[i][firstElement];
            second[i] = data[i][secondElement];
        }
        return { 0: first, 1: second };
    }

    var prefix_array = function (data, prefix) {
        console.log(data);
        for (var i = 0; i < data.length; i++)
            data[i] = data[i] + prefix;        
        return data;
    }

    var global = 'coderbits', element = document.getElementById(global);
    if (element) {
        window[global] = function (data) {
            var labels = [], vals = [], keys = [];
            
            var top_languages = split_arrays(data.top_languages, 'name', 'count');
            labels[0] = 'Languages';
            keys[0] = prefix_array(top_languages[0], ' %%');
            vals[0] = top_languages[1];
            
            var top_environments = split_arrays(data.top_environments, 'name', 'count');
            labels[1] = 'Environments';
            keys[1] = prefix_array(top_environments[0], ' %%');
            vals[1] = top_environments[1];

            var top_frameworks = split_arrays(data.top_frameworks, 'name', 'count');
            labels[2] = 'Frameworks';
            keys[2] = prefix_array(top_frameworks[0], ' %%');
            vals[2] = top_frameworks[1];

            var top_tools = split_arrays(data.top_tools, 'name', 'count');
            labels[3] = 'Tools';
            keys[3] = prefix_array(top_tools[0], ' %%');
            vals[3] = top_tools[1];

            element.innerHTML = "";
            drawPieCharts(global, labels, keys, vals);

            delete window[global];
        };
        var username = element.getAttribute('data-coderbits-username'),
			safeUsername = username.replace(/[(''){};!@@#%&*]/gi, '');
		request('https://coderbits.com/' + safeUsername + '.json?callback=' + global);
    }
}