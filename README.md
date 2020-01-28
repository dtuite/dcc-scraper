# Dublin City Council Planning Application Scraper

This is a web scraper for the [Dublin City Council planning website](http://www.dublincity.ie/swiftlg/apas/run/wphappcriteria.display).

It's capable of scraping:

 1. All of the results from a Search of the DCC planning website
 2. In-depth details of individual planning applications
 3. The documents associated with each planning application

It is set up to scrape to a local sqlite3 database and create associations between planning
applications and their documents.

It doesn't actually download any documents. It just records their details.

# Using the DCC Search

 - To get a search URL that can be scraped, you must perform a search manually, then navigate to the second page and back to the first page. Insert this URL into the `src/searchResults/scrape.js` page with the `startIndex` URL parameter passed in from the function.
 - The format of the Date Registered From field is `dd-mmm-YYYY`. For example: "01-jan-2019".

# Further work

 1. The scraper doesn't attempt to figure out how many pages of results there are in a
    particular planning application search. The number of pages to paginate is hardcoded.
 2. It doesn't yet record the planning decision.
 3. It's not capable of executing searches automatically. You have to manually run a search
    then feed the search URL into the code to scrape the results.
