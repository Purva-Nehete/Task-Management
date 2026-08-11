interface AvatarProps {
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({
  name,
  size = 'md',
}: AvatarProps) {
  const displayName = name?.trim() || 'User';

  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  return (
    <div
      title={displayName}
      className={`flex items-center justify-center rounded-full border bg-gray-100 font-medium text-gray-700 ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  );
}