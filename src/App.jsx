import { useState, useEffect } from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';
import { Container, FormHeader, H1, FormToDo, H2, FormControl, Label, Input, InputSubmit, H2ListTodo, ListTodo, P, Todo, H3, P2 } from "./Styles";

const API = "http://localhost:5000"

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // Load ToDo on page load 

  useEffect(() => {
    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + '/todos')
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err))

      setLoading(false)
      setTodos(res)
    }
    loadData()
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false
    }
   
    // Conectando ao API

    await fetch(API + '/todos', {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle('')
    setTime('')
  }

  const handleDelete = async(id) => {
    await fetch(API + '/todos/' + id, {
      method: "DELETE",
    })
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id))
  }

  const handleEdit = async(todo) => {
    todo.done = !todo.done

  const data = await fetch(API + '/todos/' + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setTodos((prevState) => 
    prevState.map((t) => (t.id === data.id) ? (t = data) : t));
  }

  if(loading) {
    return <p>Loading...</p>
  }

  return (
    <Container>
      <FormHeader>
        <H1>To Do List</H1>
      </FormHeader>
      <FormToDo>
        <H2>Insira a sua próxima tarefa:</H2>
        <form onSubmit={handleSubmit}>

          <FormControl>
            <Label htmlFor="title">O que você vai fazer?</Label>
            <Input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              required
            />
          </FormControl>

          <FormControl>
            <Label htmlFor="time">Duração:</Label>
            <Input
              type="text"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(e) => setTime(e.target.value)}
              value={time || ''}
              required
            />
          </FormControl>

          <InputSubmit type="submit" value='Criar tarefa' />

        </form>
      </FormToDo>

      <ListTodo>
        <H2ListTodo>Lista de tarefas:</H2ListTodo>
        {todos.length === 0 && <P>Não há tarefas!</P>}
        {todos.map((todo) => (
          <Todo key={todo.id}>
            <H3 className={todo.done ? 'todo-done' : ''}>{todo.title}</H3>
            <P2>Duração:{todo.time}</P2>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)}/>
            </div>
          </Todo>
          
        ))}
      </ListTodo>
    </Container>
  );
}

export default App;
