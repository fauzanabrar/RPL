import axios from "axios";
import { useEffect, useState } from "react";
import { ReactComponent as Logo } from "./high-temperature-svgrepo-com.svg";

import qs from 'qs'
import { getsuhu } from "./utils/utils";
import LineGraph from './components/LineGraph';


export default function App() {
  const [temp, setTemp] = useState(0)
  const [safe, setSafe] = useState("Suhu Tidak Optimal")

  const [datasets, setDatasets]         = useState([])
  const [loadingChart, setLoadingChart] = useState(true)

  let arrTemp     = []
  let dataKosong = {
    labels  : arrTemp,
    datasets: [
      {
        label           : "Suhu",
        data            : arrTemp,
        borderColor     : 'rgb(255, 99, 132)',
        backgroundColor : 'rgba(255, 99, 132, 0.5)',
      }
    ]
  }

  const deleteData = () => {
      var config = {
          method  : 'delete',
          url     : 'https://boilerplate-mongomongoose2.fauzanabrar.repl.co/delete',
          headers : {'Content-Type': 'application/x-www-form-urlencoded'},
      };

      axios(config)
          .then(function (response) {
              // console.log(JSON.stringify(response.data));
              console.log("data berhasil dihapus")
          })
          .catch(function (error) {
              console.log(error);
          });
    
      arrTemp = []
  }

  const postDataToDatabase = (suhu, date) => {
    
    var body = qs.stringify({
      newTemp : suhu.toString(),
      newDate : date
    });

    var config = {
        method  : 'post',
        url     : 'https://boilerplate-mongomongoose2.fauzanabrar.repl.co/temp',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        data    : body
    };

    axios(config)
      .then(function (response) {
          // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
          console.log(error);
      });
  }

  const getDataFromDatabase = () => {
    axios
      .get('https://boilerplate-mongomongoose2.fauzanabrar.repl.co/temp?max=30')
      .then( (response) => {
        // handle success
        arrTemp = response.data.reverse()
        setLoadingChart(false)
        // console.log(response.data.map(item => item.temp));
      })
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const getData = async () => {
        const result  = await axios.get("http://localhost:5000/data");
        const data    = result.data[0];

        const suhu    = data.temp.toFixed(2);
        
        // const suhu = getsuhu(26);  // random suhu 

        setTemp(suhu);

        if (suhu > 27 || suhu < 24) {
          setSafe("Suhu Tidak Optimal")
        } else {
          setSafe("Suhu Optimal")
        }
        
        var newDate = new Date().toLocaleString()
        postDataToDatabase(suhu, newDate)
        await getDataFromDatabase()
        arrTemp.push({
          temp: suhu,
          date: newDate
        })
        

        setDatasets({
          labels  : (arrTemp || []).map((item) => new Date(item.date).getSeconds()),
          datasets: [
            {
              label           : "Suhu",
              data            : arrTemp.map((item) => item.temp),
              borderColor     : 'rgb(255, 99, 132)',
              backgroundColor : 'rgba(255, 99, 132, 0.5)',
            }
          ]
        })
        
      }
      getData();
    }, 3000);


    return () => {
      clearInterval(interval);
    };
  }, [] );

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center ">
        <div className="flex flex-col">
          <h1 className="w-max mx-auto rounded-2xl font-bold mt-10 py-5 px-10 bg-blue-500 text-white drop-shadow-lg">
            Monitoring Suhu dalam Air
          </h1>

          <div className="flex flex-col md:flex-row justify-around mt-5 justify-center items-center">

            <div className="border-sky-200 border-8 rounded-2xl  ">
              {(loadingChart) ? <LineGraph chartData={dataKosong}/> : <LineGraph chartData={datasets}/>}
            </div>

            <div className="flex flex-col items-center justify-center w-80 h-80 mx-4 mt-5 md:mt-0 rounded-2xl bg-sky-200 drop-shadow-lg">
              <h2 className="font-bold mb-5">Nilai Suhu Dalam Air</h2>
              <div className="flex items-center justify-center">
                <Logo className="w-20"/>
                <p className="font-semibold text-4xl">{temp} °C</p>
              </div>
              {(temp > 27 || temp < 24) ? <p className="text-xl text-red-500 mt-5">{safe}</p> : <p className="text-xl text-green-500 mt-5">{safe}</p>}
              <button className="bg-red-500 hover:bg-red-700 mt-8 text-white font-bold py-2 px-4 rounded" onClick={deleteData}>
                Hapus data
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

