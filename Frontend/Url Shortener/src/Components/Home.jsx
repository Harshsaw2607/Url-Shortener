import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar';

function Home() {
    return (
        <div className="home-page">
            <Navbar/>
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to URL Shortener</h1>
                    <p className="hero-description">
                        Simplify your long URLs and make them easy to share. Shorten, manage, and track your links with ease.
                    </p>
                    <Link to="/shorten" className="get-started-button">
                        Get Started
                    </Link>
                </div>
            </div>
            <div className="main-content">
                <div className="features-section">
                    <h2 className="features-title">Why Choose Us?</h2>
                    <div className="features-container">
                        <div className="feature">
                            <h3 className="feature-title">Easy to Use</h3>
                            <p className="feature-description">
                                Quickly shorten any URL with just a few clicks.
                            </p>
                        </div>
                        <div className="feature">
                            <h3 className="feature-title">Track Your Links</h3>
                            <p className="feature-description">
                                Monitor clicks and performance of your shortened links.
                            </p>
                        </div>
                        <div className="feature">
                            <h3 className="feature-title">Custom Aliases</h3>
                            <p className="feature-description">
                                Personalize your links with custom aliases.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2024 URL Shortener. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
