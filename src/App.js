import React, { useState, useEffect } from "react";
import { render } from "react-dom";

const BASE_URL = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';
const FIRST_PAGE_URL = `${BASE_URL}/api/products/1`;
const CUBIC_WEIGHT_CONVERSION_FACTOR = 250;


const App = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [fetchUrl, setFetchUrl] = useState(FIRST_PAGE_URL);
  const [airCons, setAirCons] = useState([]);
  const [average, setAverage] = useState("n/a");

  useEffect(
    () => {
      const calcCubicWeight = (length,height,width) => {
        return (length/100) * (height/100) * (width/100) * CUBIC_WEIGHT_CONVERSION_FACTOR;
      }
      const calcAverageCubicWeight = (objects) => {
        let cubic_weight_total = 0;
        objects.map((object) => {
          cubic_weight_total += object.cubicWeight;
        })
        return cubic_weight_total / objects.length;
      }
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => {
          let { objects, next } = data;
          let airConsThisPage = airCons;

          objects.map((object) => {
            // filters out other product categories
            if ( object.category == 'Air Conditioners' ){
              let { height, length, width } = object.size;
              object.cubicWeight = calcCubicWeight(height, length, width);
              // console.log('push', height, length, width, object.cubicWeight);
              airConsThisPage = [ ...airConsThisPage, object ];
            }
          });

          setAirCons(airConsThisPage);

          if(next){
            setFetchUrl(`${BASE_URL}${next}`)
          }else{
            setIsFetching(false);
            setAverage( calcAverageCubicWeight(airCons) );
          }
        })

    },
    [ fetchUrl ]
  )
  return (
    <React.StrictMode>
      { isFetching && 
        <div>LOADING...</div>
      }
      { !isFetching && 
        <>
        <h1>Kogan Coding Challenge 1 - Yoseph Andreas</h1>
        <div>Total Number of Air Conditioners: {airCons.length}</div>
          <table>
            <tbody>
              <tr>
                <th>Title</th>
                <th>Length (m)</th>
                <th>Height (m)</th>
                <th>Width (m)</th>
                <th>Weight (kg)</th>
                <th>Cubic Weight (kg)</th>
              </tr>
            {airCons.map((aircon,idx) => (
              <tr key={idx}>
                <td>{aircon.title}</td>
                <td>{aircon.size.length / 100}</td>
                <td>{aircon.size.height / 100}</td>
                <td>{aircon.size.width / 100}</td>
                <td>{aircon.weight / 1000}</td>
                <td>{aircon.cubicWeight}</td>
              </tr>
            ))}
            </tbody>
          </table>

          <h3 colSpan="5">Averate Cubic Weight: {average}kg</h3>
        </>
      }
    </React.StrictMode>
  );
}

render(<App />, document.getElementById("root"));
