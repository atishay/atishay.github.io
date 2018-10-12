Jain
=====

Theme used for Atishay Jain's personal website.

Tested With Hugo Version: Hugo 0.48

## Layout Types
* `Default` No neeed to enter thetype parameter. Default is a blog post.
* `Simple` Used for pages where the content does not have a sidebar, just header, rendered markdown and footer. Supported front matter additions
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

* The footer contains up to sections that can be specified in the front matter. The template has special column arrangement for the sectioning as defined below.
* There can be modified in the settings as an array in `Site.Params.Footer` with the following options
    * `title` - Title of the section.
    * `content` - In Markdown
    * `image` - Show an image in the section (by default pulled to the left with 50% width).
    * `recent` - Name of the section to show recents from.
    * `recentCount` - Count for the recent range.
    * `contact` - Optimized version of the contact us snippets. The order and contents are not customizable as you can still use markdown to make a custom version.

## Column arrangements
CSS Grids are used for column arrangements in the most logical manner.
* 1 - Single Item
* 2 - Two items till `md`
* 3 - Three items till `lg`
* 4 - 4 items till `xl`, 2 2 till `md`
* 5 - 2 3 till `lg`, 2 2 1 till `md`
* 6 - 3 3 till `lg`, 2 2 2 till `md`
* 7 - 3 4 till `xl`, 3 3 1 till `lg`, 2 2 2 1 till `md`
* 8 - 4 4 till `xl`, 2 2 2 2 till `md`
* 9 - 3 3 3 till `lg`
* 12 - 4 4 4 till `xl`, 3 3 3 3 till `lg`, 2 2 2 2 2 2 till `md`

8 and 9 can be further improved if needed.

## Settings
* `Site.Params.CSP` Set true to enable CSP. *Please test with production environment flag with this*. In production prevents live reload.
* `Site.Params._topSubMenu` Setting to optimize the header generation speed. If the top menu has no submenu, set this to false.
* `Site.Params.custom_css` - Custom CSS File for overrides.
* `Site.Params.github` - Github link for the octocat on top right.
* `Site.Params.custom_css` - Custom CSS Overrides file.
* `Site.Author` - Contains `facebook`, `twitter`, `github`, `email`,  `linkedin` and `name` fields.
* `Site.Params.color` - Default theme color.
* `Site.Params.description` - Default Description.
* `Site.Params.sidebar` - Shared sidebar for all posts. Will be available under the post specific sidebar.
* `Site.Params.sharedHeader` - List of sections where the header has no changes (like blogs unless we have a submenu). This cached headers to improve performance.
* `Site.Params.Tex` - tex2svg hosted location.
* ``Site.Params.Guitar` - guitar2svg hosted location.

## Browsers

* This theme uses all modern CSS like CSS Variables, CSS Grid and flexbox. Do not expect this to support older browsers.

## Posts
* Use Hugo Page Bundles for posts. The theme expects each page to have a beautiful image.

## Top Matter
* `sidebar` - You can add stuff to the page sidebar by using a the front matter and passing a list to `sidebar` with `title` and `content` properties. `content` can be markdown.
* `coverAnchor` - Add anchoring position for the cover image.

## Shortcodes
* `fig` Same as `figure`, but added support for responsive resizing of images.
* `tex` Renders Latex as SVG. Optional parameter `inline` for inline latex. Needs `Site.Params.Tex` for the `tex2svg` hosting.
* `guitar` Renders guitar tabs and chords using jtab. Needs ``Site.Params.Guitar` for the `guitar2svg` hosting.
