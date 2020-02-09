(function (d3) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var LineGraph = function (years) { return __awaiter(void 0, void 0, void 0, function () {
        var margin, width, height, svg, parseTime, fullData, rawData, data, x, y, countLine, countLines, color, legendSpace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    margin = 100;
                    width = window.innerWidth - 2 * margin;
                    height = window.innerHeight - 4 * margin;
                    svg = d3.select('#graphs')
                        .append('svg')
                        .attr('width', width + 1.9 * margin)
                        .attr('height', height + 1.9 * margin)
                        .append('g')
                        .attr('transform', 'translate(' + margin + ',' + margin + ')');
                    parseTime = d3.timeParse('%m-%d');
                    return [4 /*yield*/, d3.csv('data/counts-by-year.csv')];
                case 1:
                    fullData = _a.sent();
                    rawData = years ? fullData.filter(function (d) { return years.includes(d.year); }) : fullData;
                    data = rawData.map(function (d) { return ({
                        year: d.year,
                        date: parseTime(d.date),
                        count: Number(d.count)
                    }); });
                    x = d3.scaleTime()
                        .range([0, width])
                        .domain(d3.extent(data, function (d) { return d.date; }));
                    y = d3.scaleLinear()
                        .range([height, 0])
                        .domain([0, d3.max(data, function (d) { return d.count; })]);
                    countLine = d3.line()
                        .x(function (d) { return x(d.date); })
                        .y(function (d) { return y(d.count); })
                        .curve(d3.curveCatmullRom);
                    countLines = d3.nest()
                        .key(function (d) { return d.year; })
                        .entries(data);
                    color = d3.scaleOrdinal(d3.schemeCategory10);
                    legendSpace = width / countLines.length // spacing for the legend
                    ;
                    countLines.forEach(function (d, i) {
                        smooth(d.values, 2);
                        smooth(d.values, 5);
                        smooth(d.values, 15);
                        // compute mean and title
                        var counts = d.values.map(function (v) { return v.count; });
                        var mean = Math.floor(d3.mean(counts) / 100) * 100;
                        var title = d.key + ', ' + mean + '/Tag';
                        // add the line
                        svg
                            .append('path')
                            .attr('class', 'line')
                            .style('stroke', function () { return (d['color'] = color(d.key)); })
                            .attr('d', countLine(d.values));
                        // add title
                        svg
                            .append('text')
                            .attr('class', 'legend')
                            .attr('x', legendSpace / 2 + i * legendSpace)
                            .attr('y', 0)
                            .style('fill', function () { return (d['color'] = color(d.key)); })
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
                    return [2 /*return*/];
            }
        });
    }); };
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

    // BarChart('2012', 'blue')
    // BarChart('2013', 'green')
    // BarChart('2014', 'red')
    // BarChart('2015', 'black')
    // BarChart('2016', 'blue')
    // BarChart('2017', 'green')
    // BarChart('2018', 'red')
    // BarChart('2019', 'black')
    // LineGraph(['2019'])
    // LineGraph(['2013', '2016', '2019'])
    // LineGraphFull()
    var selectedYears = ['2013', '2018'];
    LineGraph(selectedYears);
    var onYearsChange = function (e) {
        var changedYear = e.target;
        if (changedYear.checked)
            selectedYears.push(changedYear.value);
        else
            selectedYears = selectedYears.filter(function (year) { return year !== changedYear.value; });
        document.querySelector('#graphs').innerHTML = '';
        LineGraph(selectedYears);
    };
    document
        .querySelectorAll('.checkbox')
        .forEach(function (checkbox) { return checkbox.addEventListener('change', onYearsChange); });

}(d3));
