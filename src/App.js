import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  const [todo, setTodo] = useState('');
  const [chck, setChck] = useState(0);
  const [list, setList] = useState([]);
  const [deleteTodo, setDeleteTodo] = useState('')
  useEffect(() => {
    fetchTodo().then(setList);
    if(deleteTodo !== ''){
      handledeleteTodo();
    }
  }, [chck, deleteTodo])

  async function fetchTodo() {
    const url = process.env.REACT_APP_API_URL + '/list';
    const response = await fetch(url);
    return await response.json();
  }

  async function handledeleteTodo(){
    try{
      const url =  process.env.REACT_APP_API_URL + '/delete';
      const response = await axios.delete(url,{
        headers: { 'Content-Type': 'application/json' },
        data: { _id: deleteTodo }
      });
      console.log('Deleted Todo: ', response.data);
    }catch(err){
      console.error('Error: ', err);
    }
    setDeleteTodo('');
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/add';
    console.log(todo);
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: todo
      })
    })
      .then((response) => {
        response.json().then((json) => {
          fetchTodo().then(setList);
          setTodo('');
          setChck(prev=>prev+1);
        })
      })
      .catch((error) => {
        console.log('Error: ', error);
      })
  }

  return (
    <div className='parent'>
      <h1>Todo App</h1>
      <main className='frame'>
        <form onSubmit={handleSubmit}>
          <input 
          type='text' 
          value={todo} 
          onChange={(ev) => { setTodo(ev.target.value) }} placeholder='Study 50 minutes' 
          />
          <button
            type='submit'
          ><i className="fa-solid fa-plus"></i></button>
        </form>
        <div className='lists'>
          {list.length > 0 && list.map(item =>(
            <div className='todo' key={item._id}>
              {item.title}
              <button 
              onClick={()=>setDeleteTodo(item._id)}><i className="fa-solid fa-check"></i></button>
            </div>)
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
