import { createBrowserRouter } from "react-router-dom";
import { Detail } from "./pages/Detail";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";

import {Layout} from "./pages/Layout"

const router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/detail/:cripto",
                element: <Detail/>
            },
            {
                path: "*",
                element: <NotFound/>
            },
        ]
    }
])

export {router};