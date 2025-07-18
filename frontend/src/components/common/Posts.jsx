import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Post from "./Post";
import { Baseurl } from "../../constant/url";
const Posts = ({ feedType, username, userId }) => {
    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou":
                return `${Baseurl}posts/all`;
            case "following":
                return `${Baseurl}posts/following`;
            case "posts":
                return `${Baseurl}posts/user/${username}`;
            case "likes":
                return `${Baseurl}posts/likes/${userId}`;
            default:
                return `${Baseurl}posts/all`;
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

    const {
        data: posts,
        isLoading,
        refetch,
        isRefetching,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch(POST_ENDPOINT, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res?.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw error;
            }
        },
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch, username]);
    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && posts?.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}
            {!isLoading && posts && (
                <div>
                    {posts?.map((post) => (
                        <Post key={post?._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};
export default Posts;
