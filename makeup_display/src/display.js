import React,{useState, useEffect} from 'react';
import io from 'socket.io-client';
import Chart from './Chart';

let cri_data = [
    { name: 'CRI', value: 0},
    { name: 'Zero', value: 100},
];

let cct_data = 0;
let illum_data = 0;


const url = 'http://210.102.142.20:9999/';
// const url = 'http://210.102.142.20:8989/';
const socket =  io.connect(url);

console.log("서버에 안드로이드임을 알림");
socket.emit('device', "raspberry");//자바 서버에 라즈베리임을 알리기 위해 백엔드서버에 전송


function Display(){

    const [cri, setCRI] = useState(cri_data);
    const [cct , setCCT] = useState(cct_data);
    const [illum , setILLUM] = useState(illum_data);

    socket.on('sensing', (data) => {
        // "cct:0000/illu:000/cri:000"
        // console.log("data: "+data.toString());
        // console.log("ddd: "+ data.sensing);

        let str = data.toString();

        let temp = str.split("/");
        // console.log("temp: "+temp[0]);
        let value =[];
        for(let i=0;i<temp.length;i++){
            
            value[i] = temp[i].split(":")[1];
            // console.log(value[i]);
        }

        setCCT(value[0]);
        setILLUM(value[1]);

        cri_data[0].value = parseInt(value[2]);
        cri_data[1].value = 100 - value[2];
        // console.log(cri_data[0].value);
        // console.log(cri_data[1].value);
        // setCRI(cri_data);

    });


    useEffect(() =>{

    },[])


    return(
        <div className='background'>
                <div className='dashboard'>
                    <div className='title'>Dash Board</div>
                    
                    <div className='dashboard-content'>
                        <div className='cri'>
                            <p>CRI</p>
                            <h4>연색지수</h4>
                            <hr></hr>
                            <div class="box">
                                <Chart data ={cri}/>
                            </div>
                        </div>
                        <section>
                            <div className='cct'>
                                <p>CCT</p>
                                <h4>색온도</h4>
                                <hr></hr>
                                <h3>{cct}<span>K</span></h3>
                            </div>
                            <div className='illum'>
                                <p>illumination</p>
                                <h4>조도</h4>
                                <hr></hr>
                                <h3>{illum}<span>LUX</span></h3>
                            </div>
                        </section>
                    </div>
                </div>
               
            </div>
    )

}

export default Display;