import React, { useState, useEffect, useRef } from 'react';
import './index.css'
import { CSSTransition } from 'react-transition-group'
import { BsPlusLg, BsPlayFill, BsChevronRight, BsArrowLeft, BsArrowBarUp, BsArrowBarDown, BsFillHddRackFill, BsFillDiagram2Fill } from "react-icons/bs";
import Subscribe from './NodeInput/Subscribe';
import Application from './NodeInput/Application';
import Publish from './NodeInput/Publish';


const AddButton = ({ nodes, setNodes }) => {

    return (
        <Navbar>

            <NavItem icon={<BsPlayFill />} />

            <NavItem icon={<BsPlusLg />}>
                <DropdownMenu nodes={nodes} setNodes={setNodes} ></DropdownMenu>
            </NavItem>

        </Navbar>
    );
}

function Navbar(props: { children: React.ReactNode }) {
    return (
        <nav className="navbar">
            <ul className="navbar-nav">{props.children}</ul>
        </nav>
    );
}

function NavItem(props: { icon: React.ReactChild; children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <li className="nav-item">
            <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
                {props.icon}
            </a>

            {open && props.children}
        </li>
    );
}

function DropdownMenu({ nodes, setNodes }) {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    function DropdownItem(props) {
        return (
            <div className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)} onKeyDown={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-right">{props.rightIcon}</span>
            </div>
        );
    }

    return (
        <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem leftIcon={<BsFillDiagram2Fill/>} >Add Nodes</DropdownItem>
                    <DropdownItem
                        leftIcon={<BsFillHddRackFill/>}
                        rightIcon={<BsChevronRight/>}
                        goToMenu="application">
                        Application Node
                    </DropdownItem>
                    <DropdownItem
                        leftIcon={<BsArrowBarUp/>}
                        rightIcon={<BsChevronRight/>}
                        goToMenu="publish">
                        Publish Node
                    </DropdownItem>
                    <DropdownItem
                        leftIcon={<BsArrowBarDown/>}
                        rightIcon={<BsChevronRight/>}
                        goToMenu="subscribe">
                        Subscribe Node
                    </DropdownItem>

                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'application'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<BsArrowLeft/>}>
                        <h3>Create Application Node</h3>
                    </DropdownItem>
                    <Application nodes={nodes} setNodes={setNodes}/>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'publish'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<BsArrowLeft/>}>
                        <h3>Create Publish Node</h3>
                    </DropdownItem>
                    <Publish nodes={nodes} setNodes={setNodes} />
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'subscribe'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon={<BsArrowLeft/>}>
                        <h3>Create Subscribe Node</h3>
                    </DropdownItem>
                    <Subscribe nodes={nodes} setNodes={setNodes}/>
                </div>
            </CSSTransition>
        </div>
    );
}

export default AddButton