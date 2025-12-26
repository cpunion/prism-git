import './index.css';

interface RepoIconProps {
    size?: number;
}

export function RepoIcon({ size = 48 }: RepoIconProps) {
    return (
        <div className="repo-icon" style={{ width: size, height: size }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M8 3L4 7V17L8 21H16L20 17V7L16 3H8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M8 12H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
