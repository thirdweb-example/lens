import UserAvatar from "../UserAvatar/UserAvatar";

type Props = {
    title: string
}

export default function LoadingTopUserCard({ title }: Props) {
    return (
        <div className="bg-base-200 rounded-xl h-96">
            <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="mt-4">
                        <div className="bg-base-100 animate-pulse w-32 h-32 rounded-full"></div>
                    </div>
                    <div className="text-2xl font-semibold">
                        { title }
                    </div>
                    <div className="text-secondary animate-pulse bg-secondary/25 rounded-xl h-4 w-24"></div>
                    <div className="badge badge-outline badge-accent animate-pulse">loading...</div>
                </div>
                <div className="flex flex-col w-full mb-4 gap-4">
                    <div className="flex items-center justify-around">
                        <div>
                            <div className="w-16 h-4 rounded-lg animate-pulse bg-base-100"></div>
                            <div className="text-base-content/50">Followers</div>
                        </div>
                        <div>
                            <div className="w-16 h-4 rounded-lg animate-pulse bg-base-100"></div>
                            <div className="text-base-content/50">Following</div>
                        </div>
                    </div>
                    <div className="btn btn-outline btn-accent mx-4">See</div>
                </div>
            </div>
        </div>
    )
}
