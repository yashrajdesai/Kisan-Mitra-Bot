import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import { collection, getDocs } from 'firebase/firestore/lite';
import {db} from "../../firebase.js";
import { async } from '@firebase/util';




/**
* Courtesy: https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json
* Looking topojson for other countries/world? 
* Visit: https://github.com/markmarkoh/datamaps
*/
const INDIA_TOPO_JSON = require('./IndiaMap.json');

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937] // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = [
  '#ffedea',
  '#ffcec5',
  '#ffad9f',
  '#ff8a75',
  '#ff5533',
  '#e2492d',
  '#be3d26',
  '#9a311f',
  '#782618'
];

const DEFAULT_COLOR = '#EEE';

const getRandomInt = () => {
  return parseInt(Math.random() * 100);
};

const geographyStyle = {
  default: {
    outline: 'none'
  },
  hover: {
    fill: '#ccc',
    transition: 'all 250ms',
    outline: 'none'
  },
  pressed: {
    outline: 'none'
  }
};

// will generate random heatmap data on every call




function App() {

    const [data, setData] = useState([]);

      async function getQueries(db) {
        const queriesCol = collection(db, 'queryStatistics');
        const querySnapshot = await getDocs(queriesCol);
        const queryList = querySnapshot.docs.map(doc => doc.data());
        return queryList;
    }

    useEffect(() => {
      async function fetchData() {

            var queries = [];

            var statQueries = [];
            
            const myPromise = new Promise(async(resolve, reject) => {
                queries = await getQueries(db)
        
                queries.map((query) => {
                    statQueries.push(
                        query
                    )
                })

                resolve();
            });
              
            myPromise
                .then(() => {
                    setData(statQueries)
                })

        }
          
        fetchData();      
        
    },[])

  const [tooltipContent, setTooltipContent] = useState('');
  

  const gradientData = {
    fromColor: COLOR_RANGE[0],
    toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
    min: 0,
    max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
  };

  const colorScale = scaleQuantile()
    .domain(data.map(d => d.value))
    .range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: 'NA' }) => {
    return () => {
      setTooltipContent(`${geo.properties.name}: ${current.value}`);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent('');
  };

  const onChangeButtonClick = () => {
    setData(data);
  };

  return (
    <div className="full-width-height container">
      <h1 className="no-margin center">States and UTs</h1>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
        <ComposableMap
          projectionConfig={PROJECTION_CONFIG}
          projection="geoMercator"
          width={600}
          height={220}
          data-tip=""
        >
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                //console.log(geo.id);
                const current = data.find(s => s.id === geo.id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                    style={geographyStyle}
                    onMouseEnter={onMouseEnter(geo, current)}
                    onMouseLeave={onMouseLeave}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {/* <LinearGradient data={gradientData} /> */}
        <div className="center">
          <button className="mt16" onClick={onChangeButtonClick}>Change</button>
        </div>
    </div>
  );
}

export default App;