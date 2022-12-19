import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell } from 'recharts';


let data;
const COLORS = ['#6E89FF', '#E3E3E3'];

class Chart extends PureComponent {
  
  render() {
    data = this.props.data;
    let x_position = 0;
    let text_color;
    // console.log(data[0].value)

    //숫자 자릿 수에 따른 텍스트 x값 위치
    if(data[0].value < 10){
      x_position = 95;
    } 
    else if(data[0].value >=10 && data[0].value <100){
      x_position = 85;
    }
    else if(data[0].value === 100){
      x_position = 75;
    }

    //숫자에 따른 텍스트 색 변경
    if(data[0].value === 0){
      text_color = "#E3E3E3";
    }
    else{
      text_color = "#6E89FF";
    }


    return (
      <PieChart className='chart-box' width={200}vw height={200} onMouseEnter={this.onPieEnter}>
        <text  className='chart-text'
        x = {x_position}
        y = {110}
        fill ={text_color}
        fontSize={30}px
        >{data[0].value}</text>
        <Pie
          data={data}
          cx={100}
          cy={100}
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}

export default Chart