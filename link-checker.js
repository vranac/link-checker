var links = [];

var casper = require("casper").create({
    logLevel: "debug",
    verbose: false,
    viewportSize: {
        width: 1280,
        height: 1024
    }

});

var pathToSave = 'link-errors';

var d=new Date();

var currentDate = d.getDate();
var currentMonth = d.getMonth() + 1; //Months are zero based
var currentYear = d.getFullYear();
var currentHour = d.getHours();
var currentMinute = d.getMinutes();
var currentSeconds = d.getSeconds();

var current = currentYear + '-' +
            (currentMonth < 10 ? '0' : '') + currentMonth + '-' +
            (currentDate < 10 ? '0' : '') + currentDate + ' at ' +
            (currentHour < 10 ? '0' : '') + currentHour + '.' +
            (currentMinute < 10 ? '0' : '') + currentMinute + '.' +
            (currentSeconds < 10 ? '0' : '') + currentSeconds;

if (!casper.cli.has("url") || casper.cli.get("url") === true) {
    casper
        .echo("No url option passed")
        .echo("Usage: $ casperjs linkchecker.js --url=URL_TO_VISIT")
        .exit();
}

var BASE_URL = casper.cli.get("url");

if (BASE_URL.lastIndexOf('/') == BASE_URL.length-1) {
    BASE_URL = BASE_URL.substr(0, BASE_URL.length-1);
}

function getLinks() {
    var links = document.querySelectorAll('a');
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute('href');
    });
}

casper.start(BASE_URL);

casper.then(function() {
    // aggregate results
    links = this.evaluate(getLinks);
    this.echo(links.length + ' links found');
});

casper.then(function() {
    casper.each(links, function(self, link, i){
        if (link.indexOf('mailto:') == 0) {
            return true;
        }
        if (link.indexOf('http') == -1 && link.indexOf('www') != 0 && link.indexOf('mailto:') != 0) {
            if (link.indexOf('#') == 0) {
                link = BASE_URL + '/' + link;
            } else {
                link = BASE_URL + link;

            }
        }

        casper.thenOpen(link, function() {
            this.echo("Checking link " + link);
        });
        casper.then(function() {
            var status = this.status();
            var currentHTTPStatus = status['currentHTTPStatus'].toString();
            // I only care about 4xx and 5xx statuses YMMV
            if (currentHTTPStatus.charAt(0) == "4" || currentHTTPStatus.charAt(0) == "5") {

                var slug = link.replace(/[^a-zA-Z0-9]/gi, '-').replace(/^https?-+/, '');

                this.echo('  ' + currentHTTPStatus + ' error status');
                var filename = pathToSave + '/' + current + '/' + slug + ".png";
                this.captureSelector(filename, 'body');
            }
        });
    });
})

casper.run(function() {
    this.echo("Done").exit();
});