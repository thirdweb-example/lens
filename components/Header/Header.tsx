import Link from "next/link";
import {useRouter} from "next/router";
import { useState } from "react";
import AccountDropdown from "./AccountDropdown";

export default function Header() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [searchText, setSearchText] = useState("")

    let inputHandler = (e: any) => {
        setSearchText(e.target.value)
    }

    let toggleIsOpen = () => {
        setIsOpen(!isOpen)
    }

    let search = async (e: any) => {
        if (e.key === 'Enter') {
            await router.push('/profiles?search=' + searchText)
        }
    }

  return (
      <>
          <nav className="navbar bg-base-100 justify-between gap-2 mb-2">
              <div className="flex">
                  <img src='/icon.webp' alt='lenstats icon' className='mr-2 w-12 h-12' />
                  <div className="form-control mr-2 hidden lg:block">
                      <input
                          type="text"
                          placeholder="Search"
                          className="input input-bordered"
                          onKeyDown={search}
                          onChange={inputHandler}
                      />
                  </div>
                  <ul className="hidden lg:flex menu menu-horizontal font-semibold p-0 gap-2">
                      <li><Link href='/' className={router.pathname === '/' ? 'active' : ''}>Home</Link></li>
                      <li><Link href='/leaderboard' className={router.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link></li>
                      <li><Link href='/giveaway' className={router.pathname === '/giveaway' ? 'active' : ''}>Giveaway</Link></li>
                  </ul>
              </div>
              <div className="flex gap-2">
                  <button className="lg:hidden btn btn-square btn-ghost" onClick={toggleIsOpen}>
                      {
                          isOpen ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                          ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                              </svg>
                          )
                      }
                  </button>
                  <AccountDropdown />
              </div>
          </nav>
          {
              isOpen && (
                  <div>
                      <ul className="menu bg-base-100 w-full p-2 rounded-box font-semibold gap-2">
                          <li><Link href='/' className={router.pathname === '/' ? 'active' : ''}>Home</Link></li>
                          <li><Link href='/leaderboard' className={router.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link></li>
                          <li><Link href='/giveaway' className={router.pathname === '/giveaway' ? 'active' : ''}>Giveaway</Link></li>
                          <li><Link href='/explore' className={router.pathname === '/explore' ? 'active' : ''}>Explore</Link></li>
                      </ul>
                  </div>
              )
          }
      </>
  );
}
