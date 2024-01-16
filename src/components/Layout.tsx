import { useRouter } from "next/router";
import Header from "./Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    const router = useRouter();

    return (
        <div className={router.pathname === '/'? ' bg-gray-950 h-screen': ''}>
            <Header />
            {children}
        </div>
    )
}
export default Layout