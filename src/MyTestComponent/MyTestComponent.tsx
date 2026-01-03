import {useState} from 'react'
import { useSnackbar } from 'notistack';
import '../App.css'

interface TodoI {
  id: string
  text: string
  completed: boolean
}

function MyTestComponent() {
  const [todos,setTodos] = useState< TodoI[]>([])
  const [text, setText] = useState<string>('')
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleClick = () => {
    enqueueSnackbar('Это обычное уведомление!')
    closeSnackbar('Закрыть уведомление')
  };

  const showClosableNotification = () => {
    const key = enqueueSnackbar('ТЕСТ Закрой меня программно!', {
      variant: 'info',
      persist: true,
      action: (
        <button 
          color="inherit" 
          onClick={() => closeSnackbar(key)}
        >
          Закрыть чхорт
        </button>
      )
    });

    // Автоматическое закрытие через 3 секунды
    setTimeout(() => {
      closeSnackbar(key);
    }, 6000);
  };

  const showCustom = () => {
    enqueueSnackbar('ТЕСТИМ Кастомное уведомление!', {
      content: (key, message) => (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f6f4ecff',
          }}
        >
          <span>{message}</span>
        </div>
      )
    });
  };

  const showNotifications = () => {
    // Разные типы уведомлений
    enqueueSnackbar('Обычное сообщение'); // по умолчанию
    
    enqueueSnackbar('Успех!', { 
      variant: 'success' 
    });
    
    enqueueSnackbar('Предупреждение!', { 
      variant: 'warning' 
    });
    
    enqueueSnackbar('Ошибка!', { 
      variant: 'error' 
    });
    
    enqueueSnackbar('Информация', { 
      variant: 'info' 
    });
  };

  const addTodo = () => {
    if(text.trim().length){

      setTodos([...todos,{
        id: Date.now().toString(),
        text,
        completed: false,
      }])
    }
    setText('')
    showCustom()
  }

  const removeTodo = (todoId: string) => {
    setTodos(
      todos.filter((todo) => todo.id !== todoId)
    )
    console.log(todos)
    handleClick()
  }

  const toggleTodoCompleted = (todoId: string) => {
    setTodos(
      todos.map(
        todo => {
          if(todo.id === todoId){
            todo.completed = !todo.completed
          }
          return todo
        }
      )
    )
    showClosableNotification()
  }

  return (
    <>
     <label>
       <input value={text} onChange={(e) => setText(e.target.value) }/>
       <button onClick={addTodo}>add Todo</button>
     </label> 

     <ul>
      {todos.map((todo) => <li key={todo.id}>
      <input type='checkbox' checked={todo.completed} onChange={() => toggleTodoCompleted(todo.id)}/>
      <span>{todo.text}</span>
      <span onClick={() => removeTodo(todo.id)} style={{cursor: 'pointer', color: 'red'}}>&times;</span>
      </li>)
      }
     </ul>
      
    </>
  )
}

export default MyTestComponent