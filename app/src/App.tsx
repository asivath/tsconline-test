import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom'
import Toolbar from '@mui/material/Toolbar'
import { NavBar }from './NavBar'
import { Home } from './Home'
import { Settings } from './Settings'
import { Chart} from './Chart'
import { Datapack } from './Datapack'
import { Help } from './Help';

export default observer(function App() {
  return (
    <div>
      <NavBar />
      <Toolbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/chart" element={<Chart/>} />
        <Route path="/datapack" element={<Datapack/>} />
        <Route path="/help" element={<Help/>} />
      </Routes>
    </div>
  );
});
