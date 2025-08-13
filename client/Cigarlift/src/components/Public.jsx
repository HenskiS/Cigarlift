import { Link } from 'react-router-dom'
//import img1 from '../assets/cigarlift-logo-white.png'
import img1 from '../assets/logo.png'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <img src={img1} alt="Cigarlift Logo" className='public-logo' />
                <h1 className='public-h1'>Welcome to <span className="nowrap">Cigarlift!</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Southern California, Cigarlift provides a trained staff ready to meet your cigar needs.</p>
                <address className="public__addr">
                    {/*Cigarlift<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />*/}
                    <a href="tel:+15622285096">(562) 228-5096</a>
                </address>
                <br />
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public