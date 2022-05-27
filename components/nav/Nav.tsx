import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Menu, MenuDivider, MenuItem, Icon } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

const Nav: React.FC = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container flex relative justify-between items-center px-3 mx-auto h-20">
        <div className="inline-flex">
          <Link href="/">
            <a>
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx={12} cy={5} r={3} />
                <line x1={12} y1={22} x2={12} y2={8} />
                <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
              </svg>
            </a>
          </Link>
        </div>
        <div className="flex-initial">
          <div className="flex relative justify-end items-center">
            <div className="block">
              <div className="inline relative">
                <Popover2
                  autoFocus
                  canEscapeKeyClose
                  placement="bottom-end"
                  content={
                    <Menu>
                      <MenuItem icon="cog" text="Settings" />
                      <MenuDivider />
                      <MenuItem
                        intent="danger"
                        icon="log-out"
                        text="Log out"
                        onClick={() => signOut()}
                      />
                    </Menu>
                  }
                >
                  <button
                    type="button"
                    className="flex gap-5 justify-between items-center py-2 px-3 rounded-full border hover:shadow-lg"
                  >
                    <Icon icon="menu" />
                    <Icon icon="user" className="h-full" size={24} />
                  </button>
                </Popover2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
