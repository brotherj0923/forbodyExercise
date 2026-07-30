import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginContext } from './contexts/LoginContext';
import { useProvideAuth } from './hooks/useProvideAuth';
import Layout from "./components/layouts/Layout";
import './App.css';

const Landing = lazy(() => import('./pages/Landing'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Login = lazy(() => import('./pages/Login'));
const Exercise = lazy(() => import('./pages/Exercise'));
const Food = lazy(() => import('./pages/Food'));
const TodoList = lazy(() => import('./pages/TodoList'));
const TodoForm = lazy(() => import('./pages/TodoForm'));
const TodoShare = lazy(() => import('./pages/TodoShare'));
const Wannabe = lazy(() => import('./pages/Wannabe'));
const My = lazy(() => import('./pages/My'));
const MyInfoModify = lazy(() => import('./components/my/MyInfoModify'));
const MyInfoUpdate = lazy(() => import('./components/my/MyInfoUpdate'));
const MyShareList = lazy(() => import('./components/my/MyShareList'));
const Error404 = lazy(() => import('./pages/Error/Error404'));
const Error500 = lazy(() => import('./pages/Error/Error500'));

function App() {
  
  const auth = useProvideAuth(); 
  return (
    <LoginContext.Provider value={auth}>
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/exercise' element={auth.loginUser ? <Exercise/> : <Landing />}/>
            <Route path='/food' element={auth.loginUser ? <Food /> : <Landing />} />
            <Route path='/todolist' element={auth.loginUser ? <TodoList/> : <Landing />} />
            <Route path='/todolist/form' element={auth.loginUser ? <TodoForm /> : <Landing />} />
            <Route path='/todolist/share' element={auth.loginUser ? <TodoShare /> : <Landing />} />
            <Route path='/wannabe' element={auth.loginUser ? <Wannabe /> : <Landing />} />
            <Route path='/my' element={auth.loginUser ? <My /> : <Landing />} />
            <Route path='/my/update' element={auth.loginUser ? <MyInfoUpdate /> : <Landing />} />
            <Route path='/my/modify' element={auth.loginUser ? <MyInfoModify /> : <Landing />} />
            <Route path='/my/shareList' element={auth.loginUser ? <MyShareList />: <Landing />} />
            <Route path='/err' element={<Error500/>} />
            <Route path='*' element={<Error404/>} />
          </Routes>
        </Suspense>
      </Layout>
    </LoginContext.Provider>
  );
}

export default App;
