Jain
=====

Theme used for Atishay Jain's personal website.

Tested With Hugo Version: Hugo 0.47

## Layout Types
* `Default` No neeed to enter thetype parameter. Default is a blog post.
* `Simple` Used for pages where the content does not have a sidebar, just header, rendered markdown and footer. Supoprtted front matter additions
    * `subtitle` For subtitle.

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

## Footer

* The footer contains 4 sections that can be specified in the front matter.
* The first section is called about and the second is called disclaimer but the text cn be modified in the settings as an array in `Site.Params.Footer` with the following options
    * `title` - Title of the section.
    * `description` - In Markdown
    * `image` - Show an image in the section (by default pulled to the left with 50% width).
    * `recent` - Name of the section to show recents from.
    * `recentCount` - Count for the recent range.
    * `contact` - Optimized version of the contact us snippets. The order and contents are not customizable as you can still use markdown to make a custom version.


## Settings
* `Site.Params.CSP` Set true to enable CSP. *Please test with production environment flag with this*. In production prevents live reload.
* `Site.Params.custom_css` - Custom CSS File for overrides.
* `Site.Params.github` - Github link for the octocat on top right.
* `Site.Params.custom_css` - Custom CSS Overrides file.
* `Site.Author` - Contains `facebook`, `twitter`, `github`, `email`,  `linkedin` and `name` fields.
* `Site.Params.color` - Default theme color.
* `Site.Params.description` - Default Description.

## Browsers

* This theme uses all modern CSS like CSS Variables, CSS Grid and flexbox. Do not expect this to support older browsers.
