import { BowArrow } from "lucide-react";

export default function Navbar() {
    return (


        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-primary">
                    <BowArrow className="h-6 w-6 text-orange-600" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Lead2Opp</span>
                </div>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <span className="text-[var(--primary)]">
                    Welcome!
                    </span>
                </div>
            </div>
        </nav>


    );
}
