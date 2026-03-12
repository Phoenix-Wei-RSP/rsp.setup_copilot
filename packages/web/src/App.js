import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guide from './pages/Guide';
export default function App() {
    return (_jsx(BrowserRouter, { basename: "/rsp.setup_copilot", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/guide", element: _jsx(Guide, {}) })] }) }));
}
