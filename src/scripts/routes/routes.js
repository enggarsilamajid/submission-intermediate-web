import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
// import AddPage from '../pages/add/add-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  // '/add': new AddPage(),
};

export default routes;
