import React, {useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Logo from '../utils/tiktik-logo.png'
import {GoogleLogin, googleLogout} from "@react-oauth/google";
import {createOrGetUser} from "../utils";
import useAuthStore from "../store/authStore";
import {IoMdAdd} from "react-icons/io";
import {AiOutlineLogout} from "react-icons/ai";
import {BiSearch} from "react-icons/bi";
import {useRouter} from "next/router";

function Navbar() {

    const { userProfile, addUser, removeUser } = useAuthStore()
    const router = useRouter()
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault()

        if (searchValue){
            router.push(`/search/${searchValue}`)
        }
    }

    return (
        <div className="w-full flex justify-between items-center
        border-b-2 border-gray-200 py-2 px-4">
            <Link href={'/'}>
                <div className="w-[100px] md:w-[130px]">
                    <Image
                        className="cursor-pointer"
                        src={Logo}
                        alt={'TikTik'}
                        layout={"responsive"}
                    />
                </div>
            </Link>

            <div className="relative hidden md:block">
                <form
                    className="absolute md:static top-10 left-20 bg-white"
                    onSubmit={handleSearch}
                >
                    <input
                        className="bg-primary p-3 md:text-md font-medium border-2
                        border-gray-100 focus:outline-none focus:border-2
                        focus:border-gray-300 w-[300px] md:w-[350px] rounded-full
                        md:top-0"
                        placeholder={"Search accounts and videos"}
                        onChange={(e) => setSearchValue(e.target.value)}
                        value={searchValue}
                        type={"text"}
                    />
                    <button
                        className="absolute md:right-5 right-6 top-4 border-l-2 border-gray-300
                        pl-4 text-2xl text-gray-400"
                        onClick={handleSearch}
                    >
                        <BiSearch/>
                    </button>
                </form>
            </div>

            <div>
                {userProfile ? (
                    <div className="flex gap-5 md:gap-10">
                        <Link href={"/upload"}>
                            <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2">
                                <IoMdAdd className="text-xl"/> {` `}
                                <span className="hidden md:block">Upload</span>
                            </button>
                        </Link>
                        {userProfile?.image && (
                            <Link href={""}>
                                <>
                                    <Image
                                        height={40}
                                        width={40}
                                        className="rounded-full cursor-pointer"
                                        src={userProfile.image}
                                        alt={"User image"}
                                    />
                                </>
                            </Link>
                        )}
                        <button
                            type={"button"}
                            className="px-2 rounded-full shadow"
                            onClick={() => {
                                googleLogout()
                                removeUser()
                            }}
                        >
                            <AiOutlineLogout color={"#F51997"} fontSize={21}/>
                        </button>
                    </div>
                ) : (
                    <GoogleLogin
                        onError={() => console.log()}
                        onSuccess={(response) => createOrGetUser(response, addUser)}
                    />
                )}
            </div>
        </div>
    );
}

export default Navbar;