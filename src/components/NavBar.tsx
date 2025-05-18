import "./NavBar.css"

function NavBar(){
    return (<div>
        <nav className="navbar">
            <div className="navbar-left">
                <li><img src="./extra/unu.webp" className="navbar-mini-icon"></img></li>
                <li><a href="#">Home</a></li>
                <li><a>Blog</a></li>
            </div>
            <div className="navbar-right">
                <form>
                    <select name="theme" id="theme" className="select-theme">
                        <option value="light">Light</option>
                    </select>
                </form>
            </div>
        </nav>
    </div>)
}

export default NavBar