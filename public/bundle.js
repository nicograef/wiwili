(function (d3) {
    'use strict';

    var colors = {
        2012: 'orange',
        2013: 'red',
        2014: 'darkgreen',
        2015: 'brown',
        2016: 'purple',
        2017: 'green',
        2018: 'blue',
        2019: 'darkred',
        2020: 'brown',
        2021: 'darkyellow'
    };

    var LineGraph = function (data) {
        // set the dimensions and margins of the graph
        var axisOffset = 50;
        var svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + axisOffset + ', ' + axisOffset + ')');
        var width = document.getElementsByTagName('svg')[0].clientWidth - 2 * axisOffset;
        var height = document.getElementsByTagName('svg')[0].clientHeight - 2 * axisOffset;
        // set the ranges
        var x = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, function (d) { return d.date; }));
        var y = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, 18000]);
        // .domain([0, d3.max(data, d => d.count)])
        var countLine = d3.line()
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.count); });
        // .curve(d3.curveCatmullRom)
        var countLines = d3.nest()
            .key(function (d) { return d.year; })
            .entries(data);
        var legendSpace = width / countLines.length; // spacing for the legend
        countLines.forEach(function (d, i) {
            // compute mean and title
            var counts = d.values.map(function (v) { return v.count; });
            var mean = Math.floor(d3.mean(counts) / 100) * 100;
            var title = d.key + ', ' + mean + '/Tag';
            // add the line
            svg
                .append('path')
                .attr('class', 'line')
                .style('stroke', colors[d.key])
                .attr('d', countLine(d.values));
            // add title
            svg
                .append('text')
                .attr('class', 'legend')
                .attr('x', legendSpace / 2 + i * legendSpace)
                .attr('y', 0)
                .style('fill', colors[d.key])
                .text(title);
        });
        // add the x Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));
        // add the y Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(y));
    };

    var BarChart = function (data) {
        // set the dimensions and margins of the graph
        var axisOffset = 50;
        var svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + axisOffset + ', ' + axisOffset + ')');
        var width = document.getElementsByTagName('svg')[0].clientWidth - 2 * axisOffset;
        var height = document.getElementsByTagName('svg')[0].clientHeight - 2 * axisOffset;
        var x = d3.scaleTime()
            .range([0, width])
            .domain(d3.extent(data, function (d) { return d.date; }));
        var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 18000]);
        // .domain([0, d3.max(data, d => d.count)])
        var countsPerYear = d3.nest()
            .key(function (d) { return d.year; })
            .entries(data);
        var legendSpace = width / countsPerYear.length;
        countsPerYear.forEach(function (d, i) {
            var barWidth = width / 365 / countsPerYear.length;
            var xOffset = barWidth * i;
            // compute mean and title
            var counts = d.values.map(function (v) { return v.count; });
            var mean = Math.floor(d3.mean(counts) / 100) * 100;
            var title = d.key + ', ' + mean + '/Tag';
            svg
                .selectAll('.bar')
                .data(d.values)
                .enter()
                .append('rect')
                .attr('fill', colors[d.key])
                .attr('x', function (d) { return x(d.date) + xOffset; })
                .attr('width', barWidth)
                .attr('y', function (d) { return y(d.count); })
                .attr('height', function (d) { return height - y(d.count); });
            // add title
            svg
                .append('text')
                .attr('class', 'legend')
                .attr('x', legendSpace / 2 + i * legendSpace)
                .attr('y', 0)
                .style('fill', colors[d.key])
                .text(title);
        });
        // add the x Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));
        // add the y Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(y));
    };

    var parseTime = d3.timeParse('%m-%d');
    var parseTimeWithYear = d3.timeParse('%Y-%m-%d');
    d3.csv('data/counts-by-year.csv').then(function (rawData) {
        var selectedYears = ['2013', '2018', '2020'];
        var selectedSmoothing = ['3-tage', '10-tage'];
        var selectedChartType = 'bar-chart';
        var selectedChartMode = 'comparison';
        var updateGraph = function () {
            // Create new copy every time so we don't mess with the original data set
            var currentCopy = rawData.map(function (d) { return ({
                year: d.year,
                date: selectedChartMode === 'comparison'
                    ? parseTime(d.date)
                    : parseTimeWithYear(d.year + '-' + d.date),
                count: Number(d.count)
            }); });
            // smooth over the whole dataset so filtering does not affect smoothing.
            // problem: when year 2013 and year 2017 selected: smooth algorithm will calculat december 2013 into january 2017
            if (selectedSmoothing.includes('3-tage'))
                smooth(currentCopy, 2);
            if (selectedSmoothing.includes('10-tage'))
                smooth(currentCopy, 5);
            if (selectedSmoothing.includes('1-monat'))
                smooth(currentCopy, 15);
            if (selectedSmoothing.includes('3-monate'))
                smooth(currentCopy, 45);
            // Filter by years
            var filteredData = currentCopy.filter(function (d) { return selectedYears.includes(d.year); });
            // Clear graph area
            document.querySelector('svg').innerHTML = '';
            // render selected chart
            if (selectedChartType === 'line-chart')
                LineGraph(filteredData);
            else if (selectedChartType === 'bar-chart')
                BarChart(filteredData);
        };
        var onYearsChange = function (e) {
            var changedYear = e.target;
            if (changedYear.checked)
                selectedYears.push(changedYear.value);
            else
                selectedYears = selectedYears.filter(function (year) { return year !== changedYear.value; });
            updateGraph();
        };
        var onSmoothingChange = function (e) {
            var changedSmoothing = e.target;
            if (changedSmoothing.checked)
                selectedSmoothing.push(changedSmoothing.value);
            else
                selectedSmoothing = selectedSmoothing.filter(function (smoothing) { return smoothing !== changedSmoothing.value; });
            updateGraph();
        };
        var onChartTypeChange = function (e) {
            var clickedChartType = e.target;
            selectedChartType = clickedChartType.value;
            updateGraph();
        };
        var onChartModeChange = function (e) {
            var clickedChartMode = e.target;
            selectedChartMode = clickedChartMode.value;
            updateGraph();
        };
        document.querySelectorAll('#years .checkbox').forEach(function (checkbox) {
            var year = checkbox.children[1].value;
            checkbox.style.background = colors[year];
            checkbox.addEventListener('change', onYearsChange);
        });
        document
            .querySelectorAll('#smoothing .checkbox')
            .forEach(function (checkbox) { return checkbox.addEventListener('change', onSmoothingChange); });
        document.querySelector('#chart-type').addEventListener('change', onChartTypeChange);
        document.querySelector('#chart-mode').addEventListener('change', onChartModeChange);
        updateGraph();
    });
    var smooth = function (data, avgWidth) {
        // smoothing with forward moving average
        data.forEach(function (d, i) {
            var localAvgWidth = avgWidth;
            if (i < avgWidth)
                localAvgWidth = i;
            else if (i >= data.length - avgWidth)
                localAvgWidth = data.length - i - 1;
            var localData = data.slice(i - localAvgWidth, i + localAvgWidth + 1);
            var localAverage = d3.mean(localData.map(function (d) { return d.count; }));
            d.count = localAverage;
        });
    };

}(d3));
