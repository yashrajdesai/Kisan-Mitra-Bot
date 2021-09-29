import React, { PureComponent, useEffect, useState} from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import {db} from "../../firebase.js";
import { doc, getDoc } from "firebase/firestore"
import { collection, getDocs } from 'firebase/firestore/lite';

const data01 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
    { name: 'Group E', value: 278 },
    { name: 'Group F', value: 189 },
];
  
  const data02 = [
    { name: 'Group A', value: 2400 },
    { name: 'Group B', value: 4567 },
    { name: 'Group C', value: 1398 },
    { name: 'Group D', value: 9800 },
    { name: 'Group E', value: 3908 },
    { name: 'Group F', value: 4800 }
    // { name: 'Group G', value: 3908 },
  ];

const Statistics = () => {

    const [queries, setQueries] = useState([]);

    async function getQueries(db) {
        const queriesCol = collection(db, 'statistics');
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
                    statQueries.push({
                        name: query.name,
                        value: query.value
                    })
                })

                resolve();
            });
              
            myPromise
                .then(() => {
                    setQueries(statQueries)
                })

        }
          
        fetchData();      
        
    },[])

    console.log(queries)

    return (
        <div>
            {/* <ResponsiveContainer width="100%" height="100%"> */}
                <PieChart width={400} height={400}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={queries}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                />
                <Tooltip />
                </PieChart>
            {/* </ResponsiveContainer> */}
        </div>
    )
}

export default Statistics

