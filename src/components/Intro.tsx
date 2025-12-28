import { ScaleIcon, SearchIcon, TrophyIcon } from "lucide-react";

export default function Intro() {
    return (
        <div>
            <h3 className="text-white text-2xl text-center py-8 text-shadow shadow-persian-900">How it works</h3>
            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-8">
                <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                    <SearchIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                    <div className="relative text-center z-10">Look up the TV show you want to rank</div>
                </div>
                <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                    <ScaleIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                    <div className="relative text-center z-10">Compare episodes in 1v1 battles</div>
                </div>
                <div className="flex items-center justify-center p-12 bg-persian-800/50 rounded-md text-persian-50 relative">
                    <TrophyIcon strokeWidth={2} className="h-32 w-32 text-persian-800 absolute bottom-0 right-0" />
                    <div className="relative text-center z-10">
                        Find out how you really feel about all those episodes
                    </div>
                </div>
            </div>
        </div>
    );
}
