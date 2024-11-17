interface AttractiveDotLoaderProps {
    color?: string
    size?: 'small' | 'medium' | 'large'
}

export default function LoadingDots({ color = 'bg-blue-500', size = 'medium' }: AttractiveDotLoaderProps) {
    const sizeClasses = {
        small: 'w-1.5 h-1.5',
        medium: 'w-2.5 h-2.5',
        large: 'w-3.5 h-3.5'
    }

    const containerSizeClasses = {
        small: 'gap-1.5',
        medium: 'gap-2',
        large: 'gap-3'
    }

    return (
        <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full bg-white opacity-25 z-10" role="status">
            <div className={`flex ${containerSizeClasses[size]}`}>
                {[0, 1, 2].map((index) => (
                    <div
                        key={index}
                        className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
                        style={{ animationDelay: `${index * 0.15}s` }}
                    ></div>
                ))}
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    )
}