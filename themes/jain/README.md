Jain
=====

Theme used for Atishay Jain's personal website.

Tested With Hugo Version: Hugo 0.46

## Images
* `assets/image/favicon.png` - Favicon PNG Version
* `assets/image/favicon.svg` - Favicon SVG Version (Hugo does not support SVG to PNG)
* `assets/image/logo.svg` - Logo - Aspect Ratio - (130x47 - Hugo does not support getting image size for svg)

## Menus
* `top` - Top menu shown in the header. Supports one nested level of submenus. Uses the Section name to find the appropriate top level item to highlight.

## Template blocks
* `favicon` - Present in the `<head>` tag. Defaults to basic favicon and basic apple touch icon support.
* `social` - All the data for open graph, twitter cards and JSON-LD. Contains sub-blocks
    * `opengraph` - For Open Graph tags
    * `meta` - General meta tags like description and canonical url.
    * `jsonld` - JSON-LD for Google.

## Settings
* `Site.Params.CSP` Set true to enable CSP. *Please test with production environment flag with this*. In production prevents live reload.
* `Site.Params.custom_css` Custom CSS File for overrides

## Browsers

* This theme uses all modern CSS like CSS Variables, CSS Grid and flexbox. Do not expect this to support older browsers.
