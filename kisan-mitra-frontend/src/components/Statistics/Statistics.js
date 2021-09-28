import React,{useEffect} from 'react'
import {db} from "../../firebase.js"
import { collection, getDocs } from 'firebase/firestore/lite';

const Statistics = () => {

    async function getQueries(db) {
        const queriesCol = collection(db, 'queries');
        const querySnapshot = await getDocs(queriesCol);
        const queryList = querySnapshot.docs.map(doc => doc.data());
        return queryList;
      }

    useEffect(() => {
        console.log(getQueries(db))
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Statistics
