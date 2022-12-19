import React,{useState, useEffect} from 'react';
import io from 'socket.io-client';
import Chart from "./Chart"

let cri_data = [
    { name: 'CRI', value: 80},
    { name: 'Zero', value: 20},
];

let cct_data = 0;
let illum_data = 0;

let control_data =[0,3500,600];

// const url = 'http://210.102.142.20:9999/';
// const socket =  io.connect(url);

// console.log("서버에 안드로이드임을 알림");
// socket.emit('device', "android");//자바 서버에 안드로이드임을 알리기 위해 백엔드서버에 전송
let socket;

const Capstone =(props) =>{
    socket = props.socket;

    const [data, setCRI] = useState(cri_data);
    const [cct , setCCT] = useState(cct_data);
    const [illum , setILLUM] = useState(illum_data);

    const[value, setValue] = useState(300);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        //조명 토글 off로 초기 설정
        let obj_off = document.getElementById("off"); 
        obj_off.checked = true;

        socket.on('registration', (data) =>{
            console.log(data);
            if(data ==="true"){
                console.log("Device Registration Complete");
                let blind = document.getElementsByClassName("blind")[0];
                let background  = document.getElementsByClassName("background")[0];
        
                blind.style.display = "none";
                background.style.display = "inline";
            }
            
        });

        socket.on('sensing', (data) => {
            // "cct:0000/illu:000/cri:000"
            console.log("data: "+data.toString());
            // console.log("ddd: "+ data.sensing);

            let str = data.toString();

            let temp = str.split("/");
            console.log("temp: "+temp[0]);
            let value =[];
            for(let i=0;i<temp.length;i++){
                
                value[i] = temp[i].split(":")[1];
                console.log(value[i]);
            }

            setCCT(value[0]);
            setILLUM(value[1]);

            cri_data[0].value = value[2];
            cri_data[1].value = 100 - value[2];
            console.log(cri_data[2]);
            setCRI(cri_data);

        });

    },[])

    const Refresh =() => {
        window.location.replace("/");
    }


    const setCheck =(e) =>{ //led on off Evnet
        if(e.target.id === "on"){
            if(e.target.checked){  //on 일때
                control_data[0] = 1;
                sent_control_data();
            }
        }
        else{
            if(e.target.checked){  //off 일때
                control_data[0] = 0;
                sent_control_data();
            }
        }
    }

    const MouseDown =(obj) =>{
        let range = obj.target.value;
        // console.log("mouseDown: " + range);
        window.addEventListener('mouseup', onMouseUp);

    }

    const onMouseUp =(e) =>{

        if(e.target.id === "range_cct" || e.target.id ==="range_illum"){
            // console.log("up: "+ e.target.value)
            let value = e.target.value;
    
            if(e.target.id ==="range_illum"){
                if(value<700){
                    e.target.value = 600;
                }
                else if(value>=700 && value<900){
                    e.target.value = 800;
                }
                else if(value<=1000){
                    e.target.value = 1000;
                }

                control_data[2] = e.target.value;
                setValue(e.target.value);
                
            }
            else if(e.target.id ==="range_cct"){
                if(value<4000){
                    e.target.value = 3500;
                }
                else if(value>=4000 && value<5000){
                    e.target.value = 4500;
                }
                else if(value<=5500){
                    e.target.value = 5500;
                }

                control_data[1] = e.target.value;
                
            }

            sent_control_data();
        }

    }


    const sent_control_data =() =>{
        // "onoff:on/cct:0000/illu:000"
        let led_state;
        if(control_data[0]){led_state = "on";}
        else{led_state="off";}
        let str = "onoff:"+ led_state+"/cct:"+control_data[1]+"/illu:"+control_data[2];


        socket.emit('message', str);

        // console.log(str);
    }

    return(
        <div className='background'>
                <div className='dashboard'>
                    <div className='title'>Dash Board <span onClick={Refresh}>Refresh</span> </div>
                    {/* <button>Refresh</button> */}
                    
                    <div className='dashboard-content'>
                        <div className='cri'>
                            <p>CRI</p>
                            <h4>연색지수</h4>
                            <hr></hr>
                            <div class="box">
                                <Chart data ={data}/>
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
                <div className='control'>
                    <div className='title'>{value}</div>
                    <div className='control-box'>
                        <section className='light'>
                            <h4>조명</h4>

                            <div className="light-ctl">
                                <div className="radio-checked">
                                    <div className="radio-checked_highlight"></div>
                                        <div className="radio-checked_container">
                                        <input className="radio-checked_input" id="on" name="status" type="radio" value="on" onClick ={(e) =>{setCheck(e)}}/>
                                        <label className="radio-checked_label radio-checked_label--on" for="on"> On</label>
                                        <input className="radio-checked_input" id="off" name="status" type="radio" value="off" onClick ={(e) =>{setCheck(e)}} />
                                        <label className="radio-checked_label radio-checked_label--off" for="off">Off</label>
                                        </div>
                                </div>
                            </div>
                        </section>

                        <section className='cct-ctl'>
                            <h4>색온도(K)</h4>
                            
                            <div className="range">
                                <input id="range_cct" type="range"  min="3500" max="5500" step="100" onMouseDown={(e)=>MouseDown(e)}></input>
                                <div className='range__ticks'>
                                    <span className="range__tick"><span className ="range__tick-text">3500</span></span>
                                    <span className="range__tick"><span className ="range__tick-text">4500</span></span>
                                    <span className="range__tick"><span className ="range__tick-text">5500</span></span>
                                </div>
                            </div>
                        </section>
                        <section className='illum-ctl'>
                            <h4>조도(LUX)</h4>
                            
                            <div className="range">
                                <input id="range_illum" type="range" min="600" max="1000" step="20"  onMouseDown={(e)=>MouseDown(e)}></input>
                                <div className='range__ticks'>
                                    <span className="range__tick"><span className ="range__tick-text">600</span></span>
                                    <span className="range__tick"><span className ="range__tick-text">800</span></span>
                                    <span className="range__tick"><span className ="range__tick-text">1000</span></span>
                                </div>
                            </div>
                        </section>
                    </div>
                        
                </div>
            </div>
    );

}

export default Capstone