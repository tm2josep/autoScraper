# Auto Scraper

## Usage

Set your scraper-config.js how you'd like it; according to this format:
```
{
    "baseUrl": <target website>,
    "groups": {
        <group-name>:{
            "urls":[
                <sub-url of page>
            ],
            "selector": <jquery selector of parent-most item>,
            "outputFile":<output file to make (must be comma delimmited csv)>,
            "scrape": {
                <field name in camel case>: {
                    "selector": <jquery selector inside parent selector>,
                    "name":<name to put on top row of csv (column header)>,
                    "options": {
                        "attribute": <attribute on html element, eg: href>,
                        "prependBaseUrl":<boolean, if you want to add the base url to the beginning>,
                        "excludeSiblings":<boolean, if you want the text nodes inside a node ignoring the other children elements>
                    }
                }
                ... other field names you want ...
            }
        },
        ... other groups you want ...
    }
}
```

Repo includes example scraping from J&J Cards and Collectibles in Waterloo. 

## License

MIT. Go nuts.