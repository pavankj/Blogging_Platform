import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blog from './components//Blog.js';
import SignUp from './components/SignUp.js';
import Signin from './components/Signin.js';
import ProtectedRoute from './components/ProtectedRoute.js'
import CreatePost from './components/CreatePost.js';
import Admin from './components/Admin.js';
import Search from './components/Search.js';
import Chatbot from './components/Chatbot.js';
import './App.css';

function App() {
  return (
    <div className="app">
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ProtectedRoute requireAuth={true}><Blog /></ProtectedRoute>} />
      <Route path="/createpost" element={<ProtectedRoute><CreatePost/></ProtectedRoute>} />
      
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<Signin />} />
      
      
      <Route path='/admin' element={<ProtectedRoute requireAuth={true} requireAdmin={true}><Admin/></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute requireAuth={true}><Search/></ProtectedRoute>} />
      <Route path='/chatbot' element={<ProtectedRoute requireAuth={true}><Chatbot/></ProtectedRoute>} />

    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
