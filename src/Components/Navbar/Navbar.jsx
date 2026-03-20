import React, { useEffect, useState } from 'react'
import { BiMenuAltRight } from 'react-icons/bi'
import logo from '../../images/logooo.png'
import { Link } from "react-router-dom"
import toast from 'react-hot-toast'
import '../../styles/navbar.css'
import { useAuth } from '../../context/auth'

const Navbar = () => {

    const [auth, setAuth] = useAuth();

    const handleSubmit = () => {
        setAuth({
            ...auth,
            user: null,
            token: ''
        })
        localStorage.removeItem('auth')
        toast.success('Logged Out Successfully')
    }

    const [color, setcolor] = useState(false)

    const changeColor = () => {
        if (window.scrollY >= 90) {
            setcolor(true)
        } else {
            setcolor(false)
        }
    }

    window.addEventListener('scroll', changeColor)

    useEffect(() => {
        const navBar = document.querySelectorAll(".nav-link");
        const navCollapse = document.querySelector(".navbar-collapse.collapse");

        const handleNavClick = () => {
            navCollapse.classList.remove("show");
        };

        navBar.forEach((a) => {
            a.addEventListener("click", handleNavClick);
        });

        return () => {
            navBar.forEach((a) => {
                a.removeEventListener("click", handleNavClick);
            });
        };
    }, []);

    return (
        <>
            {auth?.user?.role ? (
                <>
                    <header className='header_wrapper'>
                        <nav className="navbar navbar-expand-lg fixed-top">
                            <div className="container-fluid mx-3">
                                <Link to='/'>
                                    <img src={logo} style={{ width: '130px' }} />
                                </Link>
                                <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                    <BiMenuAltRight size={35} />
                                </button>

                                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                    <ul className="navbar-nav menu-navbar-nav">

                                        <Link to='/' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">Home</a>
                                            </li>
                                        </Link>

                                        <Link to='/about' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">About Us</a>
                                            </li>
                                        </Link>

                                        <Link to='/contact' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">Contact Us</a>
                                            </li>
                                        </Link>

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/trip">
                                                🚗 Trip Safety
                                            </Link>
                                        </li>

                                    </ul>

                                    {!auth.user ? (
                                        <ul className='mt-2 text-center'>
                                            <Link to='/login' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn btn-extra-header">Login</a>
                                            </Link>
                                            <Link to='/register' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn">Register</a>
                                            </Link>
                                        </ul>
                                    ) : (
                                        <ul className='mt-2 text-center'>
                                            <Link to={`/dashboard${auth?.user?.role === 1 ? "/" : "/profile"}`} className="nav-item text-center">
                                                <a className="nav-link learn-more-btn">Dashboard</a>
                                            </Link>

                                            {/* --------------------------
                                            <Link to="/incident-dashboard" className="nav-item text-center">
                                                <a className="nav-link learn-more-btn">My Incidents</a>
                                            </Link>
                                            --------------------------- */}

                                            <Link onClick={handleSubmit} to='/login' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn-logout">Logout</a>
                                            </Link>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </header>
                </>
            ) : (
                <>
                    <header className='header_wrapper'>
                        <nav className="navbar navbar-expand-lg fixed-top">
                            <div className="container-fluid mx-3">
                                <Link to='/'>
                                    <img src={logo} style={{ width: '130px' }} />
                                </Link>

                                <button className="navbar-toggler pe-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                    <BiMenuAltRight size={35} />
                                </button>

                                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                    <ul className="navbar-nav menu-navbar-nav">

                                        <Link to='/emergency' className="nav-item text-center">
                                            <a className="nav-link learn-more-btn-logout">Emergency</a>
                                        </Link>

                                        <Link to='/' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">Home</a>
                                            </li>
                                        </Link>

                                        <Link to='/about' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">About Us</a>
                                            </li>
                                        </Link>

                                        <Link to='/contact' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">Contact Us</a>
                                            </li>
                                        </Link>

                                        {/* Report Incident */}
                                        <Link to='/report' style={{ textDecoration: 'none' }}>
                                            <li className="nav-item">
                                                <a className="nav-link">Report Incident</a>
                                            </li>
                                        </Link>

                                        {/* --------------------------
                                        {auth?.user && (
                                            <Link to="/incident-dashboard" style={{ textDecoration: 'none' }}>
                                                <li className="nav-item">
                                                    <a className="nav-link">My Incidents</a>
                                                </li>
                                            </Link>
                                        )}
                                        --------------------------- */}

                                        <li className="nav-item">
                                            <Link className="nav-link" to="/trip">
                                                Trip Safety
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/safe-spots">
                                                 Safe Spots
                                            </Link>
                                        </li>

                                    </ul>

                                    {!auth.user ? (
                                        <ul className='mt-2 text-center'>
                                            <Link to='/login' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn btn-extra-header">Login</a>
                                            </Link>
                                            <Link to='/register' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn">Register</a>
                                            </Link>
                                        </ul>
                                    ) : (
                                        <ul className='mt-2 text-center'>
                                            <Link to={`/dashboard/${auth?.user?.role === 1 ? "/" : "profile"}`} className="nav-item text-center">
                                                <a className="nav-link learn-more-btn">Profile</a>
                                            </Link>

                                            <Link onClick={handleSubmit} to='/login' className="nav-item text-center">
                                                <a className="nav-link learn-more-btn-logout">Logout</a>
                                            </Link>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </header>
                </>
            )}
        </>
    )
}

export default Navbar