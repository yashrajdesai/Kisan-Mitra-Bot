import React, { useEffect, useState} from 'react'; // PureComponent
import { Container, Row, Col } from 'react-bootstrap'; 
import {  PieChart, Pie, Tooltip, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import {db} from "../../firebase.js";
// import { doc, getDoc } from "firebase/firestore"
import { collection, getDocs } from 'firebase/firestore/lite';
import IndiaMapStatistics from './IndiaMapStatistics.js';

const Statistics = () => {

    const [queries, setQueries] = useState([]);
    const [usersStatsQueries, setUsersStatsQueries] = useState([]);

    async function getQueries(db) {
        const queriesCol = collection(db, 'statistics');
        const querySnapshot = await getDocs(queriesCol);
        const queryList = querySnapshot.docs.map(doc => doc.data());
        return queryList;
    }

    async function getUsersStatsQueries(db) {
        const queriesCol = collection(db, 'usersStats');
        const querySnapshot = await getDocs(queriesCol);
        const queryList = querySnapshot.docs.map(doc => doc.data());
        return queryList;
    }

    useEffect(() => {

        async function fetchData() {

            var queries = [];
            var userStatsQueries = []

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

            const usersStatePromise = new Promise(async(resolve, reject) => {
                userStatsQueries = await getUsersStatsQueries(db)
        
                userStatsQueries.map((query) => (
                    statQueries.push({
                        name: query.name,
                        value: query.value
                    })
                ))

                resolve();
            });
                
            usersStatePromise
                .then(() => {
                    setUsersStatsQueries(userStatsQueries)
                })

        }
          
        fetchData();      
        
    },[])

    
    const data = [
        {
        name: 'Page A',
        uv: 4000,
        // pv: 2400,
        // amt: 2400,
        },
        {
        name: 'Page B',
        uv: 3000,
        // pv: 1398,
        // amt: 2210,
        },
        {
        name: 'Page C',
        uv: 2000,
        // pv: 9800,
        // amt: 2290,
        },
        {
        name: 'Page D',
        uv: 2780,
        // pv: 3908,
        // amt: 2000,
        },
        {
        name: 'Page E',
        uv: 1890,
        // pv: 4800,
        // amt: 2181,
        },
        {
        name: 'Page F',
        uv: 2390,
        // pv: 3800,
        // amt: 2500,
        },
        {
        name: 'Page G',
        uv: 3490,
        // pv: 4300,
        // amt: 2100,
        },
    ];

    console.log(queries)

    return (
        <div>
            
            <Container>
                <Row>
                    <Col md={6} xs={12}>
                        <h1 className="text-center mt-3 mb-4 mt-md-5">Query Types Asked By User</h1>
                        <div className="d-flex justify-content-center border border-3 border-success mx-auto" style={{width: "fit-content"}}>
                            <PieChart width={400} height={400}>
                            <Pie
                                dataKey="value"
                                isAnimationActive={false}
                                data={queries}
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            />
                            <Tooltip />
                            </PieChart>
                        </div>
                    </Col >

                    <Col md={6} xs={12}>
                        <h1 className="text-center mt-3 mb-4 mt-md-5">No. of users in each state</h1>
                        <div className="d-flex justify-content-center border border-3 border-success mx-auto" style={{width: "fit-content"}}>
                            <BarChart width={400} height={400} data={usersStatsQueries}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </div>
                    </Col>

                </Row>       
                
            </Container>


            <IndiaMapStatistics/>    
            
        </div>
    )
}

export default Statistics

