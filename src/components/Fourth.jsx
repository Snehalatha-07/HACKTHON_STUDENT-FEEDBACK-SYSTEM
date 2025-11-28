import React, { useState,useEffect } from 'react'

const Fourth = () => {
    const [x,setX] = useState(100);
    const [str,setStr]=useState("My name is vardhan");
    const[bool,setBool]=useState(true);
    const [users,setArray]= useState([10,20,30,40]);
  return (
    <div>
   <p>{x}</p>   
   <p>{str}</p>   
   <p>{JSON.stringify(bool)}</p>   
   <p>{str.slice(0,4)}</p> 
   {/* <p>{JSON.stringify(users)}</p>  
   <p>first number : {users[0]}</p> */}
   <p>{JSON.stringify(users)}</p>
   <p>First number :{users[0]}</p>
   <p>Second number :{users[1]}</p>
   <p>Third number :{users[2]}</p>
    </div>
  )
}

export default Fourth
