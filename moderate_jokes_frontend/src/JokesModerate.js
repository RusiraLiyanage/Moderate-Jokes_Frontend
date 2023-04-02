import {useState, useEffect, useRef} from 'react';
import './App.css';
import RandomJokeRetreval from './randomJokeRetreval.js';
import Swal from 'sweetalert2'
function JokesModerate(){
    // to retriew types from the database
    const [types, settypes] = useState([]);
    // to grab the chosen type option
    const [the_type, setoptions] = useState();
    // to grab the id for put request purpose
    const [the_id, setid] = useState();
    // to grab the new type for put request purpose - if not satisfied with the existing ones
    const [new_type, setnewtype] = useState();
    // to take the description
    const [description, setdescription] = useState();
    // to make loading capability
    const [loading, setloading] = useState(false);
    //to facilitate useEffect circumstance
    const effectRun = useRef(false);

    useEffect(() => {
        // handling useEffect accordingly to avoid calling it twise (React update after version 18)
        if(effectRun.current == false){
          const fetch_types = async () => {
            fetch("http://localhost:8050/joke-types")
            .then((data) => data.json())
            .then((val) => settypes(val.data))
          }
          fetch_types();
          return () => {
            effectRun.current = true;
          }
        }
        // -------------------------------------------------------------------------------------
    }, []);

    const JokesUpdateHandler = async (event) => {
        event.preventDefault();
        console.log("Form Submit was called");
        const document_id = the_id;
        const the_description = description;
        let the_option = the_type;
        //console.log(new_type.length);
        if(new_type != undefined){
            the_option = new_type;
        }
        try{
            // make the update request
            const response = await fetch("http://localhost:8050/update-joke", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                id: document_id,
                description: the_description,
                type: the_option,
                }),
            });

            const the_response = await response.json();
            console.log(the_response);
            if (the_response.status == "Ok" && new_type == undefined) {
                Swal.fire(`The joke with the id: "${document_id}" was successfully updated \n Presenting you the next avaliable joke for the type "${the_option}"`);
                //alert(`The joke with the id: ${document_id} was successfully updated \n Presenting you the next avaliable joke for the type ${the_option}`);
            }else{
                if (the_response.status == "Ok" && new_type != undefined) {
                    Swal.fire(`The joke with the id: "${document_id}" was successfully updated`);
                    //alert(`The joke with the id: ${document_id} was successfully updated`);
                }
            }
            // recalling the retreval process to get next avaliable joke
            const item_type = the_option;
            setloading(true);
            console.log(item_type);
            // calling the api to get the random joke
            const resultsArray =  await RandomJokeRetreval(item_type);
            setid(resultsArray[0]);
            setdescription(resultsArray[1]);
            setoptions(resultsArray[2]);
            if(new_type != undefined){
                // refresh the page to call the useEffect again
                window.location.reload(true);
            }
                //alert(`The joke with the id: ${document_id} was successfully updated \n Presenting you the next avaliable joke for the type ${new_type}`);
            } catch (err) {
                console.log(err);
                Swal.fire("Something wrong happend");
                //alert("Something wrong happend");
            }
    }

    const JokeRetrevalHandler = async (event) => {
        event.preventDefault(); // to avoid loading the page upon form submission
        try {
          const item_type = the_type;
          setloading(true);
          console.log(item_type);
          // calling the api to get the random joke
          const response = await fetch("http://localhost:8050/random-joke", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              joke_type: item_type,
            }),
          });
          const the_response = await response.json();
          console.log("Response 1 called: " + the_response);
          if (the_response.status == "ok") {
            console.warn(the_response.data._id.toString());
            console.warn(the_response.data.description.toString());
            setid(the_response.data._id);
            setdescription(the_response.data.description);
            setoptions(the_response.data.type);
            Swal.fire(`A random joke of "${item_type}" category was successfully retrieved`);
            //alert(`A random joke of ${item_type} category was successfully retrieved`);
          }

        } catch (err) {
          console.log(err);
          Swal.fire("Something wrong happend");
          //alert("Something wrong happend");
        }
      }
    return (
    <div className="App">
      <h1>Joke Moderator</h1>
      <h3>1. First,select the Joke Category and tap Retrieve to retrieve a random joke</h3>
      <h3>2. Then,edit the Joke accordingly and tap on Update Joke</h3>
      <h3>3. Afterwards, the next possible joke for that given type will be presented</h3>
      <form onSubmit={JokesUpdateHandler}>
        <div className='form-group'>
          <label htmlFor='Description' className='form-label'>Description</label>
          <input className = "form-control" name= "description" onChange={(e) => setdescription(e.target.value)} value={description}/>
        </div>
        <div className='form-group'>
          <label htmlFor='Type' className='form-label'>Type</label>
          <select className = "form-select" name= "type" onChange={(e) => setoptions(e.target.value)} value={the_type} >
              {
                types.map((opts,i) => <option key= {i}>{opts}</option>)
              }
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='New Type' className='form-label'>New Type</label>
          <input className = "form-control" name= "new type" onChange={(e) => setnewtype(e.target.value)} value={new_type} placeholder='Leave it empty if you satisfy with the exsisting types'/>
        </div>
        <div className='form-group'>
          <button style = {{width: "100px", height: "35px"}} className='btn' type="button" onClick={JokeRetrevalHandler} >Retrieve</button>
        </div>
        <div className='form-group'>
          <button style = {{width: "100px", height: "35px"}} className='btn' type="submit" >Update Joke</button>
        </div>
      </form>
    </div>
    );
}

export default JokesModerate;
