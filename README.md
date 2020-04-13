# Cities as Stars

This project was a for-fun copy-cat of  [Nadieh Brenner's star map of Hubble observations](https://www.visualcinnamon.com/2020/04/designing-the-hubble-skymap "Nadieh Brenner's star map of Hubble observations").

Her original work uses a stereographic projection of the sky, hence the two circles. Mine is a basic earthly projection of the city of Boston and I only used the two-circle layout in some screenshtos for visual interest.

This project uses d3 geo and HTML5 Canvas to draw 225k+ city elements from Boston's [open data website](https://data.boston.gov/ "open data website") and styles them as the celestial bodies in Nadieh's work.

Drawing to Canvas is relevant because SVG typically can't handle more than a couple thousand SVG elements. Canvas is a lower level drawing interface that is far more performant by virtue of never drawing to the DOM. Canvas interactions and animations have to be implemented manually so it's best suited for large static data-driven visuals.

The largest data drawn was Boston's "trees" at 31mb of geoJson. Buildings and street addresses killed the tab at 105mb and 63mb respectively.
