import { UserContext } from '@/utils/Context';
import { passportInstance } from '@/utils/immutable';
import Link from 'next/link';
import { useContext, useState } from 'react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [User, _] = useContext(UserContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-black p-4 text-white shadow-md relative flex items-center">
      {User ? <button className='font-bold text-2xl'
        onClick={() => {
          passportInstance?.logout();
        }}
      >Logout</button>
        : <></>}
      <h1 className="mx-auto text-4xl xse:text-3xl font-bold">
        <Link href='/'>Pixels Invader</Link>
      </h1>
      <div>
        <button onClick={toggleMenu} className="inline-flex z-50 items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`absolute right-0 mr-4 mt-2 z-50 w-48 bg-white shadow-md rounded-md ${menuOpen ? 'block' : 'hidden'}`} onClick={closeMenu}>
          <Link href="/">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Game</h1>
          </Link>
          <Link href="/inventory">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Inventory</h1>
          </Link>
          <Link href="/market">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Market</h1>
          </Link>
          <Link href="/profile">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Profile</h1>
          </Link>
          <Link href="/ipx">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">$IPX</h1>
          </Link>
          <Link href="/swap">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Swap</h1>
          </Link>
          <Link href="/leaderboard">
            <h1 className="block hover:bg-blue-500 font-medium hover:rounded-md hover:text-white px-4 py-2 text-gray-800">Leaderboard</h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
