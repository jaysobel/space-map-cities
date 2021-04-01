# Cities as Stars

This project was a for-fun copy-cat of  [Nadieh Brenner's star map of Hubble observations](https://www.visualcinnamon.com/2020/04/designing-the-hubble-skymap "Nadieh Brenner's star map of Hubble observations").

Her original work uses a stereographic projection of the sky. That means the two containing circles in her diagram represent the sky as seen from the north and south pole of Earth. 

My version uses two circles containers for fun. Both contain a basic earthly projection of the same area of the city of Boston.

Here are two high-res screenshots from the 'screenshots' folder (scroll sideways to view second circle)

https://github.com/73805/space-map-cities/blob/master/screenshots/varied_contour_params.PNG

https://github.com/73805/space-map-cities/blob/master/screenshots/smaller_points_and_finer_contours.PNG

I used d3 geo and HTML5 Canvas to draw 225k+ city elements from Boston's [open data website](https://data.boston.gov/ "open data website") and styled them as the celestial bodies in Nadieh's work.

The largest data source was Boston's "trees" at 31mb of geoJson. Buildings and street addresses killed the tab at 105mb and 63mb respectively. 

The usage of Canvas is notable, as Nadieh's blog explains, because it's a lower-level drawing interface than SVG. In SVG every "element" of a drawing becomes an element in the HTML DOM which means it grinds to a halt ~2,000 elements. 

Canvas draws with pixels which raises the volume of drawn "elements" substantially. The downside is that basic web interactivity-click on thing- thinks of the 'thing' as a DOM element. 
