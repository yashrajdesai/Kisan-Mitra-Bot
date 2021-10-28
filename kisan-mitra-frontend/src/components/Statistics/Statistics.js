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
            var totalUsers = []

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
               const users = await getUsersStatsQueries(db)
        
               users.map((query) => (
                    totalUsers.push({
                        name: query.name,
                        value: query.value
                    })
                ))

                resolve();
            });
                
            usersStatePromise
                .then(() => {
                    setUsersStatsQueries(totalUsers)
                })

        }
          
        fetchData();      
        
    },[])

    

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

