import {useState, useEffect, useRef} from 'react';
import './App.css';
let data = [];

const RandomJokeRetreval = async (item_type) => {
    console.log(item_type);
    // calling the api to get the random joke
    const response2 = await fetch("http://localhost:8050/random-joke", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            joke_type: item_type,
        }),
    });
    const the_response2 = await response2.json();
    console.log(the_response2);
    if (the_response2.status == "ok") {
        data = [];
        console.warn(the_response2.data._id.toString());
        console.warn(the_response2.data.description.toString());
        data.push(the_response2.data._id);
        data.push(the_response2.data.description);
        data.push(the_response2.data.type);
        return data;
    }
}

export default RandomJokeRetreval;