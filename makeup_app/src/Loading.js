import React from 'react';
import loading from './assets/loading.gif';

const Loading =(props) =>{
    const {bntClick} = props;

    return(
        <div className='blind'>
            <button className='loading_btn' onClick={bntClick}>loading</button>
            <div className='loading-box'>
                <div className='loading-content'>
                    <h5>서버에 접속 중...</h5>
                    <img className='loading-img' src={loading}></img>
                </div>
                
            </div>
        </div>

    );

}

export default Loading