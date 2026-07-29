import { BrowserRouter } from 'react-router-dom';
import Main from "./Main"
import ScrollTop from './ScrollTop'

const Layout = ({ children }) => {
    const basename = process.env.PUBLIC_URL
        ? new URL(process.env.PUBLIC_URL, window.location.origin).pathname.replace(/\/$/, '')
        : undefined;

    return (
        <BrowserRouter basename={basename}>
        <ScrollTop />
            <Main>
                {children}
            </Main>
        </BrowserRouter>
    );
}

export default Layout;
