CasperJS quick link checker
===========================

Simple script to help you out when you deploy a website and need a quick check to see if all pages are online.

The script will make a screenshot of the page if the status code is 4xx or 5xx.

Just call casperjs link-checker.js --url=URL from terminal/prompt,
where URL is the URL you want to check.

The script will save to link-errors/DATE/SLUG.png

Example:

casperjs link-checker.js --url=http://twitter.github.com/bootstrap/examples/fluid.html

Requirements
------------

[CasperJS](http://casperjs.org/)
