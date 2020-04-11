# space-map-cities

I really liked Nadieh Brenner's star map of Hubble observations

https://www.visualcinnamon.com/2020/04/designing-the-hubble-skymap

so I decided to learn d3 geo-projecting and plot cities with the same theme. Nadieh's code is not public so I figured it all out myself (aka copy-pasted one hundred different d3 examples and hacked them together).

This project plots just over 225,000 publicly shared GIS points to an HTML5 Canvas element which is cool because SVGs make the browser sweat at a thousand elements. 

The density contours come directly from Nadieh's work and are totally meangingless.

Data comes from:

Boston Open Data 
https://data.boston.gov/

Camrbridge Open Data
https://www.cambridgema.gov/departments/opendata

and probably should have gotten Brookline involved too.

"trees" (31mb was the largest geoJSON file that would draw without killing the tab. Buildsings (105mb) and street addresses (63mb) killed the tab. They could probably be reduced by removing their metadata but I didn't attempt it. 

