import React, {useState} from "react";
import axios from "axios";
import {BASE_URL} from "../../utils";
import {IUser, Video} from "../../types";
import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import {useRouter} from "next/router";
import useAuthStore from "../../store/authStore";
import Image from "next/image";
import {GoVerified} from "react-icons/go";
import Link from "next/link";

const Search = ({videos}: { videos: Video[] }) => {

    const { allUsers } = useAuthStore()
    const [isAccounts, setIsAccounts] = useState(false)
    const router = useRouter()
    const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
    const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
    const { searchTerm }: any = router.query
    const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="w-full">
            <div className="flex gap-10 mb-10 mt-10 border-b-2
                border-gray-200 bg-white w-full">
                <p
                    onClick={() => setIsAccounts(true)}
                    className={`text-xl font-semibold cursor-pointer ${accounts}`}
                >Accounts</p>
                <p
                    onClick={() => setIsAccounts(false)}
                    className={`text-xl font-semibold cursor-pointer ${isVideos}`}
                >Videos</p>
            </div>
            {
                isAccounts ? (
                    <div className="md:mt-16">
                        {
                            searchedAccounts.length > 0 ? (
                                searchedAccounts.map((user: IUser, idx: number) => (
                                    <Link key={idx} href={`/profile/${user._id}`}>
                                        <div className="cursor-pointer flex p-2 font-semibold rounded border-b-2 border-gray-200 gap-3">
                                            <div>
                                                <Image
                                                    alt="user-profile"
                                                    className="rounded-full"
                                                    height={50}
                                                    width={50}
                                                    src={user.image}
                                                />
                                            </div>

                                            <div className="block">
                                                <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                                                    {user.userName.replaceAll(' ', '')}
                                                    <GoVerified className="text-blue-400"/>
                                                </p>
                                                <p className="capitalize text-gray-400 text-xs">
                                                    {user.userName}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <>
                                    <NoResults text={`No account results for ${searchTerm}`}/>
                                </>
                            )
                        }
                    </div>
                ) : (
                    <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
                        {videos.length ? (
                            videos.map((video: Video, idx: number) => (
                                <VideoCard
                                    key={idx}
                                    post={video}
                                />
                            ))
                        ) : (
                            <>
                                <NoResults text={`No video results for ${searchTerm}`}/>
                            </>
                        )}
                    </div>
                )
            }
        </div>
    );
}

export const getServerSideProps = async ({
                                             params: {searchTerm}
                                         }: {
    params: { searchTerm: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return {
        props: {videos: res.data}
    }
}

export default Search