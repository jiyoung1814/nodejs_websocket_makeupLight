import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Main from './Main'

// const options = { // 접속 정보 설정
//   port: 8989,
//   // host: "210.102.142.20" //연구실 컴퓨터
//   host: "192.168.181.170" // 노트북
// };


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>
)



// root.render(
//   <BrowserRouter>
//   <div id = 'background'>
//       <Routes>
//           <Route path="/" element={<Main/>}/>
//           <Route path="/main" element={<Main/>} />
//       </Routes>
//   </div>
// </BrowserRouter>
// );


