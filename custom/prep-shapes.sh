#!/bin/env bash
# Script to make new labels.json and split tif
# Backup labels.json, if you need to preserve the old one
# 20.4.2021 Mikko Strahlendorff 

$shp=$1
$gj=${shp:0:-4}.geojson
$lbl=labels.json

# make geojson from shape file
ogr2ogr $gj $shp
# make labels/latlon centroid information
geojson-polygon-labels -a -s "combine" $gj > $lbl
# split Featurecollection into single feature files
# if feature title changes adjust the key to another property
geojsplit -k "Trade Cont" -a 0 $shp
# make mini tifs for parcels, adjust static map then updated address!
# old2020 data: 
#parallel gdalwarp -cutline {} -crop_to_cutline /vsicurl/https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2020_09_02-UTM35.tif {.}.tif ::: *_x.geojson
# 2021 data:
parallel gdalwarp -overwrite -cutline {} -crop_to_cutline /vsicurl/https://pta.data.lit.fmi.fi/geo/harvestability/KKL_SMK_Suomi_2021_06_01-UTM35.tif {.}.tif ::: *_x.geojson
parallel gdalinfo -stats -hist {} ::: *_x.tif
