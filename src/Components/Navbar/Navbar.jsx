import React, { useEffect, useState } from 'react';
import { BiMenuAltRight } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import logo from '../../images/logooo.png';
import '../../styles/navbar.css';
import { useAuth } from '../../context/auth';

const Navbar = () => {
    const [auth, setAuth] = useAuth();
    const [color, setColor] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = Boolean(auth?.user && auth?.token);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setColor(window.scrollY >= 90);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile navbar
    const closeNavbar = () => {
        const navCollapse = document.getElementById('navbarNav');

        if (navCollapse?.classList.contains('show')) {
            navCollapse.classList.remove('show');
        }
    };

    // All main navbar buttons require login
    const handleProtectedNavigation = (path) => {
        closeNavbar();

        if (!isLoggedIn) {
            navigate('/login', {
                state: { from: path }
            });
            return;
        }

        navigate(path);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('auth');

        setAuth({
            ...auth,
            user: null,
            token: ''
        });

        closeNavbar();
        toast.success('Logged Out Successfully');
        navigate('/login', { replace: true });
    };

    // Reusable navigation link
    const ProtectedLink = ({
        to,
        children,
        className = 'nav-link'
    }) => (
        <a
            href={to}
            className={className}
            onClick={(event) => {
                event.preventDefault();
                handleProtectedNavigation(to);
            }}
        >
            {children}
        </a>
    );

    return (
        <header className="header_wrapper">
            <nav
                className={`navbar navbar-expand-lg fixed-top ${
                    color ? 'header-scrolled' : ''
                }`}
            >
                <div className="container-fluid mx-3">

                    {/* Logo */}
                    <Link
                        to={isLoggedIn ? '/' : '/login'}
                        onClick={closeNavbar}
                    >
                        <img
                            src={logo}
                            alt="SafeHer Logo"
                            style={{ width: '130px' }}
                        />
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        className="navbar-toggler pe-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <BiMenuAltRight size={35} />
                    </button>

                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarNav"
                    >

                        {/* All seven buttons remain visible */}
                        <ul className="navbar-nav menu-navbar-nav">

                            <li className="nav-item">
                                <ProtectedLink
                                    to="/emergency"
                                    className="nav-link learn-more-btn-logout"
                                >
                                    Emergency
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/">
                                    Home
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/about">
                                    About Us
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/contact">
                                    Contact Us
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/report">
                                    Report Incident
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/trip">
                                    Trip Safety
                                </ProtectedLink>
                            </li>

                            <li className="nav-item">
                                <ProtectedLink to="/safe-spots">
                                    Safe Spots
                                </ProtectedLink>
                            </li>

                        </ul>

                        {/* Login/Register or Profile/Logout */}
                        <ul className="navbar-nav mt-2 text-center">

                            {!isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            to="/login"
                                            className="nav-link learn-more-btn btn-extra-header"
                                            onClick={closeNavbar}
                                        >
                                            Login
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            to="/register"
                                            className="nav-link learn-more-btn"
                                            onClick={closeNavbar}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            to={
                                                auth?.user?.role === 1
                                                    ? '/dashboard/'
                                                    : '/dashboard/profile'
                                            }
                                            className="nav-link learn-more-btn"
                                            onClick={closeNavbar}
                                        >
                                            Profile
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className="nav-link learn-more-btn-logout"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}

                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;