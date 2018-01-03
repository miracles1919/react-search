import React from 'react';
import ReactDOM from 'react-dom';

import style from "./table.css";


export default class Table extends React.Component{

    constructor(props){
        super(props);



        this.state = {
            selected: props.selected || -1,
        }

    }


    componentWillReceiveProps(nextProps){

    }


    clickLine = (para,index,e)=>{

        e.stopPropagation();

        this.setState({
            selected:index
        })

        if (this.props.lineClick){

            this.props.lineClick(para,index)
        }
    }


    getSelectedLine = (index)=>{



        return index == this.state.selected?{backgroundColor:"#F4F6F8"}:{}



    }

    tr_mouse = (index,flag)=>{

        if (this.props.tr_mouse){

            this.props.tr_mouse(index,flag)
        }
    }


    render(){

        const thiz = this;
        function uuid() {
            return Math.random().toString(36).substring(3,8)
        }

        let srcLen = thiz.props.source.length;


        return(

            <div className={style.container}>

                <table className={style.table}>
                    <thead>
                    <tr>

                        {
                            this.props.columns.map(function(item,index){
                                if(item.titleRender){
                                    return <td key={uuid()}>{item.titleRender()}</td>
                                }

                                return <td className={style.titleTd} key={item.key}>{item.title}</td>
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>

                    {

                        thiz.props.source.map(function (item,index) {

                            var array = [];



                            for (var i =0;i < thiz.props.columns.length;i++){

                                for(var key in item){

                                    if (key == thiz.props.columns[i].key){

                                        var temp = item[key];


                                        if (thiz.props.columns[i].render){

                                            array.push(<td key={uuid()} onClick={thiz.clickLine.bind(thiz,item,index)}>{thiz.props.columns[i].render(item[key],index)}</td>)

                                        }else{

                                            array.push(<td key={uuid()} onClick={thiz.clickLine.bind(thiz,item,index)}>{temp}</td>)

                                        }


                                    }
                                }
                            }

                            return (<tr className={style.bodyTr} key={uuid()}>
                                    {array}

                                </tr>)


                        })

                    }

                    </tbody>
                </table>


            </div>
        )

    }

}
