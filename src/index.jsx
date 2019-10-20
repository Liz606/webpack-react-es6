import React from 'react';
import ReactDom from 'react-dom';
import './style.scss';
import LayoutPagae from './pages/layout.jsx';

ReactDom.render( 
    <div>
        我是入口文件
        <LayoutPagae/>
    </div> 
, document.getElementById('root'))